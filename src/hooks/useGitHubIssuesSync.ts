import { useCallback, useEffect, useRef } from 'react'
import {
  useTaskStore,
  useSettingsStore,
  toast,
  mapGitHubLabelToColumn,
  mapGitHubLabelToPriority,
  type LinkedTask,
} from '../stores'
import {
  getRepoIssues,
  parseGitHubUrl,
  createGitHubIssue,
  updateGitHubIssue,
  closeGitHubIssue,
  reopenGitHubIssue,
  type GitHubIssue,
} from '../services/github'

interface UseGitHubIssuesSyncOptions {
  projectId: string
  githubUrl: string | null
  enabled?: boolean
  autoSync?: boolean
  syncIntervalMs?: number
}

interface UseGitHubIssuesSyncReturn {
  syncIssues: () => Promise<void>
  createIssue: (title: string, description?: string, labels?: string[]) => Promise<LinkedTask | null>
  updateIssue: (task: LinkedTask) => Promise<void>
  closeIssue: (task: LinkedTask) => Promise<void>
  reopenIssue: (task: LinkedTask) => Promise<void>
  syncStatus: 'idle' | 'syncing' | 'error' | 'success'
  syncError: string | null
  lastSyncedAt: string | null
  isGitHubConnected: boolean
}

/**
 * Convert a GitHub issue to a LinkedTask
 */
function issueToTask(issue: GitHubIssue, existingTasks: LinkedTask[]): LinkedTask {
  const labels = issue.labels.map((l) => l.name)
  const columnId = mapGitHubLabelToColumn(labels)
  const priority = mapGitHubLabelToPriority(labels)

  // Check if we already have this issue as a task (preserve its order)
  const existing = existingTasks.find((t) => t.githubIssueNumber === issue.number)

  return {
    id: existing?.id ?? `github-issue-${issue.number}`,
    columnId: existing?.columnId ?? columnId,
    title: issue.title,
    description: '', // GitHub issue body can be very long, just use title
    priority,
    dueDate: null,
    labels: labels.filter((l) =>
      !['done', 'completed', 'in review', 'review', 'in-review', 'in progress', 'wip', 'in-progress', 'todo', 'to do', 'ready', 'critical', 'urgent', 'priority: high', 'priority: medium', 'priority: low', 'p0', 'p1', 'p2', 'p3', 'p4'].includes(l.toLowerCase())
    ),
    createdAt: issue.created_at,
    order: existing?.order ?? 999, // Will be reordered
    githubIssueNumber: issue.number,
    githubIssueUrl: issue.html_url,
    githubIssueState: issue.state,
    githubSyncedAt: new Date().toISOString(),
    isFromGitHub: true,
    assignee: issue.assignees[0]?.login,
    assigneeAvatarUrl: issue.assignees[0]?.avatar_url,
  }
}

/**
 * Map column ID to GitHub labels for syncing back
 */
function columnToGitHubLabels(columnId: string): string[] {
  switch (columnId) {
    case 'done':
      return ['done']
    case 'in-review':
      return ['in review']
    case 'in-progress':
      return ['in progress']
    case 'todo':
      return ['todo']
    case 'backlog':
    default:
      return []
  }
}

/**
 * Map task priority to GitHub label
 */
function priorityToGitHubLabel(priority: string): string | null {
  switch (priority) {
    case 'high':
      return 'priority: high'
    case 'medium':
      return 'priority: medium'
    case 'low':
      return 'priority: low'
    default:
      return null
  }
}

