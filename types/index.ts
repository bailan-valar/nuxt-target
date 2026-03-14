export type GoalStatus = 'active' | 'completed' | 'archived'

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  status: GoalStatus
  created_at: string
  updated_at: string
}

export interface CreateGoalInput {
  title: string
  description?: string
  status?: GoalStatus
}

export interface UpdateGoalInput {
  title?: string
  description?: string
  status?: GoalStatus
}
