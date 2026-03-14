import { z } from 'zod'

/**
 * 目标基础验证 Schema
 */
export const goalBaseSchema = z.object({
  group: z.string().optional(),
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional()
})

/**
 * 周期验证 Schema
 */
export const periodSchema = z.object({
  periodType: z.enum(['YEAR', 'MONTH', 'WEEK']).optional(),
  periodValue: z.string().optional()
}).refine(
  (data) => {
    // 如果有 periodType，必须有 periodValue
    if (data.periodType && !data.periodValue) {
      return false
    }
    return true
  },
  {
    message: '设置周期类型时必须提供周期值',
    path: ['periodValue']
  }
).refine(
  (data) => {
    // 如果有 periodValue，必须有 periodType
    if (data.periodValue && !data.periodType) {
      return false
    }
    return true
  },
  {
    message: '设置周期值时必须提供周期类型',
    path: ['periodType']
  }
)

/**
 * 父目标验证 Schema
 */
export const parentGoalSchema = z.object({
  parentId: z.string().cuid().nullable().optional()
})

/**
 * 创建目标验证 Schema
 */
export const createGoalSchema = goalBaseSchema
  .and(periodSchema)
  .and(parentGoalSchema)

/**
 * 更新目标验证 Schema
 */
export const updateGoalSchema = goalBaseSchema
  .partial()
  .and(periodSchema.partial())
  .and(parentGoalSchema)

/**
 * 目标状态验证 Schema
 */
export const goalStatusSchema = z.enum(['active', 'completed', 'archived'])
