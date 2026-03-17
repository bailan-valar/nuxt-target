import { z } from 'zod'

/**
 * 周期类型验证
 */
export const periodTypeSchema = z.enum(['YEAR', 'MONTH', 'WEEK', 'TASK'], {
  errorMap: () => ({ message: '周期类型必须是 YEAR、MONTH、WEEK 或 TASK' })
})

/**
 * 周期值格式验证
 * YEAR: 2025
 * MONTH: 2025-03
 * WEEK: 2025-W11
 * TASK: 2025-03-17
 */
export const periodValueSchema = z.string().regex(
  /^\d{4}(-W\d{2})?(-\d{2})?(-\d{2})?$/,
  {
    message: '周期值格式错误：年目标使用 YYYY（如2025），月目标使用 YYYY-MM（如2025-03），周目标使用 YYYY-Www（如2025-W11），任务使用 YYYY-MM-DD（如2025-03-17）'
  }
)

/**
 * 根据周期类型验证周期值的格式
 */
export const createPeriodSchema = z.object({
  periodType: periodTypeSchema.optional(),
  periodValue: z.string().optional()
}).refine(
  (data) => {
    // 如果都没有提供，验证通过（可选字段）
    if (!data.periodType && !data.periodValue) return true
    // 如果只提供其中一个，验证失败
    if (data.periodType && !data.periodValue) return false
    if (!data.periodType && data.periodValue) return false
    return true
  },
  {
    message: '周期类型和周期值必须同时提供或同时为空',
    path: ['periodType']
  }
).refine(
  (data) => {
    // 如果都有提供，验证周期值格式是否匹配周期类型
    if (!data.periodType || !data.periodValue) return true

    const { periodType, periodValue } = data

    switch (periodType) {
      case 'YEAR':
        // 年目标：YYYY
        return /^\d{4}$/.test(periodValue)
      case 'MONTH':
        // 月目标：YYYY-MM
        return /^\d{4}-\d{2}$/.test(periodValue)
      case 'WEEK':
        // 周目标：YYYY-Www
        return /^\d{4}-W\d{2}$/.test(periodValue)
      case 'TASK':
        // 任务：YYYY-MM-DD
        return /^\d{4}-\d{2}-\d{2}$/.test(periodValue)
      default:
        return false
    }
  },
  {
    message: '周期值格式与周期类型不匹配',
    path: ['periodValue']
  }
)

/**
 * 验证周期值并返回格式化后的值
 */
export function formatPeriodValue(periodType: 'YEAR' | 'MONTH' | 'WEEK' | 'TASK', value: string): string {
  const trimmed = value.trim()

  switch (periodType) {
    case 'YEAR':
      // 确保是4位年份
      const yearMatch = trimmed.match(/^(\d{4})/)
      if (!yearMatch) throw new Error('无效的年份格式')
      return yearMatch[1]

    case 'MONTH':
      // 确保是 YYYY-MM 格式
      const monthMatch = trimmed.match(/^(\d{4})-?(\d{2})$/)
      if (!monthMatch) throw new Error('无效的月份格式，应为 YYYY-MM')
      return `${monthMatch[1]}-${monthMatch[2]}`

    case 'WEEK':
      // 确保是 YYYY-Www 格式
      const weekMatch = trimmed.match(/^(\d{4})-?W?(\d{2})$/i)
      if (!weekMatch) throw new Error('无效的周格式，应为 YYYY-Www')
      return `${weekMatch[1]}-W${weekMatch[2]}`

    case 'TASK':
      // 确保是 YYYY-MM-DD 格式
      const taskMatch = trimmed.match(/^(\d{4})-?(\d{2})-?(\d{2})$/)
      if (!taskMatch) throw new Error('无效的任务日期格式，应为 YYYY-MM-DD')
      return `${taskMatch[1]}-${taskMatch[2]}-${taskMatch[3]}`

    default:
      throw new Error('无效的周期类型')
  }
}

/**
 * 获取周期值的显示文本
 */
export function getPeriodLabel(periodType: 'YEAR' | 'MONTH' | 'WEEK' | 'TASK', periodValue: string): string {
  switch (periodType) {
    case 'YEAR':
      return `${periodValue}年`
    case 'MONTH':
      const [year, month] = periodValue.split('-')
      return `${year}年${month}月`
    case 'WEEK':
      const [weekYear, week] = periodValue.split('-W')
      return `${weekYear}年第${week}周`
    case 'TASK':
      return periodValue // 直接返回日期格式 YYYY-MM-DD
    default:
      return periodValue
  }
}

/**
 * 获取当前周期的周期值
 */
export function getCurrentPeriodValue(periodType: 'YEAR' | 'MONTH' | 'WEEK' | 'TASK'): string {
  const now = new Date()

  switch (periodType) {
    case 'YEAR':
      return now.getFullYear().toString()

    case 'MONTH': {
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    }

    case 'WEEK': {
      const year = now.getFullYear()
      // 获取ISO周数
      const startOfYear = new Date(year, 0, 1)
      const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000
      const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)
      const week = String(weekNumber).padStart(2, '0')
      return `${year}-W${week}`
    }

    case 'TASK': {
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    default:
      throw new Error('无效的周期类型')
  }
}
