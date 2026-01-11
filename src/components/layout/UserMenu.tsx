import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { LogOut, User as UserIcon, ChevronUp } from 'lucide-react'

export interface User {
  name: string
  email?: string
  avatarUrl?: string
}

export interface UserMenuProps {
  user: User
  collapsed?: boolean
  onLogout?: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserMenu({ user, collapsed = false, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    buttonRef.current?.focus()
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  // Close on escape
  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        setIsOpen(!isOpen)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) setIsOpen(true)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) setIsOpen(true)
        break
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`
          w-full flex items-center gap-3 px-2 py-2 rounded-md
          hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
          ${collapsed ? 'justify-center' : ''}
        `}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
              {user.name ? (
                <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                  {getInitials(user.name)}
                </span>
              ) : (
                <UserIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              )}
            </div>
          )}
        </div>

        {/* Name and email */}
        {!collapsed && (
          <>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                {user.name}
              </p>
              {user.email && (
                <p className="text-xs text-slate-500 dark:text-slate-500 truncate">
                  {user.email}
                </p>
              )}
            </div>

            {/* Chevron */}
            <ChevronUp
              className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ${
                isOpen ? 'rotate-0' : 'rotate-180'
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 mb-1 py-1 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-50"
        >
          <button
            role="menuitem"
            onClick={() => {
              close()
              onLogout?.()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
