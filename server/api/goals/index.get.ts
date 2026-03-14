import { z } from 'zod'
import { getPrisma } from '~/server/utils/db'

const querySchema = z.object({
  status: z.enum(['active', 'completed', 'archived']).optional()
})

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const prisma = getPrisma()
  const query = getQuery(event)
  const { status } = querySchema.parse(query)

  const goals = await prisma.goal.findMany({
    where: {
      userId,
      ...(status && { status })
    },
    orderBy: { createdAt: 'desc' }
  })

  return { success: true, data: goals }
})
