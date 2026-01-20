import { useMemo } from 'react'

interface ProgressBarProps {
  value: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  color?: 'cyan' | 'emerald' | 'amber' | 'rose'
  className?: string
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const colorClasses = {
  cyan: 'bg-cyan-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
}

export function ProgressBar({
  value,
  size = 'md',
  showLabel = false,
  color = 'cyan',
  className = '',
}: ProgressBarProps) {
  const clampedValue = useMemo(() => Math.min(100, Math.max(0, value)), [value])
  const formattedValue = useMemo(() => Math.round(clampedValue), [clampedValue])

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums min-w-[3ch]">
          {formattedValue}%
        </span>
      )}
    </div>
  )
}
