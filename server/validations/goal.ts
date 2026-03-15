import { z } from 'zod'

/**
 * 目标基础验证 Schema
 */
export const goalBaseSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional()
})

/**
 * 周期基础验证 Schema
 */
export const periodBaseSchema = z.object({
  periodType: z.enum(['YEAR', 'MONTH', 'WEEK']).optional(),
  periodValue: z.string().optional()
})

/**
 * 周期验证（带关联检查）
 */
export const periodSchema = periodBaseSchema.refine(
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
 * 文件夹验证 Schema
 */
export const folderSchema = z.object({
  folderId: z.string().cuid().nullable().optional()
})

/**
 * 创建目标验证 Schema
 */
export const createGoalSchema = goalBaseSchema
  .and(periodSchema)
  .and(parentGoalSchema)
  .and(folderSchema)

/**
 * 更新目标验证 Schema
 */
export const updateGoalSchema = goalBaseSchema
  .partial()
  .and(periodBaseSchema.partial())
  .and(parentGoalSchema)
  .and(folderSchema.partial())

/**
 * 目标状态验证 Schema
 */
export const goalStatusSchema = z.enum(['active', 'completed', 'archived'])
