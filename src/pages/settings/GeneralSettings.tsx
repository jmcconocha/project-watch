import { RefreshCw } from 'lucide-react'
import {
  GeneralSettings as GeneralSettingsPanel,
  sampleSettings,
  type EditorId,
} from '../../features/settings'
import { useSettingsStore, useProjectStore, toast } from '../../stores'

export function GeneralSettings() {
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const editorId = useSettingsStore((state) => state.editorId)
  const setEditorId = useSettingsStore((state) => state.setEditorId)
  const autoRefreshEnabled = useSettingsStore((state) => state.autoRefreshEnabled)
  const autoRefreshInterval = useSettingsStore((state) => state.autoRefreshInterval)
  const setAutoRefresh = useSettingsStore((state) => state.setAutoRefresh)
  const lastRefreshed = useProjectStore((state) => state.lastRefreshed)
  const isRefreshing = useProjectStore((state) => state.isRefreshing)
  const refreshAllGitStatus = useProjectStore((state) => state.refreshAllGitStatus)

  // Build editor object for the component
  const editor = {
    ...sampleSettings.editor,
    selected: editorId,
  }

  const handleThemeChange = (newTheme: typeof theme) => {
    setTheme(newTheme)
    toast.success(`Theme changed to ${newTheme}`)
  }

  const handleEditorChange = (newEditorId: EditorId) => {
    setEditorId(newEditorId)
    const editorName = sampleSettings.editor.options.find((e) => e.id === newEditorId)?.name
    toast.success(`Default editor set to ${editorName}`)
  }

  const handleRefreshNow = async () => {
    await refreshAllGitStatus()
    toast.success('Git status refreshed')
  }

  const formatLastRefreshed = () => {
    if (!lastRefreshed) return 'Never'
    const date = new Date(lastRefreshed)
    return date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <GeneralSettingsPanel
          theme={theme}
          editor={editor}
          onThemeChange={handleThemeChange}
          onEditorChange={handleEditorChange}
        />
      </div>

      {/* Auto-Refresh Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
              Auto-Refresh
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Automatically refresh git status for all projects
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Enable auto-refresh
            </span>
            <button
              onClick={() => setAutoRefresh(!autoRefreshEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefreshEnabled
                  ? 'bg-cyan-600'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefreshEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Interval Selector */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Refresh interval
            </span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefresh(autoRefreshEnabled, Number(e.target.value))}
              disabled={!autoRefreshEnabled}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value={1}>1 minute</option>
              <option value={2}>2 minutes</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>

          {/* Last Refreshed & Manual Refresh */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Last refreshed: {formatLastRefreshed()}
            </span>
            <button
              onClick={handleRefreshNow}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                         text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20
                         rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
