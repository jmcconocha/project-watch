import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, EditorId, NotificationSettings, GitHubAuth } from '../features/settings'

interface SettingsStore {
  // State
  theme: Theme
  editorId: EditorId
  notifications: NotificationSettings
  github: GitHubAuth
  autoRefreshEnabled: boolean
  autoRefreshInterval: number // in minutes

  // Actions
  setTheme: (theme: Theme) => void
  setEditorId: (editorId: EditorId) => void
  updateNotifications: (updates: Partial<NotificationSettings>) => void
  setGitHub: (github: GitHubAuth) => void
  disconnectGitHub: () => void
  setAutoRefresh: (enabled: boolean, interval?: number) => void
}

const defaultNotifications: NotificationSettings = {
  enabled: true,
  gitStatusChanges: true,
  uncommittedReminders: true,
  uncommittedReminderHours: 24,
  prUpdates: true,
  prReviewRequests: true,
  issueAssignments: true,
  syncErrors: true,
}

const defaultGitHub: GitHubAuth = {
  isConnected: false,
  authMethod: null,
  username: null,
  avatarUrl: null,
  connectedAt: null,
  scopes: [],
  accessToken: null,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'system',
      editorId: 'vscode',
      notifications: defaultNotifications,
      github: defaultGitHub,
      autoRefreshEnabled: true,
      autoRefreshInterval: 5, // 5 minutes default

      // Actions
      setTheme: (theme) => {
        set({ theme })
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          // System preference
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },

      setEditorId: (editorId) => set({ editorId }),

      updateNotifications: (updates) =>
        set((state) => ({
          notifications: { ...state.notifications, ...updates },
        })),

      setGitHub: (github) => set({ github }),

      disconnectGitHub: () => set({ github: defaultGitHub }),

      setAutoRefresh: (enabled, interval) =>
        set((state) => ({
          autoRefreshEnabled: enabled,
          autoRefreshInterval: interval ?? state.autoRefreshInterval,
        })),
    }),
    {
      name: 'project-watch-settings',
    }
  )
)
