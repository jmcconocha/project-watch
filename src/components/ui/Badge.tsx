import { type HTMLAttributes, type ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  children: ReactNode
}

const variantStyles = {
  default:
    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  success:
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  warning:
    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  error:
    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  info:
    'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
}

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-xs',
}

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}
