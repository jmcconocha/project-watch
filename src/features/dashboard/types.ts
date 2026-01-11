// Priority and Status types
export type Priority = 'high' | 'medium' | 'low' | 'none'
export type ProjectStatus = 'active' | 'on-hold' | 'archived' | 'completed'
export type ViewMode = 'cards' | 'table' | 'list'

// Git information for a project
export interface GitInfo {
  branch: string
  isDirty: boolean
  commitsAhead: number
  commitsBehind: number
  openPRs: number
}

// Project data model
export interface Project {
  id: string
  name: string
  description: string
  localPath: string
  githubUrl: string | null
  priority: Priority
  status: ProjectStatus
  dueDate: string | null
  progress: number // 0-100
  lastActivity: string // ISO date
  git: GitInfo
}

// Filter state for the dashboard
export interface DashboardFilters {
  search: string
  status: ProjectStatus | 'all'
  priority: Priority | 'all'
}

// Priority display configuration
export const priorityConfig: Record<Priority, { label: string; color: string }> = {
  high: { label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  low: { label: 'Low', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  none: { label: 'None', color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500' },
}

// Status display configuration
export const statusConfig: Record<ProjectStatus, { label: string; color: string; dotColor: string }> = {
  active: { label: 'Active', color: 'text-emerald-600 dark:text-emerald-400', dotColor: 'bg-emerald-500' },
  'on-hold': { label: 'On Hold', color: 'text-amber-600 dark:text-amber-400', dotColor: 'bg-amber-500' },
  archived: { label: 'Archived', color: 'text-slate-400 dark:text-slate-500', dotColor: 'bg-slate-400' },
  completed: { label: 'Completed', color: 'text-cyan-600 dark:text-cyan-400', dotColor: 'bg-cyan-500' },
}

// Utility functions
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// Filter projects based on current filters
export function filterProjects(projects: Project[], filters: DashboardFilters): Project[] {
  return projects.filter((project) => {
    // Search matches name or description
    if (filters.search) {
      const query = filters.search.toLowerCase()
      if (
        !project.name.toLowerCase().includes(query) &&
        !project.description.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Status filter
    if (filters.status !== 'all' && project.status !== filters.status) {
      return false
    }

    // Priority filter
    if (filters.priority !== 'all' && project.priority !== filters.priority) {
      return false
    }

    return true
  })
}
