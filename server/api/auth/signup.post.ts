import { signupSchema } from '~/server/utils/validation'
import { hashPassword } from '~/server/utils/auth'
import { checkRateLimit } from '~/server/utils/rateLimit'
import { getPrisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    checkRateLimit(event)

    const body = await readBody(event)
    const { email, password } = signupSchema.parse(body)

    const prisma = getPrisma()
    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      throw createError({ statusCode: 409, message: 'Email already registered' })
    }

    const hashedPassword = await hashPassword(password)
    await prisma.user.create({
      data: { email, password: hashedPassword }
    })

    return { success: true, message: 'Account created' }
  } catch (error: any) {
    if (error.statusCode) throw error
    if (error.name === 'ZodError') {
      throw createError({ statusCode: 400, message: 'Invalid input' })
    }
    throw createError({ statusCode: 500, message: 'Server error' })
  }
})
