// =============================================================================
// Data Types
// =============================================================================

export type Theme = 'light' | 'dark' | 'system'
export type AuthMethod = 'oauth' | 'pat'
export type EditorId = 'vscode' | 'cursor' | 'sublime' | 'webstorm' | 'zed' | 'neovim'
export type SettingsCategoryId = 'general' | 'projects' | 'github' | 'notifications'

export interface ProjectFolder {
  id: string
  path: string
  exclusions: string[]
  addedAt: string
}

export interface ManualProject {
  id: string
  path: string
  name: string
  addedAt: string
}

export interface GitHubAuth {
  isConnected: boolean
  authMethod: AuthMethod | null
  username: string | null
  avatarUrl: string | null
  connectedAt: string | null
  scopes: string[]
  accessToken: string | null
}

export interface EditorOption {
  id: EditorId
  name: string
  command: string
}

export interface EditorSettings {
  selected: EditorId
  options: EditorOption[]
}

export interface NotificationSettings {
  enabled: boolean
  gitStatusChanges: boolean
  uncommittedReminders: boolean
  uncommittedReminderHours: number
  prUpdates: boolean
  prReviewRequests: boolean
  issueAssignments: boolean
  syncErrors: boolean
}

export interface Settings {
  projectFolders: ProjectFolder[]
  manualProjects: ManualProject[]
  github: GitHubAuth
  editor: EditorSettings
  theme: Theme
  notifications: NotificationSettings
}

export interface SettingsCategory {
  id: SettingsCategoryId
  label: string
  icon: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface SettingsViewProps {
  settings: Settings
  categories: SettingsCategory[]
  activeCategory?: SettingsCategoryId
  onCategoryChange?: (categoryId: SettingsCategoryId) => void
  onAddProjectFolder?: (path: string) => void
  onRemoveProjectFolder?: (folderId: string) => void
  onUpdateFolderExclusions?: (folderId: string, exclusions: string[]) => void
  onAddManualProject?: (path: string) => void
  onRemoveManualProject?: (projectId: string) => void
  onGitHubSignIn?: () => void
  onGitHubTokenSubmit?: (token: string) => void
  onGitHubDisconnect?: () => void
  onEditorChange?: (editorId: EditorId) => void
  onThemeChange?: (theme: Theme) => void
  onNotificationChange?: (key: keyof NotificationSettings, value: boolean | number) => void
  onOpenFolderPicker?: (purpose: 'projectFolder' | 'manualProject') => void
}
