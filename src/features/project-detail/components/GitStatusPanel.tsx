import {
  GitBranch,
  ArrowUp,
  ArrowDown,
  Circle,
  GitPullRequest,
  AlertCircle,
  Clock,
  GitCommit,
  ExternalLink,
} from 'lucide-react'
import type { GitStatus, GitHubStatus, PullRequest } from '../types'
import { prStatusConfig, formatTimestamp } from '../types'

interface GitStatusPanelProps {
  git: GitStatus
  github: GitHubStatus
  githubUrl: string | null
}

function PullRequestItem({ pr }: { pr: PullRequest }) {
  const status = prStatusConfig[pr.status] || prStatusConfig.open

  return (
    <a
      href={pr.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
    >
      <div className="flex items-start gap-2">
        <GitPullRequest className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              #{pr.number}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 truncate mt-0.5">
            {pr.title}
          </p>
        </div>
        <ExternalLink className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  )
}

export function GitStatusPanel({ git, github, githubUrl }: GitStatusPanelProps) {
  return (
    <div className="space-y-4">
      {/* Branch & Status */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Git Status
        </h3>

        {/* Current Branch */}
        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <GitBranch className="h-4 w-4 text-cyan-500" />
          <span className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate">
            {git.branch}
          </span>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {git.isDirty && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              <Circle className="h-2 w-2 fill-current" />
              <span className="text-xs font-medium">{git.uncommittedFiles} uncommitted</span>
            </div>
          )}
          {git.commitsAhead > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400">
              <ArrowUp className="h-3 w-3" />
              <span className="text-xs font-medium">{git.commitsAhead} ahead</span>
            </div>
          )}
          {git.commitsBehind > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
              <ArrowDown className="h-3 w-3" />
              <span className="text-xs font-medium">{git.commitsBehind} behind</span>
            </div>
          )}
          {!git.isDirty && git.commitsAhead === 0 && git.commitsBehind === 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
              <Circle className="h-2 w-2 fill-current" />
              <span className="text-xs font-medium">Clean</span>
            </div>
          )}
        </div>
      </div>

      {/* Last Commit */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Last Commit
        </h3>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <GitCommit className="h-3.5 w-3.5" />
            <span className="font-mono">{git.lastCommit.hash}</span>
            <span>•</span>
            <Clock className="h-3 w-3" />
            <span>{formatTimestamp(git.lastCommit.timestamp)}</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {git.lastCommit.message}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            by {git.lastCommit.author}
          </p>
        </div>
      </div>

      {/* GitHub Section */}
      {githubUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              GitHub
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Synced {formatTimestamp(github.lastSynced)}
            </span>
          </div>

          {/* Open Issues */}
          {github.openIssues > 0 && (
            <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {github.openIssues} open issue{github.openIssues !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Pull Requests */}
          {github.openPRs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {github.openPRs.length} open PR{github.openPRs.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-1.5">
                {github.openPRs.map((pr) => (
                  <PullRequestItem key={pr.number} pr={pr} />
                ))}
              </div>
            </div>
          )}

          {github.openIssues === 0 && github.openPRs.length === 0 && (
            <div className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
              No open issues or PRs
            </div>
          )}
        </div>
      )}
    </div>
  )
}
