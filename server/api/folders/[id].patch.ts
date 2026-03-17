import { getPrisma } from '~/server/utils/db'
import { updateFolderSchema } from '~/server/validations/folder'
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

  const folderId = getRouterParam(event, 'id')
  if (!folderId) {
    throw createError({ statusCode: 400, message: 'Folder ID is required' })
  }

  const body = await readBody(event)
  const data = updateFolderSchema.parse(body)

  const prisma = getPrisma()

  // 验证folder是否属于当前用户
  const existingFolder = await prisma.folder.findUnique({
    where: { id: folderId }
  })

  if (!existingFolder) {
    throw createError({ statusCode: 404, message: '文件夹不存在' })
  }

  if (existingFolder.userId !== userId) {
    throw createError({ statusCode: 403, message: '无权修改该文件夹' })
  }

  // 验证父folder
  if (data.parentId !== undefined) {
    if (data.parentId === folderId) {
      throw createError({
        statusCode: 400,
        message: '文件夹不能设置自己为父文件夹'
      })
    }

    if (data.parentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: data.parentId }
      })

      if (!parentFolder) {
        throw createError({ statusCode: 400, message: '父文件夹不存在' })
      }

      if (parentFolder.userId !== userId) {
        throw createError({ statusCode: 403, message: '无权使用该父文件夹' })
      }

      // 检查循环依赖
      const hasCycle = await wouldCreateFolderCycle(
        folderId,
        data.parentId,
        prisma
      )
      if (hasCycle) {
        throw createError({ statusCode: 400, message: '不能创建循环依赖关系' })
      }

      // 验证类型层级关系（如果修改了类型）
      const folderType = (data.type ?? existingFolder.type) as FolderType
      const availableTypes = getAvailableChildTypes(parentFolder.type as FolderType)
      if (!availableTypes.includes(folderType)) {
        const typeNames = {
          SCENE: '场景',
          GROUP: '分组',
          PROJECT: '项目',
          SUBPROJECT: '子项目'
        }
        const parentTypeName = typeNames[parentFolder.type as keyof typeof typeNames]
        const childTypeName = typeNames[folderType as keyof typeof typeNames]
        throw createError({
          statusCode: 400,
          message: `${parentTypeName}下不能创建${childTypeName}，只能创建${typeNames[availableTypes[0] as keyof typeof typeNames]}`
        })
      }
    } else {
      // 如果清空父文件夹，文件夹必须是场景类型
      const folderType = (data.type ?? existingFolder.type) as FolderType
      if (folderType !== 'SCENE') {
        throw createError({
          statusCode: 400,
          message: '根级别文件夹只能是场景类型'
        })
      }
    }
  } else if (data.type !== undefined) {
    // 如果只修改类型，没有修改父文件夹，也要验证类型关系
    if (existingFolder.parentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: existingFolder.parentId }
      })

      if (parentFolder) {
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
      }
    } else {
      // 根级别的文件夹只能是场景类型
      if (data.type !== 'SCENE') {
        throw createError({
          statusCode: 400,
          message: '根级别文件夹只能是场景类型'
        })
      }
    }
  }

  // 更新folder
  const folder = await prisma.folder.update({
    where: { id: folderId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.parentId !== undefined && { parentId: data.parentId })
    }
  })

  return { success: true, data: folder }
})
