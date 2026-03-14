export type GoalStatus = 'active' | 'completed' | 'archived'
export type PeriodType = 'YEAR' | 'MONTH' | 'WEEK'

export interface Goal {
  id: string
  user_id: string
  parent_id: string | null
  group: string | null
  title: string
  description: string | null
  status: GoalStatus
  period_type: PeriodType | null
  period_value: string | null
  created_at: string
  updated_at: string
  parent?: Goal | null
  children?: Goal[]
}

export interface CreateGoalInput {
  group?: string
  title: string
  description?: string
  status?: GoalStatus
  periodType?: PeriodType
  periodValue?: string
  parentId?: string | null
}

export interface UpdateGoalInput {
  group?: string
  title?: string
  description?: string
  status?: GoalStatus
  periodType?: PeriodType
  periodValue?: string
  parentId?: string | null
}
