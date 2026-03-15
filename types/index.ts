export type GoalStatus = 'active' | 'completed' | 'archived'
export type PeriodType = 'YEAR' | 'MONTH' | 'WEEK'

export type FolderType = 'SCENE' | 'GROUP' | 'PROJECT' | 'SUBPROJECT'

export interface Goal {
  id: string
  userId: string
  parentId: string | null
  folderId: string | null
  title: string
  description: string | null
  status: GoalStatus
  periodType: PeriodType | null
  periodValue: string | null
  createdAt: string
  updatedAt: string
  parent?: Goal | null
  folder?: Folder | null
  children?: Goal[]
}

export interface CreateGoalInput {
  title: string
  description?: string
  status?: GoalStatus
  periodType?: PeriodType
  periodValue?: string
  parentId?: string | null
}

export interface UpdateGoalInput {
  title?: string
  description?: string
  status?: GoalStatus
  periodType?: PeriodType
  periodValue?: string
  parentId?: string | null
  folderId?: string | null
}

export interface Folder {
  id: string
  userId: string
  parentId: string | null
  name: string
  type: FolderType
  description: string | null
  icon: string | null
  color: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  parent?: Folder | null
  children?: Folder[]
  goals?: Goal[]
  _count?: {
    children: number
    goals: number
  }
}

export interface FolderTreeNode extends Folder {
  depth: number
  path: Folder[]
  isOpen: boolean
}

export interface CreateFolderInput {
  name: string
  type: FolderType
  description?: string
  icon?: string
  color?: string
  parentId?: string | null
  sortOrder?: number
}

export interface UpdateFolderInput {
  name?: string
  type?: FolderType
  description?: string
  icon?: string
  color?: string
  sortOrder?: number
  parentId?: string | null
}

export interface MoveFolderInput {
  newParentId: string | null
  newSortOrder?: number
}

export interface FolderTreeOptions {
  expandAll?: boolean
  expandIds?: string[]
  maxDepth?: number
  includeGoals?: boolean
  types?: FolderType[]
}

export interface User {
  id: string
  email: string
  name?: string | null
  createdAt: string
  updatedAt: string
}

