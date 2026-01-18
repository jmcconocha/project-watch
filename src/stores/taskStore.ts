import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, Column } from '../features/project-detail/types'

// Extended task type with GitHub issue linking
export interface LinkedTask extends Task {
  // GitHub issue linking
  githubIssueNumber?: number
  githubIssueUrl?: string
  githubIssueState?: 'open' | 'closed'
  githubSyncedAt?: string
  isFromGitHub?: boolean
  // Assignee from GitHub
  assignee?: string
  assigneeAvatarUrl?: string
}

// Sync status for tracking GitHub operations
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success'

interface ProjectTasks {
  tasks: LinkedTask[]
  lastModified: string
  githubSyncedAt?: string
}

interface TaskStore {
  // State - tasks organized by project ID
  tasksByProject: Record<string, ProjectTasks>
  syncStatus: Record<string, SyncStatus>
  syncError: Record<string, string | null>

  // Task CRUD Actions
  getTasks: (projectId: string) => LinkedTask[]
  addTask: (projectId: string, task: LinkedTask) => void
  updateTask: (projectId: string, taskId: string, updates: Partial<LinkedTask>) => void
  deleteTask: (projectId: string, taskId: string) => void
  moveTask: (projectId: string, taskId: string, toColumnId: string, toOrder: number) => void

  // Bulk operations
  setTasks: (projectId: string, tasks: LinkedTask[]) => void
  mergeTasks: (projectId: string, tasks: LinkedTask[]) => void
  clearTasks: (projectId: string) => void

  // GitHub sync tracking
  setSyncStatus: (projectId: string, status: SyncStatus) => void
  setSyncError: (projectId: string, error: string | null) => void
  setGithubSyncedAt: (projectId: string, timestamp: string) => void

  // Selectors
  getTasksByColumn: (projectId: string, columnId: string) => LinkedTask[]
  getTaskById: (projectId: string, taskId: string) => LinkedTask | undefined
  getGitHubLinkedTasks: (projectId: string) => LinkedTask[]
  getLocalOnlyTasks: (projectId: string) => LinkedTask[]
}

// Default columns for projects
export const defaultColumns: Column[] = [
  { id: 'backlog', title: 'Backlog', order: 0 },
  { id: 'todo', title: 'To Do', order: 1 },
  { id: 'in-progress', title: 'In Progress', order: 2 },
  { id: 'in-review', title: 'In Review', order: 3 },
  { id: 'done', title: 'Done', order: 4 },
]

// Map GitHub issue labels to column IDs
export function mapGitHubLabelToColumn(labels: string[]): string {
  const labelSet = new Set(labels.map(l => l.toLowerCase()))

  if (labelSet.has('done') || labelSet.has('completed')) return 'done'
  if (labelSet.has('in review') || labelSet.has('review') || labelSet.has('in-review')) return 'in-review'
  if (labelSet.has('in progress') || labelSet.has('wip') || labelSet.has('in-progress')) return 'in-progress'
  if (labelSet.has('todo') || labelSet.has('to do') || labelSet.has('ready')) return 'todo'

  return 'backlog' // Default to backlog
}

