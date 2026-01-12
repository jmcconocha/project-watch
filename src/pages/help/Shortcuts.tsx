import { Keyboard } from 'lucide-react'

interface ShortcutGroup {
  title: string
  shortcuts: {
    keys: string[]
    description: string
  }[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['⌘', '1'], description: 'Go to Projects Board' },
      { keys: ['⌘', '2'], description: 'Go to Dashboard' },
      { keys: ['⌘', ','], description: 'Open Settings' },
      { keys: ['⌘', '?'], description: 'Open Help' },
      { keys: ['Esc'], description: 'Close dialog / Go back' },
    ],
  },
  {
    title: 'Project Actions',
    shortcuts: [
      { keys: ['⌘', 'O'], description: 'Open project in editor' },
      { keys: ['⌘', 'Shift', 'F'], description: 'Open project in Finder' },
      { keys: ['⌘', 'Shift', 'T'], description: 'Open project in Terminal' },
      { keys: ['⌘', 'Shift', 'G'], description: 'Open project on GitHub' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: ['⌘', 'R'], description: 'Refresh Git status' },
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['⌘', 'Q'], description: 'Quit Project Watch' },
      { keys: ['⌘', 'H'], description: 'Hide Project Watch' },
      { keys: ['⌘', 'M'], description: 'Minimize window' },
    ],
  },
]

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-medium
                    bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300
                    border border-slate-300 dark:border-slate-600 rounded shadow-sm">
      {children}
    </kbd>
  )
}

export function Shortcuts() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Keyboard className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Keyboard Shortcuts
        </h2>
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Use these keyboard shortcuts to navigate and perform actions quickly.
      </p>

      <div className="space-y-8">
        {shortcutGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg
                             hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <KeyCap key={keyIndex}>{key}</KeyCap>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Note:</strong> Some shortcuts may require the app window to be focused.
          Menu bar and system-wide shortcuts work regardless of focus.
        </p>
      </div>
    </div>
  )
}
