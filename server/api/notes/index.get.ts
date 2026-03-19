import { getPrisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user?.id

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const query = getQuery(event)
    const folderId = query.folderId as string | undefined

    const where: any = {
      userId: userId
    }

    if (folderId) {
      where.folderId = folderId
    }

    const prisma = getPrisma()
    const notes = await prisma.note.findMany({
      where,
      include: {
        folder: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { sortOrder: 'asc' },
        { updatedAt: 'desc' }
      ]
    })

    return {
      success: true,
      data: notes
    }
  } catch (error) {
    console.error('获取笔记列表失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取笔记列表失败'
    })
  }
})