export function useGitHubIssuesSync({
  projectId,
  githubUrl,
  enabled = true,
  autoSync = true,
  syncIntervalMs = 5 * 60 * 1000, // 5 minutes default
}: UseGitHubIssuesSyncOptions): UseGitHubIssuesSyncReturn {
  const githubToken = useSettingsStore((state) => state.github.accessToken)
  const isGitHubConnected = useSettingsStore((state) => state.github.isConnected)

  const getTasks = useTaskStore((state) => state.getTasks)
  const mergeTasks = useTaskStore((state) => state.mergeTasks)
  const updateTask = useTaskStore((state) => state.updateTask)
  const addTask = useTaskStore((state) => state.addTask)
  const setSyncStatus = useTaskStore((state) => state.setSyncStatus)
  const setSyncError = useTaskStore((state) => state.setSyncError)
  const setGithubSyncedAt = useTaskStore((state) => state.setGithubSyncedAt)

  const syncStatus = useTaskStore((state) => state.syncStatus[projectId] ?? 'idle')
  const syncError = useTaskStore((state) => state.syncError[projectId] ?? null)
  const lastSyncedAt = useTaskStore((state) => state.tasksByProject[projectId]?.githubSyncedAt ?? null)

  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Parse GitHub URL once
  const repoInfo = githubUrl ? parseGitHubUrl(githubUrl) : null

  /**
   * Fetch and sync GitHub issues to local tasks
   */
  const syncIssues = useCallback(async () => {
    if (!enabled || !isGitHubConnected || !githubToken || !repoInfo) {
      return
    }

    setSyncStatus(projectId, 'syncing')
    setSyncError(projectId, null)

    try {
      const issues = await getRepoIssues(githubToken, repoInfo.owner, repoInfo.repo)
      const existingTasks = getTasks(projectId)

      // Convert issues to tasks
      const issueTasks = issues.map((issue) => issueToTask(issue, existingTasks))

      // Merge with existing tasks
      mergeTasks(projectId, issueTasks)

      setSyncStatus(projectId, 'success')
      setGithubSyncedAt(projectId, new Date().toISOString())
    } catch (error) {
      console.error('Failed to sync GitHub issues:', error)
      setSyncStatus(projectId, 'error')
      setSyncError(projectId, error instanceof Error ? error.message : 'Unknown error')
    }
  }, [enabled, isGitHubConnected, githubToken, repoInfo, projectId, getTasks, mergeTasks, setSyncStatus, setSyncError, setGithubSyncedAt])

  /**
   * Create a new GitHub issue and add it as a task
   */
  const createIssue = useCallback(async (
    title: string,
    description?: string,
    labels?: string[]
  ): Promise<LinkedTask | null> => {
    if (!isGitHubConnected || !githubToken || !repoInfo) {
      toast.error('GitHub not connected')
      return null
    }

    try {
      const issue = await createGitHubIssue(githubToken, repoInfo.owner, repoInfo.repo, {
        title,
        body: description,
        labels,
      })

      const existingTasks = getTasks(projectId)
      const task = issueToTask(issue, existingTasks)

      addTask(projectId, task)
      toast.success(`Issue #${issue.number} created`)

      return task
    } catch (error) {
      console.error('Failed to create GitHub issue:', error)
      toast.error(`Failed to create issue: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }, [isGitHubConnected, githubToken, repoInfo, projectId, getTasks, addTask])

  /**
   * Update a GitHub issue from task changes
   */
  const updateIssueOnGitHub = useCallback(async (task: LinkedTask): Promise<void> => {
    if (!isGitHubConnected || !githubToken || !repoInfo || !task.githubIssueNumber) {
      return
    }

    try {
      // Build labels array from column and priority
      const columnLabels = columnToGitHubLabels(task.columnId)
      const priorityLabel = priorityToGitHubLabel(task.priority)
      const otherLabels = task.labels.filter((l) =>
        !['done', 'in review', 'in progress', 'todo', 'priority: high', 'priority: medium', 'priority: low'].includes(l.toLowerCase())
      )

      const allLabels = [
        ...columnLabels,
        ...(priorityLabel ? [priorityLabel] : []),
        ...otherLabels,
      ]

      await updateGitHubIssue(githubToken, repoInfo.owner, repoInfo.repo, task.githubIssueNumber, {
        title: task.title,
        labels: allLabels,
      })

      // Update local task with sync timestamp
      updateTask(projectId, task.id, {
        githubSyncedAt: new Date().toISOString(),
      })

      toast.success(`Issue #${task.githubIssueNumber} updated`)
    } catch (error) {
      console.error('Failed to update GitHub issue:', error)
      toast.error(`Failed to update issue: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [isGitHubConnected, githubToken, repoInfo, projectId, updateTask])

  /**
   * Close a GitHub issue when task is moved to done
   */
  const closeIssue = useCallback(async (task: LinkedTask): Promise<void> => {
    if (!isGitHubConnected || !githubToken || !repoInfo || !task.githubIssueNumber) {
      return
    }

    try {
      await closeGitHubIssue(githubToken, repoInfo.owner, repoInfo.repo, task.githubIssueNumber)

      updateTask(projectId, task.id, {
        githubIssueState: 'closed',
        githubSyncedAt: new Date().toISOString(),
      })

      toast.success(`Issue #${task.githubIssueNumber} closed`)
    } catch (error) {
      console.error('Failed to close GitHub issue:', error)
      toast.error(`Failed to close issue: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [isGitHubConnected, githubToken, repoInfo, projectId, updateTask])

  /**
   * Reopen a GitHub issue when task is moved from done
   */
  const reopenIssue = useCallback(async (task: LinkedTask): Promise<void> => {
    if (!isGitHubConnected || !githubToken || !repoInfo || !task.githubIssueNumber) {
      return
    }

    try {
      await reopenGitHubIssue(githubToken, repoInfo.owner, repoInfo.repo, task.githubIssueNumber)

      updateTask(projectId, task.id, {
        githubIssueState: 'open',
        githubSyncedAt: new Date().toISOString(),
      })

      toast.success(`Issue #${task.githubIssueNumber} reopened`)
    } catch (error) {
      console.error('Failed to reopen GitHub issue:', error)
      toast.error(`Failed to reopen issue: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [isGitHubConnected, githubToken, repoInfo, projectId, updateTask])

  // Auto-sync on mount and interval
  useEffect(() => {
    if (!enabled || !autoSync || !isGitHubConnected || !repoInfo) {
      return
    }

    // Initial sync
    syncIssues()

    // Set up interval
    syncIntervalRef.current = setInterval(syncIssues, syncIntervalMs)

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [enabled, autoSync, isGitHubConnected, repoInfo, syncIssues, syncIntervalMs])

  return {
    syncIssues,
    createIssue,
    updateIssue: updateIssueOnGitHub,
    closeIssue,
    reopenIssue,
    syncStatus,
    syncError,
    lastSyncedAt,
    isGitHubConnected: isGitHubConnected && !!repoInfo,
  }
}
