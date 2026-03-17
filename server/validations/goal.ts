import { z } from 'zod'

/**
 * 目标状态验证 Schema
 * 必须在其他使用它的 schema 之前定义
 */
export const goalStatusSchema = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'COMPLETED', 'ABANDONED'])

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
  periodType: z.enum(['YEAR', 'MONTH', 'WEEK', 'TASK']).optional(),
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
 * 时间规划基础验证 Schema (不包含refinement，用于partial)
 */
export const timePlanningBaseSchema = z.object({
  plannedStart: z.string().datetime().nullable().optional(),
  plannedEnd: z.string().datetime().nullable().optional(),
  nextExecution: z.string().datetime().nullable().optional()
})

/**
 * 时间规划验证 Schema (带时间范围检查，用于创建)
 */
export const timePlanningSchema = timePlanningBaseSchema.refine(
  (data) => {
    // 如果有开始时间和结束时间，结束时间必须晚于开始时间
    if (data.plannedStart && data.plannedEnd) {
      const start = new Date(data.plannedStart)
      const end = new Date(data.plannedEnd)
      return end > start
    }
    return true
  },
  {
    message: '结束时间必须晚于开始时间',
    path: ['plannedEnd']
  }
)

/**
 * 创建目标验证 Schema
 */
export const createGoalSchema = goalBaseSchema
  .and(z.object({
    status: goalStatusSchema.optional()
  }))
  .and(periodSchema)
  .and(parentGoalSchema)
  .and(folderSchema)
  .and(timePlanningSchema)

/**
 * 更新目标验证 Schema
 */
export const updateGoalSchema = goalBaseSchema
  .partial()
  .and(periodBaseSchema.partial())
  .and(parentGoalSchema)
  .and(folderSchema.partial())
  .and(timePlanningBaseSchema.partial())
