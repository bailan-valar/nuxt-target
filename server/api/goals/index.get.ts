import { z } from 'zod'
import { getPrisma } from '~/server/utils/db'
import { periodTypeSchema } from '../../validations/period'

const querySchema = z.object({
  status: z.enum(['active', 'completed', 'archived']).optional(),
  periodType: periodTypeSchema.optional(),
  periodValue: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const prisma = getPrisma()
  const query = getQuery(event)
  const { status, periodType, periodValue } = querySchema.parse(query)

  const goals = await prisma.goal.findMany({
    where: {
      userId,
      ...(status && { status }),
      ...(periodType && { periodType }),
      ...(periodValue && { periodValue })
    },
    include: {
      parent: {
        select: {
          id: true,
          title: true,
          status: true,
          periodType: true,
          periodValue: true
        }
      },
      children: {
        select: {
          id: true,
          title: true,
          status: true,
          periodType: true,
          periodValue: true,
          sortOrder: true
        }
      }
    },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return { success: true, data: goals }
})
