import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useToastStore } from '../../stores'
import type { ToastType } from '../../stores'

const toastStyles: Record<ToastType, { bg: string; icon: typeof CheckCircle; iconColor: string; progressColor: string }> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    progressColor: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    progressColor: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    progressColor: 'bg-amber-500',
  },
  info: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800',
    icon: Info,
    iconColor: 'text-cyan-500',
    progressColor: 'bg-cyan-500',
  },
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast, index) => {
        const style = toastStyles[toast.type]
        const Icon = style.icon

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
                       ${style.bg} animate-slide-in-right overflow-hidden
                       min-w-[300px] max-w-[400px] relative`}
            style={{ animationDelay: `${index * 50}ms` }}
            role="alert"
            aria-live="polite"
          >
            <Icon className={`h-5 w-5 shrink-0 ${style.iconColor}`} aria-hidden="true" />
            <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50
                         text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                         transition-colors btn-press focus-ring"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5 dark:bg-white/5">
              <div
                className={`h-full ${style.progressColor} opacity-60`}
                style={{
                  animation: `shrink-width ${toast.duration || 3000}ms linear forwards`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
