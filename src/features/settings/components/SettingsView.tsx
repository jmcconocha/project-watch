import { Settings as SettingsIcon, FolderOpen, Github, Bell } from 'lucide-react'
import type { SettingsCategory, SettingsCategoryId, SettingsViewProps } from '../types'
import { GeneralSettings } from './GeneralSettings'
import { ProjectsSettings } from './ProjectsSettings'
import { GitHubSettings } from './GitHubSettings'
import { NotificationsSettings } from './NotificationsSettings'

const iconMap = {
  settings: SettingsIcon,
  folder: FolderOpen,
  github: Github,
  bell: Bell,
}

function Sidebar({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: SettingsCategory[]
  activeCategory: SettingsCategoryId
  onCategoryChange?: (categoryId: SettingsCategoryId) => void
}) {
  return (
    <nav className="w-56 shrink-0">
      <ul className="space-y-1">
        {categories.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap] || SettingsIcon
          const isActive = activeCategory === category.id

          return (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange?.(category.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? 'text-cyan-500' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="font-medium">{category.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function SettingsView({
  settings,
  categories,
  activeCategory = 'general',
  onCategoryChange,
  onAddProjectFolder,
  onRemoveProjectFolder,
  onUpdateFolderExclusions,
  onAddManualProject,
  onRemoveManualProject,
  onGitHubSignIn,
  onGitHubTokenSubmit,
  onGitHubDisconnect,
  onEditorChange,
  onThemeChange,
  onNotificationChange,
  onOpenFolderPicker,
}: SettingsViewProps) {
  const renderContent = () => {
    switch (activeCategory) {
      case 'general':
        return (
          <GeneralSettings
            theme={settings.theme}
            editor={settings.editor}
            onThemeChange={onThemeChange}
            onEditorChange={onEditorChange}
          />
        )
      case 'projects':
        return (
          <ProjectsSettings
            projectFolders={settings.projectFolders}
            manualProjects={settings.manualProjects}
            onAddProjectFolder={onAddProjectFolder}
            onRemoveProjectFolder={onRemoveProjectFolder}
            onUpdateFolderExclusions={onUpdateFolderExclusions}
            onAddManualProject={onAddManualProject}
            onRemoveManualProject={onRemoveManualProject}
            onOpenFolderPicker={onOpenFolderPicker}
          />
        )
      case 'github':
        return (
          <GitHubSettings
            github={settings.github}
            onGitHubSignIn={onGitHubSignIn}
            onGitHubTokenSubmit={onGitHubTokenSubmit}
            onGitHubDisconnect={onGitHubDisconnect}
          />
        )
      case 'notifications':
        return (
          <NotificationsSettings
            notifications={settings.notifications}
            onNotificationChange={onNotificationChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your preferences and configuration
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <Sidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>

          {/* Mobile Category Selector */}
          <div className="md:hidden w-full mb-4">
            <select
              value={activeCategory}
              onChange={(e) => onCategoryChange?.(e.target.value as SettingsCategoryId)}
              className="w-full px-4 py-3 rounded-lg
                         bg-white dark:bg-slate-800
                         border border-slate-200 dark:border-slate-700
                         text-slate-900 dark:text-slate-100
                         focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
