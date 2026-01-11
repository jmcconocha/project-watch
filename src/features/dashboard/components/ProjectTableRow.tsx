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
} from 'lucide-react'
import type { Project } from '../types'
import { priorityConfig, statusConfig, formatDate } from '../types'

interface ProjectTableRowProps {
  project: Project
  onNavigate?: () => void
  onOpenInEditor?: () => void
  onOpenInFinder?: () => void
  onOpenInTerminal?: () => void
  onOpenInGitHub?: () => void
  onOpenInClaudeCode?: () => void
}

export function ProjectTableRow({
  project,
  onNavigate,
  onOpenInEditor,
  onOpenInFinder,
  onOpenInTerminal,
  onOpenInGitHub,
  onOpenInClaudeCode,
}: ProjectTableRowProps) {
  const priority = priorityConfig[project.priority]
  const status = statusConfig[project.status]

  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {/* Project */}
      <td className="px-4 py-3">
        <button onClick={onNavigate} className="text-left">
          <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {project.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
            {project.description}
          </p>
        </button>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span className={`h-2 w-2 rounded-full ${status.dotColor}`} />
          {status.label}
        </span>
      </td>

      {/* Priority */}
      <td className="px-4 py-3">
        {project.priority !== 'none' ? (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.color}`}>
            {priority.label}
          </span>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">—</span>
        )}
      </td>

      {/* Progress */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {project.progress}%
          </span>
        </div>
      </td>

      {/* Git */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            <GitBranch className="h-3 w-3" />
            <span className="max-w-[80px] truncate">{project.git.branch}</span>
          </span>
          {project.git.isDirty && (
            <span title="Uncommitted changes">
              <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
            </span>
          )}
          {project.git.commitsAhead > 0 && (
            <span className="flex items-center text-xs text-cyan-600 dark:text-cyan-400" title="Commits ahead">
              <ArrowUp className="h-3 w-3" />
              {project.git.commitsAhead}
            </span>
          )}
          {project.git.commitsBehind > 0 && (
            <span className="flex items-center text-xs text-orange-600 dark:text-orange-400" title="Commits behind">
              <ArrowDown className="h-3 w-3" />
              {project.git.commitsBehind}
            </span>
          )}
          {project.git.openPRs > 0 && (
            <span className="flex items-center text-xs text-purple-600 dark:text-purple-400" title="Open PRs">
              <GitPullRequest className="h-3 w-3" />
              {project.git.openPRs}
            </span>
          )}
        </div>
      </td>

      {/* Due Date */}
      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        {formatDate(project.dueDate) || '—'}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onOpenInEditor}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            title="Open in VS Code"
          >
            <Code2 className="h-4 w-4" />
          </button>
          <button
            onClick={onOpenInFinder}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            title="Open in Finder"
          >
            <Folder className="h-4 w-4" />
          </button>
          <button
            onClick={onOpenInTerminal}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            title="Open in Terminal"
          >
            <Terminal className="h-4 w-4" />
          </button>
          {project.githubUrl && (
            <button
              onClick={onOpenInGitHub}
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              title="Open on GitHub"
            >
              <Github className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onOpenInClaudeCode}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            title="Open in Claude Code"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