// Map GitHub issue labels to task priority
export function mapGitHubLabelToPriority(labels: string[]): 'high' | 'medium' | 'low' {
  const labelSet = new Set(labels.map(l => l.toLowerCase()))

  if (labelSet.has('critical') || labelSet.has('urgent') || labelSet.has('priority: high') || labelSet.has('p0') || labelSet.has('p1')) return 'high'
  if (labelSet.has('priority: medium') || labelSet.has('p2')) return 'medium'
  if (labelSet.has('priority: low') || labelSet.has('p3') || labelSet.has('p4')) return 'low'

  return 'medium' // Default priority
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasksByProject: {},
      syncStatus: {},
      syncError: {},

      // Get tasks for a project
      getTasks: (projectId) => {
        return get().tasksByProject[projectId]?.tasks ?? []
      },

      // Add a new task
      addTask: (projectId, task) =>
        set((state) => {
          const projectTasks = state.tasksByProject[projectId] ?? { tasks: [], lastModified: new Date().toISOString() }
          return {
            tasksByProject: {
              ...state.tasksByProject,
              [projectId]: {
                ...projectTasks,
                tasks: [...projectTasks.tasks, task],
                lastModified: new Date().toISOString(),
              },
            },
          }
        }),

      // Update an existing task
      updateTask: (projectId, taskId, updates) =>
        set((state) => {
          const projectTasks = state.tasksByProject[projectId]
          if (!projectTasks) return state

          return {
            tasksByProject: {
              ...state.tasksByProject,
              [projectId]: {
                ...projectTasks,
                tasks: projectTasks.tasks.map((task) =>
                  task.id === taskId ? { ...task, ...updates } : task
                ),
                lastModified: new Date().toISOString(),
              },
            },
          }
        }),

      // Delete a task
      deleteTask: (projectId, taskId) =>
        set((state) => {
          const projectTasks = state.tasksByProject[projectId]
          if (!projectTasks) return state

          return {
            tasksByProject: {
              ...state.tasksByProject,
              [projectId]: {
                ...projectTasks,
                tasks: projectTasks.tasks.filter((task) => task.id !== taskId),
                lastModified: new Date().toISOString(),
              },
            },
          }
        }),

      // Move a task to a different column/position
      moveTask: (projectId, taskId, toColumnId, toOrder) =>
        set((state) => {
          const projectTasks = state.tasksByProject[projectId]
          if (!projectTasks) return state

          return {
            tasksByProject: {
              ...state.tasksByProject,
              [projectId]: {
                ...projectTasks,
                tasks: projectTasks.tasks.map((task) =>
                  task.id === taskId
                    ? { ...task, columnId: toColumnId, order: toOrder }
                    : task
                ),
                lastModified: new Date().toISOString(),
              },
            },
          }
        }),

      // Set all tasks for a project (replaces existing)
      setTasks: (projectId, tasks) =>
        set((state) => ({
          tasksByProject: {
            ...state.tasksByProject,
            [projectId]: {
              tasks,
              lastModified: new Date().toISOString(),
            },
          },
        })),

      // Merge tasks (for GitHub sync - adds new, updates existing by GitHub issue number)
      mergeTasks: (projectId, newTasks) =>
        set((state) => {
          const projectTasks = state.tasksByProject[projectId] ?? { tasks: [], lastModified: new Date().toISOString() }
          const existingTasks = projectTasks.tasks

          // Build a map of existing GitHub-linked tasks by issue number
          const githubTaskMap = new Map<number, LinkedTask>()
          existingTasks.forEach((task) => {
            if (task.githubIssueNumber) {
              githubTaskMap.set(task.githubIssueNumber, task)
            }
          })

          // Process new tasks
          const mergedTasks: LinkedTask[] = []
          const processedIssueNumbers = new Set<number>()

          // First, add all non-GitHub tasks
          existingTasks.forEach((task) => {
            if (!task.isFromGitHub) {
              mergedTasks.push(task)
            }
          })

          // Then merge GitHub tasks
          newTasks.forEach((newTask) => {
            if (newTask.githubIssueNumber) {
              processedIssueNumbers.add(newTask.githubIssueNumber)
              const existing = githubTaskMap.get(newTask.githubIssueNumber)
              if (existing) {
                // Update existing task but preserve local column position if manually moved
                mergedTasks.push({
                  ...newTask,
                  id: existing.id, // Keep the same ID
                  columnId: existing.columnId, // Preserve column position
                  order: existing.order, // Preserve order
                })
              } else {
                // Add new task
                mergedTasks.push(newTask)
              }
            } else {
              mergedTasks.push(newTask)
            }
          })

          return {
            tasksByProject: {
              ...state.tasksByProject,
              [projectId]: {
                tasks: mergedTasks,
                lastModified: new Date().toISOString(),
                githubSyncedAt: new Date().toISOString(),
              },
            },
          }
        }),

      // Clear all tasks for a project
      clearTasks: (projectId) =>
        set((state) => {
          const { [projectId]: _removed, ...rest } = state.tasksByProject
          void _removed // Mark as intentionally unused
          return { tasksByProject: rest }
        }),

      // Sync status management
      setSyncStatus: (projectId, status) =>
        set((state) => ({
          syncStatus: { ...state.syncStatus, [projectId]: status },
        })),

      setSyncError: (projectId, error) =>
        set((state) => ({
          syncError: { ...state.syncError, [projectId]: error },
        })),

      setGithubSyncedAt: (projectId, timestamp) =>
        set((state) => {
          const projectTasks = state.tasksByProject[projectId]
          if (!projectTasks) return state

          return {
            tasksByProject: {
              ...state.tasksByProject,
              [projectId]: {
                ...projectTasks,
                githubSyncedAt: timestamp,
              },
            },
          }
        }),

      // Selectors
      getTasksByColumn: (projectId, columnId) => {
        const tasks = get().tasksByProject[projectId]?.tasks ?? []
        return tasks
          .filter((task) => task.columnId === columnId)
          .sort((a, b) => a.order - b.order)
      },

      getTaskById: (projectId, taskId) => {
        const tasks = get().tasksByProject[projectId]?.tasks ?? []
        return tasks.find((task) => task.id === taskId)
      },

      getGitHubLinkedTasks: (projectId) => {
        const tasks = get().tasksByProject[projectId]?.tasks ?? []
        return tasks.filter((task) => task.githubIssueNumber !== undefined)
      },

      getLocalOnlyTasks: (projectId) => {
        const tasks = get().tasksByProject[projectId]?.tasks ?? []
        return tasks.filter((task) => !task.isFromGitHub)
      },
    }),
    {
      name: 'project-watch-tasks',
      partialize: (state) => ({ tasksByProject: state.tasksByProject }),
    }
  )
)
