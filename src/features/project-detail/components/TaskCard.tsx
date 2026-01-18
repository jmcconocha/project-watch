import { Calendar, GripVertical, Pencil, Trash2, Github, ExternalLink } from 'lucide-react'
import type { Task, LinkedTask } from '../types'
import { taskPriorityConfig, labelColors, formatTaskDate, isOverdue } from '../types'

interface TaskCardProps {
  task: Task | LinkedTask
  onEdit?: () => void
  onDelete?: () => void
  onDragStart?: () => void
}

// Type guard to check if task is a LinkedTask with GitHub data
function isLinkedTask(task: Task | LinkedTask): task is LinkedTask {
  return 'githubIssueNumber' in task && task.githubIssueNumber !== undefined
}

export function TaskCard({ task, onEdit, onDelete, onDragStart }: TaskCardProps) {
  const priority = taskPriorityConfig[task.priority]
  const overdue = isOverdue(task.dueDate)
  const isGitHubIssue = isLinkedTask(task)
  const linkedTask = isGitHubIssue ? task : null

  const handleOpenGitHub = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (linkedTask?.githubIssueUrl) {
      window.open(linkedTask.githubIssueUrl, '_blank')
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`
        group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700
        border-l-4 ${priority.borderColor}
        hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isGitHubIssue ? 'ring-1 ring-slate-200 dark:ring-slate-700' : ''}
      `}
    >
      <div className="p-3">
        {/* Header with drag handle and actions */}
        <div className="flex items-start gap-2">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* GitHub Issue Badge */}
            {isGitHubIssue && linkedTask && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <Github className="h-3 w-3" />
                  #{linkedTask.githubIssueNumber}
                </span>
                {linkedTask.githubIssueState === 'closed' && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                    Closed
                  </span>
                )}
              </div>
            )}

            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
              {task.title}
            </h4>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Open in GitHub button */}
            {isGitHubIssue && linkedTask?.githubIssueUrl && (
              <button
                onClick={handleOpenGitHub}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                title="Open in GitHub"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={onEdit}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
              title="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            {/* Don't show delete for GitHub issues */}
            {!isGitHubIssue && (
              <button
                onClick={onDelete}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500"
                title="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pl-6">
            {task.description}
          </p>
        )}

        {/* Footer: Labels, Assignee, and Due Date */}
        <div className="mt-3 flex items-center justify-between gap-2 pl-6">
          {/* Labels and Assignee */}
          <div className="flex flex-wrap items-center gap-1">
            {/* Assignee Avatar */}
            {linkedTask?.assignee && (
              <div className="flex items-center gap-1 mr-1" title={`Assigned to ${linkedTask.assignee}`}>
                {linkedTask.assigneeAvatarUrl ? (
                  <img
                    src={linkedTask.assigneeAvatarUrl}
                    alt={linkedTask.assignee}
                    className="h-4 w-4 rounded-full ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <span className="text-[8px] font-medium text-slate-500 dark:text-slate-400">
                      {linkedTask.assignee.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Labels */}
            {task.labels.map((label) => (
              <span
                key={label}
                className={`
                  text-[10px] font-medium px-1.5 py-0.5 rounded
                  ${labelColors[label] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}
                `}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <span
              className={`
                flex items-center gap-1 text-[10px] font-medium
                ${overdue
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-slate-500 dark:text-slate-400'
                }
              `}
            >
              <Calendar className="h-3 w-3" />
              {formatTaskDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
