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
} from 'lucide-react'
import type { Project } from '../types'
import { priorityConfig, statusConfig, formatRelativeTime, formatDate } from '../types'

interface ProjectCardProps {
  project: Project
  index?: number
  onNavigate?: () => void
  onOpenInEditor?: () => void
  onOpenInFinder?: () => void
  onOpenInTerminal?: () => void
  onOpenInGitHub?: () => void
  onOpenInClaudeCode?: () => void
}

export function ProjectCard({
  project,
  index = 0,
  onNavigate,
  onOpenInEditor,
  onOpenInFinder,
  onOpenInTerminal,
  onOpenInGitHub,
  onOpenInClaudeCode,
}: ProjectCardProps) {
  const priority = priorityConfig[project.priority]
  const status = statusConfig[project.status]

  return (
    <div
      className="group card-interactive bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800
                 hover:border-cyan-300 dark:hover:border-cyan-700 overflow-hidden
                 animate-slide-up opacity-0"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      {/* Progress bar at top */}
      <div className="h-1 bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <button
            onClick={onNavigate}
            className="text-left group/title"
          >
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover/title:text-cyan-600 dark:group-hover/title:text-cyan-400 transition-colors">
              {project.name}
            </h3>
          </button>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.color}`}>
            {priority.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Status and Due Date */}
        <div className="flex items-center gap-3 text-xs mb-3">
          <span className={`flex items-center gap-1 ${status.color}`}>
            <Circle className="h-2 w-2 fill-current" />
            {status.label}
          </span>
          {project.dueDate && (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Calendar className="h-3 w-3" />
              {formatDate(project.dueDate)}
            </span>
          )}
        </div>

        {/* Git Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
          <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-slate-600 dark:text-slate-400">
            <GitBranch className="h-3 w-3" />
            {project.git.branch}
          </span>
          {project.git.isDirty && (
            <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-700 dark:text-amber-400">
              <Circle className="h-2 w-2 fill-current" />
              Uncommitted
            </span>
          )}
          {project.git.commitsAhead > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 rounded text-cyan-700 dark:text-cyan-400">
              <ArrowUp className="h-3 w-3" />
              {project.git.commitsAhead}
            </span>
          )}
          {project.git.commitsBehind > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-700 dark:text-orange-400">
              <ArrowDown className="h-3 w-3" />
              {project.git.commitsBehind}
            </span>
          )}
          {project.git.openPRs > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-700 dark:text-purple-400">
              <GitPullRequest className="h-3 w-3" />
              {project.git.openPRs}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatRelativeTime(project.lastActivity)}
          </span>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onOpenInEditor}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors btn-press focus-ring"
              title="Open in VS Code"
              aria-label="Open in VS Code"
            >
              <Code2 className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenInFinder}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors btn-press focus-ring"
              title="Open in Finder"
              aria-label="Open in Finder"
            >
              <Folder className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenInTerminal}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors btn-press focus-ring"
              title="Open in Terminal"
              aria-label="Open in Terminal"
            >
              <Terminal className="h-4 w-4" />
            </button>
            {project.githubUrl && (
              <button
                onClick={onOpenInGitHub}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors btn-press focus-ring"
                title="Open on GitHub"
                aria-label="Open on GitHub"
              >
                <Github className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onOpenInClaudeCode}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors btn-press focus-ring"
              title="Open in Claude Code"
              aria-label="Open in Claude Code"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
