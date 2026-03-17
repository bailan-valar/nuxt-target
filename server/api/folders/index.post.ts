import { getPrisma } from '~/server/utils/db'
import { createFolderSchema } from '~/server/validations/folder'
import { wouldCreateFolderCycle } from '~/server/utils/folder-hierarchy'

// 文件夹类型层级顺序
const TYPE_HIERARCHY = ['SCENE', 'GROUP', 'PROJECT', 'SUBPROJECT'] as const
type FolderType = typeof TYPE_HIERARCHY[number]

// 获取类型的层级级别
function getTypeLevel(type: FolderType): number {
  return TYPE_HIERARCHY.indexOf(type)
}

// 根据父文件夹类型获取可用的子类型
function getAvailableChildTypes(parentType: FolderType | null): FolderType[] {
  if (!parentType) {
    // 根级别，只能创建场景
    return ['SCENE']
  }

  const parentLevel = getTypeLevel(parentType)
  const nextLevel = parentLevel + 1

  if (nextLevel >= TYPE_HIERARCHY.length) {
    // 已经是最后一级，不能创建子文件夹
    return []
  }

  return [TYPE_HIERARCHY[nextLevel]]
}

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const data = createFolderSchema.parse(body)

  const prisma = getPrisma()

  // 验证父folder
  let parentFolder = null
  if (data.parentId) {
    // 检查父folder是否存在
    parentFolder = await prisma.folder.findUnique({
      where: { id: data.parentId }
    })

    if (!parentFolder) {
      throw createError({ statusCode: 400, message: '父文件夹不存在' })
    }

    // 检查父folder是否属于当前用户
    if (parentFolder.userId !== userId) {
      throw createError({ statusCode: 403, message: '无权使用该父文件夹' })
    }

    // 检查是否会造成循环依赖
    const hasCycle = await wouldCreateFolderCycle(null, data.parentId, prisma)
    if (hasCycle) {
      throw createError({ statusCode: 400, message: '不能创建循环依赖关系' })
    }

    // 验证类型层级关系
    const availableTypes = getAvailableChildTypes(parentFolder.type as FolderType)
    if (!availableTypes.includes(data.type as FolderType)) {
      const typeNames = {
        SCENE: '场景',
        GROUP: '分组',
        PROJECT: '项目',
        SUBPROJECT: '子项目'
      }
      const parentTypeName = typeNames[parentFolder.type as keyof typeof typeNames]
      const childTypeName = typeNames[data.type as keyof typeof typeNames]
      throw createError({
        statusCode: 400,
        message: `${parentTypeName}下不能创建${childTypeName}，只能创建${typeNames[availableTypes[0] as keyof typeof typeNames]}`
      })
    }
  } else {
    // 没有父文件夹，只能是场景类型
    if (data.type !== 'SCENE') {
      throw createError({
        statusCode: 400,
        message: '根级别文件夹只能是场景类型'
      })
    }
  }

  const folder = await prisma.folder.create({
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      icon: data.icon,
      color: data.color,
      sortOrder: data.sortOrder ?? 0,
      parentId: data.parentId,
      userId
    }
  })

  return { success: true, data: folder }
})
