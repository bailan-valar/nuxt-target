import { z } from 'zod'
import { getPrisma } from '~/server/utils/db'

const createSchema = z.object({
  group: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const data = createSchema.parse(body)

  const prisma = getPrisma()
  const goal = await prisma.goal.create({
    data: {
      ...data,
      userId
    }
  })

  return { success: true, data: goal }
})
