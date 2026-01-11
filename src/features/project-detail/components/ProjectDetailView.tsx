import { useState, useMemo } from 'react'
import {
  PanelLeftClose,
  PanelLeft,
  Code2,
  Terminal,
  Folder,
  Github,
  Sparkles,
  Circle,
  Calendar,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react'
import type { ProjectDetailViewProps, ProjectStatus, ProjectPriority, Task } from '../types'
import { statusConfig, priorityConfig, formatDate } from '../types'
import { KanbanColumn } from './KanbanColumn'
import { GitStatusPanel } from './GitStatusPanel'
import { NotesEditor } from './NotesEditor'

export function ProjectDetailView({
  project,
  columns,
  tasks,
  onEditName,
  onEditStatus,
  onEditPriority,
  onEditDueDate,
  onSaveNotes,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onOpenInEditor,
  onOpenInTerminal,
  onOpenInFinder,
  onOpenInGitHub,
  onOpenInClaudeCode,
  onBack,
}: ProjectDetailViewProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragTargetColumnId, setDragTargetColumnId] = useState<string | null>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(project.name)

  const status = statusConfig[project.status]
  const priority = priorityConfig[project.priority]

  // Group tasks by column
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    columns.forEach((col) => {
      grouped[col.id] = tasks
        .filter((t) => t.columnId === col.id)
        .sort((a, b) => a.order - b.order)
    })
    return grouped
  }, [columns, tasks])

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId)
  }

  const handleDragOver = (columnId: string) => {
    setDragTargetColumnId(columnId)
  }

  const handleDrop = (columnId: string) => {
    if (draggedTaskId) {
      const tasksInColumn = tasksByColumn[columnId] || []
      const newOrder = tasksInColumn.length
      onMoveTask?.(draggedTaskId, columnId, newOrder)
    }
    setDraggedTaskId(null)
    setDragTargetColumnId(null)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragTargetColumnId(null)
  }

  const handleNameSave = () => {
    if (editedName.trim() && editedName !== project.name) {
      onEditName?.(editedName.trim())
    } else {
      setEditedName(project.name)
    }
    setIsEditingName(false)
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave()
    } else if (e.key === 'Escape') {
      setEditedName(project.name)
      setIsEditingName(false)
    }
  }

  return (
    <div
      className="h-full flex flex-col bg-slate-50 dark:bg-slate-950"
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <header className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Project Info */}
            <div className="flex items-start gap-4">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                title="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                {isEditingName ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={handleNameKeyDown}
                    className="text-xl font-semibold text-slate-900 dark:text-slate-100 bg-transparent border-b-2 border-cyan-500 outline-none w-full"
                    autoFocus
                  />
                ) : (
                  <h1
                    onClick={() => setIsEditingName(true)}
                    className="text-xl font-semibold text-slate-900 dark:text-slate-100 truncate cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    title="Click to edit"
                  >
                    {project.name}
                  </h1>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenInEditor}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         text-sm text-slate-600 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         hover:text-cyan-600 dark:hover:text-cyan-400
                         transition-colors"
                title="Open in Editor"
              >
                <Code2 className="h-4 w-4" />
                <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                onClick={onOpenInTerminal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         text-sm text-slate-600 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         hover:text-cyan-600 dark:hover:text-cyan-400
                         transition-colors"
                title="Open in Terminal"
              >
                <Terminal className="h-4 w-4" />
                <span className="hidden sm:inline">Terminal</span>
              </button>
              <button
                onClick={onOpenInFinder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         text-sm text-slate-600 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         hover:text-cyan-600 dark:hover:text-cyan-400
                         transition-colors"
                title="Open in Finder"
              >
                <Folder className="h-4 w-4" />
                <span className="hidden sm:inline">Finder</span>
              </button>
              {project.githubUrl && (
                <button
                  onClick={onOpenInGitHub}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                           text-sm text-slate-600 dark:text-slate-400
                           hover:bg-slate-100 dark:hover:bg-slate-800
                           hover:text-cyan-600 dark:hover:text-cyan-400
                           transition-colors"
                  title="Open on GitHub"
                >
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </button>
              )}
              <button
                onClick={onOpenInClaudeCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         text-sm text-slate-600 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         hover:text-cyan-600 dark:hover:text-cyan-400
                         transition-colors"
                title="Open in Claude Code"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Claude</span>
              </button>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Status */}
            <button
              onClick={() => {
                const statuses: ProjectStatus[] = ['active', 'on-hold', 'completed', 'archived']
                const currentIdx = statuses.indexOf(project.status)
                const nextStatus = statuses[(currentIdx + 1) % statuses.length]
                onEditStatus?.(nextStatus)
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <Circle className={`h-2 w-2 ${status.dot} fill-current`} />
              <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            {/* Priority */}
            <button
              onClick={() => {
                const priorities: ProjectPriority[] = ['high', 'medium', 'low', 'none']
                const currentIdx = priorities.indexOf(project.priority)
                const nextPriority = priorities[(currentIdx + 1) % priorities.length]
                onEditPriority?.(nextPriority)
              }}
              className="flex items-center gap-1.5 group"
            >
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.color}`}>
                {priority.label}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            {/* Due Date */}
            <button
              onClick={() => onEditDueDate?.(project.dueDate)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md
                       text-sm text-slate-500 dark:text-slate-400
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(project.dueDate)}
              <ChevronDown className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Toggle Sidebar (visible on larger screens) */}
            <div className="hidden lg:block ml-auto">
              <button
                onClick={handleToggleSidebar}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md
                         text-sm text-slate-500 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {sidebarOpen ? (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span>Hide sidebar</span>
                  </>
                ) : (
                  <>
                    <PanelLeft className="h-4 w-4" />
                    <span>Show sidebar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Kanban Board */}
        <main className="flex-1 overflow-x-auto p-4 lg:p-6">
          <div className="flex gap-4 h-full min-w-max">
            {columns
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasksByColumn[column.id] || []}
                  onCreateTask={() => onCreateTask?.(column.id)}
                  onEditTask={(taskId) => onEditTask?.(taskId, {})}
                  onDeleteTask={onDeleteTask}
                  onDragStart={handleDragStart}
                  onDragOver={() => handleDragOver(column.id)}
                  onDrop={() => handleDrop(column.id)}
                  isDragTarget={dragTargetColumnId === column.id}
                />
              ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside
          className={`
            shrink-0 w-80 bg-white dark:bg-slate-900
            border-l border-slate-200 dark:border-slate-800
            overflow-y-auto transition-all duration-300
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full w-0 border-0'}
            hidden lg:block
          `}
        >
          <div className="p-4 space-y-6">
            {/* Git Status */}
            <GitStatusPanel
              git={project.git}
              github={project.github}
              githubUrl={project.githubUrl}
            />

            {/* Divider */}
            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Notes */}
            <NotesEditor
              notes={project.notes}
              onSave={onSaveNotes}
            />
          </div>
        </aside>
      </div>

      {/* Mobile Sidebar (as overlay) */}
      <div
        className={`
          lg:hidden fixed inset-0 z-50 transition-opacity duration-300
          ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleToggleSidebar}
        />

        {/* Sidebar Panel */}
        <aside
          className={`
            absolute right-0 top-0 h-full w-80 max-w-[85vw]
            bg-white dark:bg-slate-900 shadow-xl
            overflow-y-auto transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Project Details</h2>
              <button
                onClick={handleToggleSidebar}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>

            {/* Git Status */}
            <GitStatusPanel
              git={project.git}
              github={project.github}
              githubUrl={project.githubUrl}
            />

            {/* Divider */}
            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Notes */}
            <NotesEditor
              notes={project.notes}
              onSave={onSaveNotes}
            />
          </div>
        </aside>
      </div>

      {/* Mobile sidebar toggle button */}
      <button
        onClick={handleToggleSidebar}
        className="lg:hidden fixed bottom-4 right-4 p-3 rounded-full
                   bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg
                   transition-colors z-40"
      >
        {sidebarOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeft className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}
