import {
  GitBranch,
  Circle,
  ArrowUp,
  ArrowDown,
  GitPullRequest,
  Code2,
  Folder,
  Terminal,
  Github,
  Sparkles,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import type { Project } from '../types'
import { priorityConfig, statusConfig, formatRelativeTime, formatDate } from '../types'

interface ProjectListItemProps {
  project: Project
  onNavigate?: () => void
  onOpenInEditor?: () => void
  onOpenInFinder?: () => void
  onOpenInTerminal?: () => void
  onOpenInGitHub?: () => void
  onOpenInClaudeCode?: () => void
}

export function ProjectListItem({
  project,
  onNavigate,
  onOpenInEditor,
  onOpenInFinder,
  onOpenInTerminal,
  onOpenInGitHub,
  onOpenInClaudeCode,
}: ProjectListItemProps) {
  const priority = priorityConfig[project.priority]
  const status = statusConfig[project.status]

  return (
    <div
      className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800
                 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-200"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Progress Circle */}
        <div className="relative flex-shrink-0">
          <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-slate-200 dark:text-slate-700"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${project.progress} 100`}
              strokeLinecap="round"
              className="text-cyan-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">
            {project.progress}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onNavigate}
              className="font-medium text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors truncate"
            >
              {project.name}
            </button>
            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${status.dotColor}`} title={status.label} />
            {project.priority !== 'none' && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${priority.color} flex-shrink-0`}>
                {priority.label}
              </span>
            )}
          </div>

          {/* Git Info Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              <GitBranch className="h-3 w-3" />
              {project.git.branch}
            </span>
            {project.git.isDirty && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Circle className="h-2 w-2 fill-current" />
                Uncommitted
              </span>
            )}
            {project.git.commitsAhead > 0 && (
              <span className="flex items-center gap-0.5 text-cyan-600 dark:text-cyan-400">
                <ArrowUp className="h-3 w-3" />
                {project.git.commitsAhead} ahead
              </span>
            )}
            {project.git.commitsBehind > 0 && (
              <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400">
                <ArrowDown className="h-3 w-3" />
                {project.git.commitsBehind} behind
              </span>
            )}
            {project.git.openPRs > 0 && (
              <span className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400">
                <GitPullRequest className="h-3 w-3" />
                {project.git.openPRs} PR{project.git.openPRs > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Meta & Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Meta Info */}
          <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-slate-400 dark:text-slate-500">
            <span>{formatRelativeTime(project.lastActivity)}</span>
            {project.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(project.dueDate)}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onOpenInEditor}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              title="Open in VS Code"
            >
              <Code2 className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenInFinder}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              title="Open in Finder"
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenInTerminal}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              title="Open in Terminal"
            >
              <Terminal className="h-4 w-4" />
            </button>
            {project.githubUrl && (
              <button
                onClick={onOpenInGitHub}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                title="Open on GitHub"
              >
                <Github className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onOpenInClaudeCode}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              title="Open in Claude Code"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          {/* Navigate Arrow */}
          <button
            onClick={onNavigate}
            className="p-1 text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
