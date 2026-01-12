import type { Settings, SettingsCategory } from './types'

export const sampleSettings: Settings = {
  projectFolders: [
    {
      id: 'folder-001',
      path: '/Users/jmcconocha/Projects',
      exclusions: ['node_modules', '.git', 'archive'],
      addedAt: '2024-01-10T09:00:00Z',
    },
    {
      id: 'folder-002',
      path: '/Users/jmcconocha/Projects/Work/clients',
      exclusions: [],
      addedAt: '2024-02-01T14:30:00Z',
    },
  ],
  manualProjects: [
    {
      id: 'manual-001',
      path: '/Users/jmcconocha/Projects/Dropbox/side-project',
      name: 'side-project',
      addedAt: '2024-01-15T11:00:00Z',
    },
    {
      id: 'manual-002',
      path: '/opt/homebrew/repos/dotfiles-backup',
      name: 'dotfiles-backup',
      addedAt: '2024-01-20T16:45:00Z',
    },
    {
      id: 'manual-003',
      path: '/Volumes/External/archived-projects/legacy-app',
      name: 'legacy-app',
      addedAt: '2024-02-05T10:00:00Z',
    },
  ],
  github: {
    isConnected: true,
    authMethod: 'oauth',
    username: 'alexdev',
    avatarUrl: 'https://avatars.githubusercontent.com/u/12345678',
    connectedAt: '2024-01-10T09:30:00Z',
    scopes: ['repo', 'read:user'],
    accessToken: null,
  },
  editor: {
    selected: 'vscode',
    options: [
      { id: 'vscode', name: 'Visual Studio Code', command: 'code' },
      { id: 'cursor', name: 'Cursor', command: 'cursor' },
      { id: 'sublime', name: 'Sublime Text', command: 'subl' },
      { id: 'webstorm', name: 'WebStorm', command: 'webstorm' },
      { id: 'zed', name: 'Zed', command: 'zed' },
      { id: 'neovim', name: 'Neovim', command: 'nvim' },
    ],
  },
  theme: 'system',
  notifications: {
    enabled: true,
    gitStatusChanges: true,
    uncommittedReminders: true,
    uncommittedReminderHours: 24,
    prUpdates: true,
    prReviewRequests: true,
    issueAssignments: false,
    syncErrors: true,
  },
}

export const settingsCategories: SettingsCategory[] = [
  { id: 'general', label: 'General', icon: 'settings' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'github', label: 'GitHub', icon: 'github' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
]
