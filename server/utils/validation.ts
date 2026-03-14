import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email().max(255).trim(),
  password: z.string().min(8).max(100)
})

export const signinSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false)
})
