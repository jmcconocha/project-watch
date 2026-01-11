import {
  GeneralSettings as GeneralSettingsPanel,
  sampleSettings,
  type EditorId,
} from '../../features/settings'
import { useSettingsStore, toast } from '../../stores'

export function GeneralSettings() {
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)
  const editorId = useSettingsStore((state) => state.editorId)
  const setEditorId = useSettingsStore((state) => state.setEditorId)

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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <GeneralSettingsPanel
        theme={theme}
        editor={editor}
        onThemeChange={handleThemeChange}
        onEditorChange={handleEditorChange}
      />
    </div>
  )
}
