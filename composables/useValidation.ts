import { z } from 'zod'

export const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['active', 'completed', 'archived']).default('active')
})

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['active', 'completed', 'archived']).optional()
})

export function useValidation() {
  const validateGoal = (data: unknown) => {
    return goalSchema.parse(data)
  }

  const validateGoalUpdate = (data: unknown) => {
    return updateGoalSchema.parse(data)
  }

  return {
    validateGoal,
    validateGoalUpdate
  }
}
