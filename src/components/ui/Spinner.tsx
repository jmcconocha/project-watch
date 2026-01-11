import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-cyan-500 ${sizeClasses[size]} ${className}`}
      aria-label="Loading"
    />
  )
}

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4" role="status">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4" role="alert">
      <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/50">
        <svg
          className="h-8 w-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg
                     hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2
                     focus:ring-cyan-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
