import { getPrisma } from '~/server/utils/db'
import { getFolderDescendantIds } from '~/server/utils/folder-hierarchy'

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const folderId = getRouterParam(event, 'id')
  if (!folderId) {
    throw createError({ statusCode: 400, message: 'Folder ID is required' })
  }

  const query = getQuery(event)
  const force = query.force === 'true'

  const prisma = getPrisma()

  // 验证folder是否属于当前用户
  const existingFolder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: {
      _count: {
        select: {
          children: true,
          goals: true
        }
      }
    }
  })

  if (!existingFolder) {
    throw createError({ statusCode: 404, message: '文件夹不存在' })
  }

  if (existingFolder.userId !== userId) {
    throw createError({ statusCode: 403, message: '无权删除该文件夹' })
  }

  // 检查是否有子内容
  const hasChildren = existingFolder._count.children > 0
  const hasGoals = existingFolder._count.goals > 0

  if (!force && (hasChildren || hasGoals)) {
    throw createError({
      statusCode: 400,
      message: '文件夹包含子内容，请先清空或使用force=true强制删除'
    })
  }

  if (force) {
    // 获取所有后代folder IDs
    const descendantIds = await getFolderDescendantIds(folderId, prisma)
    const allFolderIds = [folderId, ...descendantIds]

    // 删除所有后代folder及其goals
    await prisma.$transaction([
      // 将所有goals的folderId设置为null
      prisma.goal.updateMany({
        where: { folderId: { in: allFolderIds } },
        data: { folderId: null }
      }),
      // 删除所有子folder
      prisma.folder.deleteMany({
        where: { id: { in: allFolderIds } }
      })
    ])
  } else {
    // 普通删除
    await prisma.folder.delete({
      where: { id: folderId }
    })
  }

  return { success: true, message: '文件夹已删除' }
})
