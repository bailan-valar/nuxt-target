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

    // 验证笔记是否存在且属于当前用户
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: userId
      }
    })

    if (!existingNote) {
      throw createError({
        statusCode: 404,
        statusMessage: '笔记不存在'
      })
    }

    await prisma.note.delete({
      where: { id }
    })

    return {
      success: true,
      message: '删除成功'
    }
  } catch (error) {
    console.error('删除笔记失败:', error)
    throw error
  }
})
