import { getPrisma } from '~/server/utils/db'
import { z } from 'zod'

const reorderSchema = z.object({
  notes: z.array(z.object({
    id: z.string(),
    sortOrder: z.number()
  }))
})

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user?.id

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const body = await readBody(event)
    const { notes } = reorderSchema.parse(body)

    const prisma = getPrisma()

    // 批量更新排序
    await Promise.all(
      notes.map(({ id, sortOrder }) =>
        prisma.note.updateMany({
          where: {
            id,
            userId: userId
          },
          data: { sortOrder }
        })
      )
    )

    return {
      success: true,
      message: '排序更新成功'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0].message
      })
    }

    console.error('更新笔记排序失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '更新笔记排序失败'
    })
  }
})
