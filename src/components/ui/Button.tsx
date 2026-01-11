import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantStyles = {
  primary:
    'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white shadow-sm',
  secondary:
    'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200',
  ghost:
    'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200',
  danger:
    'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm',
}

const sizeStyles = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center font-medium rounded-md
          transition-colors duration-150 focus:outline-none focus-visible:ring-2
          focus-visible:ring-cyan-500 focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-slate-900
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
