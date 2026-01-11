import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'number'
  value?: string
  onChange?: (value: string) => void
  icon?: ReactNode
  rightIcon?: ReactNode
  error?: boolean
  errorMessage?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      value,
      onChange,
      icon,
      rightIcon,
      error,
      errorMessage,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className={`
              w-full h-10 rounded-md border bg-white dark:bg-slate-950
              text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : 'pl-3'}
              ${rightIcon ? 'pr-10' : 'pr-3'}
              ${
                error
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-300 dark:border-slate-700'
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
