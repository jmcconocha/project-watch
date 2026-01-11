import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {options.map((option) => {
        const isActive = theme === option.value
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            title={option.label}
            className={`
              p-1.5 rounded-md transition-colors duration-150
              ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }
            `}
          >
            <option.icon className="w-4 h-4" />
          </button>
        )
      })}
    </div>
  )
}
