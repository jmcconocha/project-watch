import { useState } from 'react'
import {
  X,
  GitBranch,
  GitPullRequest,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Code,
  Terminal,
  Github,
  FolderOpen,
  ExternalLink,
  Check,
  Link,
} from 'lucide-react'
import type { ProjectDetailPanelProps } from '../types'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function ProjectDetailPanel({
  project,
  onClose,
  onOpenInEditor,
  onOpenInTerminal,
  onOpenInGitHub,
  onOpenInFinder,
  onUpdateGitHubUrl,
}: ProjectDetailPanelProps) {
  const [isEditingGitHubUrl, setIsEditingGitHubUrl] = useState(false)
  const [gitHubUrlInput, setGitHubUrlInput] = useState(project.githubUrl || '')

  const handleSaveGitHubUrl = () => {
    const trimmedUrl = gitHubUrlInput.trim()
    onUpdateGitHubUrl?.(trimmedUrl || null)
    setIsEditingGitHubUrl(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveGitHubUrl()
    } else if (e.key === 'Escape') {
      setGitHubUrlInput(project.githubUrl || '')
      setIsEditingGitHubUrl(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
          {project.name}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800
                     text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Description */}
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {project.description}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenInEditor}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                       bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-sm
                       transition-colors"
          >
            <Code className="h-4 w-4" />
            Open in Editor
          </button>
          <button
            onClick={onOpenInTerminal}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                       border border-slate-200 dark:border-slate-700
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       text-slate-700 dark:text-slate-300 font-medium text-sm
                       transition-colors"
          >
            <Terminal className="h-4 w-4" />
            Terminal
          </button>
          {project.githubUrl && (
            <button
              onClick={onOpenInGitHub}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                         border border-slate-200 dark:border-slate-700
                         hover:bg-slate-50 dark:hover:bg-slate-800
                         text-slate-700 dark:text-slate-300 font-medium text-sm
                         transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </button>
          )}
          <button
            onClick={onOpenInFinder}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                       border border-slate-200 dark:border-slate-700
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       text-slate-700 dark:text-slate-300 font-medium text-sm
                       transition-colors"
          >
            <FolderOpen className="h-4 w-4" />
            Finder
          </button>
        </div>

        {/* Git Status */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Git Status
          </h3>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-3">
            {/* Branch */}
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-slate-400" />
              <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                {project.git.branch}
              </span>
            </div>

            {/* Uncommitted Changes */}
            {project.git.isDirty && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {project.git.uncommittedFiles} uncommitted {project.git.uncommittedFiles === 1 ? 'file' : 'files'}
                </span>
              </div>
            )}

            {/* Ahead/Behind */}
            <div className="flex items-center gap-4">
              {project.git.commitsAhead > 0 && (
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <ArrowUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{project.git.commitsAhead} ahead</span>
                </div>
              )}
              {project.git.commitsBehind > 0 && (
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <ArrowDown className="h-3.5 w-3.5 text-red-500" />
                  <span>{project.git.commitsBehind} behind</span>
                </div>
              )}
              {project.git.commitsAhead === 0 && project.git.commitsBehind === 0 && !project.git.isDirty && (
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  Up to date
                </span>
              )}
            </div>
          </div>
        </div>

        {/* GitHub Status */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            GitHub
          </h3>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-3">
            {/* GitHub URL Input */}
            {isEditingGitHubUrl ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={gitHubUrlInput}
                  onChange={(e) => setGitHubUrlInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveGitHubUrl}
                  placeholder="https://github.com/owner/repo"
                  autoFocus
                  className="flex-1 px-2 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-600
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  onClick={handleSaveGitHubUrl}
                  className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingGitHubUrl(true)}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <Link className="h-4 w-4" />
                {project.githubUrl ? (
                  <span className="truncate max-w-[200px]">{project.githubUrl.replace('https://github.com/', '')}</span>
                ) : (
                  <span className="italic">Add GitHub URL...</span>
                )}
              </button>
            )}

            {/* PR and Issue counts - only show if URL is set */}
            {project.githubUrl && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitPullRequest className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {project.github.openPRs} open {project.github.openPRs === 1 ? 'PR' : 'PRs'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {project.github.openIssues} {project.github.openIssues === 1 ? 'issue' : 'issues'}
                  </div>
                </div>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  View on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium rounded-full
                             bg-slate-100 dark:bg-slate-800
                             text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Path */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Local Path
          </h3>
          <p className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all
                        bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
            {project.localPath}
          </p>
        </div>

        {/* Last Activity */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Last Activity
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {formatDate(project.lastActivity)}
          </p>
        </div>
      </div>
    </div>
  )
}
