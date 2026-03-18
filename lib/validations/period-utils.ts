/**
 * 客户端周期工具函数
 */

export type PeriodType = 'YEAR' | 'MONTH' | 'WEEK' | 'TASK' | 'CUSTOM'

/**
 * 获取周期值的显示文本
 */
export function getPeriodLabel(periodType: PeriodType, periodValue: string, plannedStart?: string | null, plannedEnd?: string | null): string {
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
    case 'CUSTOM': {
      // 对于自定义周期，使用计划开始和结束时间
      if (plannedStart && plannedEnd) {
        const startDate = new Date(plannedStart)
        const endDate = new Date(plannedEnd)
        const formatDate = (date: Date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }
        return `${formatDate(startDate)} 至 ${formatDate(endDate)}`
      }
      return '自定义周期'
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

    case 'CUSTOM':
      return 'CUSTOM'

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
    case 'CUSTOM':
      return periodValue === 'CUSTOM'
    default:
      return false
  }
}

/**
 * 检查两个日期范围是否重叠
 */
export function doDateRangesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 <= end2 && end1 >= start2
}

/**
 * 获取年视图的日期范围
 */
export function getYearViewRange(year: number): { start: Date; end: Date } {
  return {
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31, 23, 59, 59, 999)
  }
}

/**
 * 获取月视图的日期范围
 */
export function getMonthViewRange(year: number, month: number): { start: Date; end: Date } {
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 0, 23, 59, 59, 999)
  }
}

/**
 * 获取周视图的日期范围
 */
export function getWeekViewRange(weekValue: string): { start: Date; end: Date } {
  // weekValue 格式: "YYYY-Www"
  const match = weekValue.match(/(\d+)-W(\d+)/)
  if (!match) {
    throw new Error(`Invalid week value format: ${weekValue}`)
  }

  const year = parseInt(match[1])
  const weekNumber = parseInt(match[2])

  // 计算该周的第一天(周一)
  const date = new Date(year, 0, 1)
  const firstDayOfWeek = date.getDay() || 7
  const daysToAdd = (weekNumber - 1) * 7 - (firstDayOfWeek - 1)
  date.setDate(daysToAdd + 1)

  const weekStart = new Date(date)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return { start: weekStart, end: weekEnd }
}

/**
 * 检查自定义周期目标是否与指定视图的时间范围重叠
 */
export function doesCustomPeriodOverlapWithView(
  plannedStart: string,
  plannedEnd: string,
  viewType: 'year' | 'month' | 'week',
  viewPeriodValue: string
): boolean {
  const customStart = new Date(plannedStart)
  const customEnd = new Date(plannedEnd)

  let viewRange: { start: Date; end: Date }

  switch (viewType) {
    case 'year': {
      const year = parseInt(viewPeriodValue)
      viewRange = getYearViewRange(year)
      break
    }
    case 'month': {
      const [year, month] = viewPeriodValue.split('-').map(Number)
      viewRange = getMonthViewRange(year, month)
      break
    }
    case 'week': {
      viewRange = getWeekViewRange(viewPeriodValue)
      break
    }
    default:
      return false
  }

  return doDateRangesOverlap(customStart, customEnd, viewRange.start, viewRange.end)
}
