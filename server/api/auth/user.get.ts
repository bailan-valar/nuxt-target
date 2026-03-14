import { getUserIdFromCookie } from '~/server/utils/auth'
import { getPrisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const userId = getUserIdFromCookie(event)

    if (!userId) {
      return { success: true, data: { user: null } }
    }

    const prisma = getPrisma()
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      return { success: true, data: { user: null } }
    }

    const { password: _, ...userWithoutPassword } = user
    return { success: true, data: { user: userWithoutPassword } }
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Server error' })
  }
})
