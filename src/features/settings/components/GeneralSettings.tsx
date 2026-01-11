import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'
import type { Theme, EditorSettings, EditorId } from '../types'

interface GeneralSettingsProps {
  theme: Theme
  editor: EditorSettings
  onThemeChange?: (theme: Theme) => void
  onEditorChange?: (editorId: EditorId) => void
}

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function GeneralSettings({
  theme,
  editor,
  onThemeChange,
  onEditorChange,
}: GeneralSettingsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          General
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Customize the appearance and default behavior of Project Watch.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Theme
        </label>
        <div className="flex gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isSelected = theme === option.value
            return (
              <button
                key={option.value}
                onClick={() => onThemeChange?.(option.value)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                  border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{option.label}</span>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {theme === 'system'
            ? 'Automatically matches your system appearance.'
            : `The app will always use ${theme} mode.`}
        </p>
      </div>

      {/* Default Editor */}
      <div className="space-y-3">
        <label
          htmlFor="editor-select"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Default Code Editor
        </label>
        <div className="relative">
          <select
            id="editor-select"
            value={editor.selected}
            onChange={(e) => onEditorChange?.(e.target.value as EditorId)}
            className="w-full appearance-none px-4 py-3 pr-10 rounded-lg
                       bg-white dark:bg-slate-800
                       border border-slate-200 dark:border-slate-700
                       text-slate-900 dark:text-slate-100
                       focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                       transition-colors cursor-pointer"
          >
            {editor.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Projects will open with{' '}
          <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-cyan-600 dark:text-cyan-400">
            {editor.options.find((o) => o.id === editor.selected)?.command}
          </code>{' '}
          command.
        </p>
      </div>
    </div>
  )
}
