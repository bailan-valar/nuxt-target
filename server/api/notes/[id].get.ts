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

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '笔记ID不能为空'
      })
    }

    const prisma = getPrisma()
    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: userId
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!note) {
      throw createError({
        statusCode: 404,
        statusMessage: '笔记不存在'
      })
    }

    return {
      success: true,
      data: note
    }
  } catch (error) {
    console.error('获取笔记失败:', error)
    throw error
  }
})
