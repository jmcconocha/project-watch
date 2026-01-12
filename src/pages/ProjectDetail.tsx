import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ProjectDetailView,
  sampleColumns,
  type Task,
  type ProjectStatus,
  type ProjectPriority,
  type ProjectDetail as ProjectDetailType,
} from '../features/project-detail'
import { useProjectStore, useSettingsStore, toast } from '../stores'
import { openInEditor, openInTerminal, openInFinder, openUrl } from '../services'

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const editorId = useSettingsStore((state) => state.editorId)
  const boardProject = useProjectStore((state) =>
    state.projects.find((p) => p.id === id)
  )
  const updateProject = useProjectStore((state) => state.updateProject)

  // Map BoardProject to ProjectDetail format
  const mapToProjectDetail = (): ProjectDetailType | null => {
    if (!boardProject) return null
    return {
      id: boardProject.id,
      name: boardProject.name,
      description: boardProject.description,
      localPath: boardProject.localPath,
      githubUrl: boardProject.githubUrl,
      priority: 'none' as ProjectPriority,
      status: boardProject.status,
      dueDate: null,
      notes: '',
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
        lastSynced: new Date().toISOString(),
      },
    }
  }

  const [project, setProject] = useState<ProjectDetailType | null>(mapToProjectDetail)
  const [tasks, setTasks] = useState<Task[]>([])

  // Update project when boardProject changes
  useEffect(() => {
    const mapped = mapToProjectDetail()
    if (mapped) {
      setProject((prev) => prev ? { ...prev, ...mapped } : mapped)
    }
  }, [boardProject])

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
    setProject((prev) => prev ? { ...prev, name } : prev)
    if (id) updateProject(id, { name })
    toast.success('Project name updated')
  }

  const handleEditStatus = (status: ProjectStatus) => {
    setProject((prev) => prev ? { ...prev, status } : prev)
    if (id) updateProject(id, { status })
    toast.success(`Status changed to ${status}`)
  }

  const handleEditPriority = (priority: ProjectPriority) => {
    setProject((prev) => prev ? { ...prev, priority } : prev)
    toast.success(`Priority changed to ${priority}`)
  }

  const handleEditDueDate = (dueDate: string | null) => {
    console.log('Edit due date:', dueDate)
    toast.info('Date picker coming soon')
  }

  const handleSaveNotes = (notes: string) => {
    setProject((prev) => prev ? { ...prev, notes } : prev)
    toast.success('Notes saved')
  }

  const handleCreateTask = (columnId: string) => {
    const newTask: Task = {
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
    setTasks((prev) => [...prev, newTask])
    toast.success('Task created')
  }

  const handleEditTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    toast.success('Task deleted')
  }

  const handleMoveTask = (taskId: string, toColumnId: string, toOrder: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, columnId: toColumnId, order: toOrder }
          : task
      )
    )
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

  return (
    <ProjectDetailView
      project={project}
      columns={sampleColumns}
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
    />
  )
}
