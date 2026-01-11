import { useState } from 'react'
import { Github, Check, AlertCircle, ExternalLink, Key, LogOut } from 'lucide-react'
import type { GitHubAuth } from '../types'

interface GitHubSettingsProps {
  github: GitHubAuth
  onGitHubSignIn?: () => void
  onGitHubTokenSubmit?: (token: string) => void
  onGitHubDisconnect?: () => void
}

function ConnectedState({
  github,
  onDisconnect,
}: {
  github: GitHubAuth
  onDisconnect?: () => void
}) {
  return (
    <div className="space-y-4">
      {/* Connected Account Card */}
      <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
        <div className="relative">
          {github.avatarUrl ? (
            <img
              src={github.avatarUrl}
              alt={github.username || 'GitHub user'}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <Github className="h-6 w-6 text-slate-500" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            @{github.username}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            Connected via {github.authMethod === 'oauth' ? 'OAuth' : 'Personal Access Token'}
          </p>
        </div>
        <button
          onClick={onDisconnect}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
                     border border-slate-200 dark:border-slate-700
                     hover:bg-red-50 dark:hover:bg-red-950/30
                     hover:border-red-200 dark:hover:border-red-900/50
                     text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400
                     transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </button>
      </div>

      {/* Permissions */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Permissions
        </p>
        <div className="flex flex-wrap gap-2">
          {github.scopes.map((scope) => (
            <span
              key={scope}
              className="px-2 py-1 text-xs font-medium rounded
                         bg-slate-200 dark:bg-slate-700
                         text-slate-700 dark:text-slate-300"
            >
              {scope}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function DisconnectedState({
  onSignIn,
  onTokenSubmit,
}: {
  onSignIn?: () => void
  onTokenSubmit?: (token: string) => void
}) {
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [token, setToken] = useState('')

  const handleTokenSubmit = () => {
    if (token.trim()) {
      onTokenSubmit?.(token.trim())
      setToken('')
      setShowTokenInput(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            GitHub not connected
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            Connect your GitHub account to view PR status, review requests, and repository information.
          </p>
        </div>
      </div>

      {/* Auth Options */}
      <div className="space-y-3">
        {/* OAuth Button */}
        <button
          onClick={onSignIn}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                     bg-slate-900 dark:bg-slate-100
                     text-white dark:text-slate-900
                     hover:bg-slate-800 dark:hover:bg-slate-200
                     transition-colors font-medium"
        >
          <Github className="h-5 w-5" />
          Sign in with GitHub
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
              or
            </span>
          </div>
        </div>

        {/* PAT Option */}
        {!showTokenInput ? (
          <button
            onClick={() => setShowTokenInput(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                       border border-slate-200 dark:border-slate-700
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       text-slate-700 dark:text-slate-300
                       transition-colors font-medium"
          >
            <Key className="h-5 w-5" />
            Use Personal Access Token
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="github-token"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Personal Access Token
              </label>
              <input
                id="github-token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-lg
                           bg-white dark:bg-slate-800
                           border border-slate-200 dark:border-slate-700
                           text-slate-900 dark:text-slate-100
                           placeholder:text-slate-400
                           focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                           transition-colors"
              />
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Token requires <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">repo</code> and{' '}
                <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">read:user</code> scopes.{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  Create token
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowTokenInput(false)
                  setToken('')
                }}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg
                           border border-slate-200 dark:border-slate-700
                           hover:bg-slate-50 dark:hover:bg-slate-800
                           text-slate-700 dark:text-slate-300
                           transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTokenSubmit}
                disabled={!token.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg
                           bg-cyan-500 hover:bg-cyan-600
                           text-white
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function GitHubSettings({
  github,
  onGitHubSignIn,
  onGitHubTokenSubmit,
  onGitHubDisconnect,
}: GitHubSettingsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          GitHub
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Connect your GitHub account to access repository data, pull requests, and issues.
        </p>
      </div>

      {/* Content */}
      {github.isConnected ? (
        <ConnectedState github={github} onDisconnect={onGitHubDisconnect} />
      ) : (
        <DisconnectedState
          onSignIn={onGitHubSignIn}
          onTokenSubmit={onGitHubTokenSubmit}
        />
      )}
    </div>
  )
}
