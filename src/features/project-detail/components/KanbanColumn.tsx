import { Plus } from 'lucide-react'
import type { Column, Task, LinkedTask } from '../types'
import { columnHeaderColors, columnAccentColors } from '../types'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  column: Column
  tasks: (Task | LinkedTask)[]
  onCreateTask?: () => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  onDragStart?: (taskId: string) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: () => void
  isDragTarget?: boolean
}

export function KanbanColumn({
  column,
  tasks,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget,
}: KanbanColumnProps) {
  const headerColor = columnHeaderColors[column.id] || 'bg-slate-100 dark:bg-slate-800'
  const accentColor = columnAccentColors[column.id] || 'bg-slate-400'

  return (
    <div
      className={`
        flex flex-col min-w-[280px] max-w-[320px] bg-slate-50 dark:bg-slate-900/50 rounded-xl
        border-2 transition-colors duration-200
        ${isDragTarget
          ? 'border-cyan-400 dark:border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20'
          : 'border-transparent'
        }
      `}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver?.(e)
      }}
      onDrop={onDrop}
    >
      {/* Column Header */}
      <div className={`px-3 py-3 rounded-t-xl ${headerColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${accentColor}`} />
            <h3 className="font-medium text-sm text-slate-700 dark:text-slate-200">
              {column.title}
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={onCreateTask}
            className="p-1 rounded hover:bg-white/60 dark:hover:bg-slate-700 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            title="Add task"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px] max-h-[calc(100vh-320px)]">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-xs text-slate-400 dark:text-slate-500">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask?.(task.id)}
              onDelete={() => onDeleteTask?.(task.id)}
              onDragStart={() => onDragStart?.(task.id)}
            />
          ))
        )}
      </div>

      {/* Add Task Button (bottom) */}
      <div className="p-2 pt-0">
        <button
          onClick={onCreateTask}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
                     text-xs font-medium text-slate-500 dark:text-slate-400
                     hover:bg-white dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400
                     border border-dashed border-slate-300 dark:border-slate-700
                     hover:border-cyan-400 dark:hover:border-cyan-600
                     transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add task
        </button>
      </div>
    </div>
  )
}
