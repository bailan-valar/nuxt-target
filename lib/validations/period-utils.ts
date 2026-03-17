/**
 * 客户端周期工具函数
 */

export type PeriodType = 'YEAR' | 'MONTH' | 'WEEK' | 'TASK'

/**
 * 获取周期值的显示文本
 */
export function getPeriodLabel(periodType: PeriodType, periodValue: string): string {
  switch (periodType) {
    case 'YEAR':
      return `${periodValue}年`
    case 'MONTH': {
      const [year, month] = periodValue.split('-')
      return `${year}年${month}月`
    }
    case 'WEEK': {
      const [weekYear, week] = periodValue.split('-W')
      return `${weekYear}年第${week}周`
    }
    case 'TASK': {
      const [year, month, day] = periodValue.split('-')
      return `${year}年${month}月${day}日`
    }
    default:
      return periodValue
  }
}

/**
 * 获取当前周期的周期值
 */
export function getCurrentPeriodValue(periodType: PeriodType): string {
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

/**
 * 验证周期值格式
 */
export function validatePeriodValue(periodType: PeriodType, periodValue: string): boolean {
  if (!periodValue) return false

  switch (periodType) {
    case 'YEAR':
      return /^\d{4}$/.test(periodValue)
    case 'MONTH':
      return /^\d{4}-\d{2}$/.test(periodValue)
    case 'WEEK':
      return /^\d{4}-W\d{2}$/.test(periodValue)
    case 'TASK':
      return /^\d{4}-\d{2}-\d{2}$/.test(periodValue)
    default:
      return false
  }
}
