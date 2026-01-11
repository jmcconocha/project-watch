import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', padding = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800
          shadow-sm rounded-lg
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = '', as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`text-lg font-semibold text-slate-900 dark:text-slate-100 ${className}`}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

CardTitle.displayName = 'CardTitle'

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-slate-600 dark:text-slate-400 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'
