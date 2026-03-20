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
        userId
      }
    })

    if (!existingNote) {
      throw createError({
        statusCode: 404,
        statusMessage: '笔记不存在'
      })
    }

    // 获取当前用户笔记列表中最小的sortOrder
    const minSortOrder = await prisma.note.findFirst({
      where: {
        userId
      },
      orderBy: {
        sortOrder: 'asc'
      },
      select: {
        sortOrder: true
      }
    })

    // 将笔记的sortOrder设置为最小值-1（移到最上层）
    const newSortOrder = minSortOrder ? minSortOrder.sortOrder - 1 : 0

    const note = await prisma.note.update({
      where: { id },
      data: {
        isPinned: !existingNote.isPinned,
        sortOrder: newSortOrder
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

    return {
      success: true,
      data: note
    }
  } catch (error) {
    console.error('置顶笔记失败:', error)
    throw error
  }
})
