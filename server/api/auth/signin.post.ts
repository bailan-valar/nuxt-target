import { signinSchema } from '~/server/utils/validation'
import { verifyPassword, setAuthCookie } from '~/server/utils/auth'
import { checkRateLimit } from '~/server/utils/rateLimit'
import { getPrisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    checkRateLimit(event)

    const body = await readBody(event)
    const { email, password, rememberMe } = signinSchema.parse(body)

    const prisma = getPrisma()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await verifyPassword(password, user.password))) {
      throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    setAuthCookie(event, user.id, rememberMe)

    const { password: _, ...userWithoutPassword } = user
    return { success: true, data: { user: userWithoutPassword } }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.name === 'ZodError') {
      throw createError({ statusCode: 400, message: 'Invalid input' })
    }
    throw createError({ statusCode: 500, message: 'Server error' })
  }
})
