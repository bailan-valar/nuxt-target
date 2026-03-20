import { z } from 'zod'
import { getPrisma } from '~/server/utils/db'

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const params = event.context.params
  const { id } = paramsSchema.parse(params)

  const prisma = getPrisma()

  const goal = await prisma.goal.findFirst({
    where: {
      id,
      userId
    },
    include: {
      folder: {
        select: {
          id: true,
          name: true,
          type: true
        }
      },
      parent: {
        include: {
          folder: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        }
      },
      children: {
        include: {
          folder: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        },
        orderBy: [
          { sortOrder: 'desc' },
          { createdAt: 'desc' }
        ]
      },
      notes: {
        orderBy: [
          { sortOrder: 'desc' },
          { createdAt: 'desc' }
        ]
      }
    }
  })

  if (!goal) {
    throw createError({ statusCode: 404, message: '目标不存在' })
  }

  return { success: true, data: goal }
})
