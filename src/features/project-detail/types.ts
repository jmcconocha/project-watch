// =============================================================================
// Data Types
// =============================================================================

export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'archived'
export type ProjectPriority = 'high' | 'medium' | 'low' | 'none'
export type TaskPriority = 'high' | 'medium' | 'low'
export type PRStatus = 'open' | 'review_requested' | 'approved' | 'changes_requested'

export interface LastCommit {
  hash: string
  message: string
  author: string
  timestamp: string
}

export interface PullRequest {
  number: number
  title: string
  author: string
  status: PRStatus
  url: string
}

export interface GitStatus {
  branch: string
  isDirty: boolean
  uncommittedFiles: number
  commitsAhead: number
  commitsBehind: number
  lastCommit: LastCommit
}

export interface GitHubStatus {
  openPRs: PullRequest[]
  openIssues: number
  lastSynced: string
}

export interface ProjectDetail {
  id: string
  name: string
  description: string
  localPath: string
  githubUrl: string | null
  priority: ProjectPriority
  status: ProjectStatus
  dueDate: string | null
  notes: string
  git: GitStatus
  github: GitHubStatus
}

export interface Column {
  id: string
  title: string
  order: number
}

export interface Task {
  id: string
  columnId: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string | null
  labels: string[]
  createdAt: string
  order: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface ProjectDetailViewProps {
  project: ProjectDetail
  columns: Column[]
  tasks: Task[]
  onEditName?: (name: string) => void
  onEditStatus?: (status: ProjectStatus) => void
  onEditPriority?: (priority: ProjectPriority) => void
  onEditDueDate?: (dueDate: string | null) => void
  onSaveNotes?: (notes: string) => void
  onCreateTask?: (columnId: string) => void
  onEditTask?: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask?: (taskId: string) => void
  onMoveTask?: (taskId: string, toColumnId: string, toOrder: number) => void
  onOpenInEditor?: () => void
  onOpenInTerminal?: () => void
  onOpenInFinder?: () => void
  onOpenInGitHub?: () => void
  onOpenInClaudeCode?: () => void
  onBack?: () => void
}

// =============================================================================
// Config Objects
// =============================================================================

export const statusConfig: Record<ProjectStatus, { label: string; color: string; dot: string }> = {
  active: { label: 'Active', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  'on-hold': { label: 'On Hold', color: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  completed: { label: 'Completed', color: 'text-cyan-600 dark:text-cyan-400', dot: 'bg-cyan-500' },
  archived: { label: 'Archived', color: 'text-slate-400 dark:text-slate-500', dot: 'bg-slate-400' },
}

export const priorityConfig: Record<ProjectPriority, { label: string; color: string }> = {
  high: { label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  low: { label: 'Low', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
  none: { label: 'None', color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500' },
}

export const taskPriorityConfig: Record<TaskPriority, { borderColor: string; dotColor: string }> = {
  high: { borderColor: 'border-l-red-500', dotColor: 'bg-red-500' },
  medium: { borderColor: 'border-l-amber-500', dotColor: 'bg-amber-500' },
  low: { borderColor: 'border-l-slate-400', dotColor: 'bg-slate-400' },
}

export const labelColors: Record<string, string> = {
  feature: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  ui: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  ux: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  setup: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  design: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  enhancement: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'tech-debt': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  refactor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  performance: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

export const columnHeaderColors: Record<string, string> = {
  backlog: 'bg-slate-100 dark:bg-slate-800',
  todo: 'bg-amber-50 dark:bg-amber-950/30',
  'in-progress': 'bg-cyan-50 dark:bg-cyan-950/30',
  'in-review': 'bg-purple-50 dark:bg-purple-950/30',
  done: 'bg-emerald-50 dark:bg-emerald-950/30',
}

export const columnAccentColors: Record<string, string> = {
  backlog: 'bg-slate-400',
  todo: 'bg-amber-400',
  'in-progress': 'bg-cyan-500',
  'in-review': 'bg-purple-500',
  done: 'bg-emerald-500',
}

export const prStatusConfig: Record<PRStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  review_requested: { label: 'Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  approved: { label: 'Approved', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400' },
  changes_requested: { label: 'Changes', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
}

// =============================================================================
// Utility Functions
// =============================================================================

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'No due date'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTaskDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
