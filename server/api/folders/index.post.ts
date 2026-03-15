import { getPrisma } from '~/server/utils/db'
import { createFolderSchema } from '~/server/validations/folder'
import { wouldCreateFolderCycle } from '~/server/utils/folder-hierarchy'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const data = createFolderSchema.parse(body)

  const prisma = getPrisma()

  // 验证父folder
  if (data.parentId) {
    // 检查父folder是否存在
    const parentFolder = await prisma.folder.findUnique({
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
