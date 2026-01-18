import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ProjectDetailView,
  type Task,
  type ProjectStatus,
  type ProjectPriority,
  type ProjectDetail as ProjectDetailType,
} from '../features/project-detail'
import { useProjectStore, useSettingsStore, useTaskStore, toast, defaultColumns, type LinkedTask } from '../stores'
import { openInEditor, openInTerminal, openInFinder, openUrl } from '../services'
import { useGitHubIssuesSync } from '../hooks'

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const editorId = useSettingsStore((state) => state.editorId)
  const boardProject = useProjectStore((state) =>
    state.projects.find((p) => p.id === id)
  )
  const updateProject = useProjectStore((state) => state.updateProject)

  // Task store integration
  const getTasks = useTaskStore((state) => state.getTasks)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const moveTask = useTaskStore((state) => state.moveTask)

  // Get tasks for this project
  const tasks = id ? getTasks(id) : []

  // GitHub issues sync
  const {
    syncIssues,
    updateIssue,
    closeIssue,
    reopenIssue,
    syncStatus,
    lastSyncedAt,
    isGitHubConnected,
  } = useGitHubIssuesSync({
    projectId: id ?? '',
    githubUrl: boardProject?.githubUrl ?? null,
    enabled: !!id && !!boardProject?.githubUrl,
    autoSync: true,
  })

  // Local state for editable fields that aren't persisted to the project store
  const [localPriority, setLocalPriority] = useState<ProjectPriority>('none')
  const [localNotes, setLocalNotes] = useState('')

  // Map BoardProject to ProjectDetail format using useMemo instead of useEffect + setState
  const project = useMemo((): ProjectDetailType | null => {
    if (!boardProject) return null
    return {
      id: boardProject.id,
      name: boardProject.name,
      description: boardProject.description,
      localPath: boardProject.localPath,
      githubUrl: boardProject.githubUrl,
      priority: localPriority,
      status: boardProject.status,
      dueDate: null,
      notes: localNotes,
      git: {
        branch: boardProject.git.branch,
        isDirty: boardProject.git.isDirty,
        uncommittedFiles: boardProject.git.uncommittedFiles,
        commitsAhead: boardProject.git.commitsAhead,
        commitsBehind: boardProject.git.commitsBehind,
        lastCommit: {
          hash: 'abc1234',
          message: 'Latest commit',
          author: 'You',
          timestamp: boardProject.lastActivity,
        },
      },
      github: {
        openPRs: [],
        openIssues: boardProject.github.openIssues,
        lastSynced: lastSyncedAt ?? new Date().toISOString(),
      },
    }
  }, [boardProject, lastSyncedAt, localPriority, localNotes])

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">Project not found</p>
      </div>
    )
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleEditName = (name: string) => {
    if (id) updateProject(id, { name })
    toast.success('Project name updated')
  }

  const handleEditStatus = (status: ProjectStatus) => {
    if (id) updateProject(id, { status })
    toast.success(`Status changed to ${status}`)
  }

  const handleEditPriority = (priority: ProjectPriority) => {
    setLocalPriority(priority)
    toast.success(`Priority changed to ${priority}`)
  }

  const handleEditDueDate = (dueDate: string | null) => {
    console.log('Edit due date:', dueDate)
    toast.info('Date picker coming soon')
  }

  const handleSaveNotes = (notes: string) => {
    setLocalNotes(notes)
    toast.success('Notes saved')
  }

  const handleCreateTask = (columnId: string) => {
    if (!id) return

    const newTask: LinkedTask = {
      id: `task-${Date.now()}`,
      columnId,
      title: 'New Task',
      description: '',
      priority: 'medium',
      dueDate: null,
      labels: [],
      createdAt: new Date().toISOString(),
      order: tasks.filter((t) => t.columnId === columnId).length,
    }
    addTask(id, newTask)
    toast.success('Task created')
  }

  const handleEditTask = async (taskId: string, updates: Partial<Task>) => {
    if (!id) return

    // Find the current task
    const currentTask = tasks.find((t) => t.id === taskId) as LinkedTask | undefined

    // Update local state
    updateTask(id, taskId, updates)

    // If this is a GitHub-linked task and title changed, sync to GitHub
    if (currentTask?.githubIssueNumber && updates.title && isGitHubConnected) {
      const updatedTask = { ...currentTask, ...updates } as LinkedTask
      await updateIssue(updatedTask)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (!id) return

    // Find the task to check if it's a GitHub issue
    const task = tasks.find((t) => t.id === taskId) as LinkedTask | undefined

    if (task?.isFromGitHub) {
      toast.error('Cannot delete GitHub issues. Close them instead.')
      return
    }

    deleteTask(id, taskId)
    toast.success('Task deleted')
  }

  const handleMoveTask = async (taskId: string, toColumnId: string, toOrder: number) => {
    if (!id) return

    // Find the current task
    const currentTask = tasks.find((t) => t.id === taskId) as LinkedTask | undefined
    const fromColumnId = currentTask?.columnId

    // Move locally
    moveTask(id, taskId, toColumnId, toOrder)

    // If this is a GitHub-linked task, sync state changes
    if (currentTask?.githubIssueNumber && isGitHubConnected) {
      // Moving to 'done' should close the issue
      if (toColumnId === 'done' && fromColumnId !== 'done') {
        await closeIssue(currentTask)
      }
      // Moving from 'done' to another column should reopen the issue
      else if (fromColumnId === 'done' && toColumnId !== 'done') {
        await reopenIssue(currentTask)
      }
      // Otherwise just update labels
      else {
        const updatedTask = { ...currentTask, columnId: toColumnId, order: toOrder }
        await updateIssue(updatedTask)
      }
    }
  }

  const handleOpenInEditor = async () => {
    try {
      await openInEditor(project.localPath, editorId)
      toast.info('Opening in editor...')
    } catch (error) {
      toast.error(`Failed to open editor: ${error}`)
    }
  }

  const handleOpenInTerminal = async () => {
    try {
      await openInTerminal(project.localPath)
      toast.info('Opening in Terminal...')
    } catch (error) {
      toast.error(`Failed to open Terminal: ${error}`)
    }
  }

  const handleOpenInFinder = async () => {
    try {
      await openInFinder(project.localPath)
      toast.info('Opening in Finder...')
    } catch (error) {
      toast.error(`Failed to open Finder: ${error}`)
    }
  }

  const handleOpenInGitHub = async () => {
    if (project.githubUrl) {
      try {
        await openUrl(project.githubUrl)
        toast.info('Opening GitHub...')
      } catch (error) {
        toast.error(`Failed to open GitHub: ${error}`)
      }
    }
  }

  const handleOpenInClaudeCode = async () => {
    try {
      await openInEditor(project.localPath, 'vscode')
      toast.info('Opening in Claude Code...')
    } catch (error) {
      toast.error(`Failed to open Claude Code: ${error}`)
    }
  }

  const handleSyncGitHub = async () => {
    if (!isGitHubConnected) {
      toast.error('GitHub not connected. Configure in Settings.')
      return
    }
    toast.info('Syncing GitHub issues...')
    await syncIssues()
    if (syncStatus === 'success') {
      toast.success('GitHub issues synced')
    }
  }

  return (
    <ProjectDetailView
      project={project}
      columns={defaultColumns}
      tasks={tasks}
      onEditName={handleEditName}
      onEditStatus={handleEditStatus}
      onEditPriority={handleEditPriority}
      onEditDueDate={handleEditDueDate}
      onSaveNotes={handleSaveNotes}
      onCreateTask={handleCreateTask}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onMoveTask={handleMoveTask}
      onOpenInEditor={handleOpenInEditor}
      onOpenInTerminal={handleOpenInTerminal}
      onOpenInFinder={handleOpenInFinder}
      onOpenInGitHub={handleOpenInGitHub}
      onOpenInClaudeCode={handleOpenInClaudeCode}
      onBack={handleBack}
      // New props for GitHub integration
      onSyncGitHub={handleSyncGitHub}
      isGitHubConnected={isGitHubConnected}
      syncStatus={syncStatus}
      lastSyncedAt={lastSyncedAt}
    />
  )
}
