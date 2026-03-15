import { getPrisma } from '~/server/utils/db'

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
  const status = query.status as string | undefined

  const prisma = getPrisma()

  // 验证folder是否属于当前用户
  const folder = await prisma.folder.findUnique({
    where: { id: folderId }
  })

  if (!folder) {
    throw createError({ statusCode: 404, message: '文件夹不存在' })
  }

  if (folder.userId !== userId) {
    throw createError({ statusCode: 403, message: '无权访问该文件夹' })
  }

  // 获取folder下的goals
  const goals = await prisma.goal.findMany({
    where: {
      folderId,
      userId,
      ...(status && { status })
    },
    include: {
      parent: {
        select: {
          id: true,
          title: true,
          status: true
        }
      },
      children: {
        select: {
          id: true,
          title: true,
          status: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { success: true, data: goals }
})
