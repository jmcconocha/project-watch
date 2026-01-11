import { useState } from 'react'
import { useSettingsStore } from '../../stores'
import { validateGitHubToken, getGitHubUser } from '../../services'
import {
  GitHubSettings as GitHubSettingsPanel,
} from '../../features/settings'

export function GitHubSettings() {
  const github = useSettingsStore((state) => state.github)
  const setGitHub = useSettingsStore((state) => state.setGitHub)
  const disconnectGitHub = useSettingsStore((state) => state.disconnectGitHub)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGitHubSignIn = () => {
    console.log('Initiating GitHub OAuth sign in...')
    // OAuth flow not implemented yet - show message
    setError('OAuth is not yet implemented. Please use a Personal Access Token instead.')
  }

  const handleGitHubTokenSubmit = async (token: string) => {
    setIsValidating(true)
    setError(null)

    try {
      // Validate the token and get user info
      const isValid = await validateGitHubToken(token)
      if (!isValid) {
        setError('Invalid token. Please check your token and try again.')
        return
      }

      const user = await getGitHubUser(token)

      setGitHub({
        isConnected: true,
        authMethod: 'pat',
        username: user.login,
        avatarUrl: user.avatar_url,
        connectedAt: new Date().toISOString(),
        scopes: ['repo', 'read:user'],
        accessToken: token,
      })
    } catch (err) {
      console.error('Failed to validate GitHub token:', err)
      setError('Failed to validate token. Please check your token and try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleGitHubDisconnect = () => {
    console.log('Disconnecting GitHub...')
    disconnectGitHub()
    setError(null)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      {isValidating && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Validating token...
        </div>
      )}
      <GitHubSettingsPanel
        github={github}
        onGitHubSignIn={handleGitHubSignIn}
        onGitHubTokenSubmit={handleGitHubTokenSubmit}
        onGitHubDisconnect={handleGitHubDisconnect}
      />
    </div>
  )
}
