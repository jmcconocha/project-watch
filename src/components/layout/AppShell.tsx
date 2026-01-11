import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X, PanelLeftClose, PanelLeft } from 'lucide-react'
import { MainNav } from './MainNav'
import { UserMenu, type User } from './UserMenu'
import { ThemeToggle } from './ThemeToggle'
import { useIsDesktop } from '../../hooks'

export interface AppShellProps {
  user?: User
  onLogout?: () => void
}

// Default user for development
const defaultUser: User = {
  name: 'Alex Chen',
  email: 'alex@example.com',
}

export function AppShell({ user = defaultUser, onLogout }: AppShellProps) {
  const isDesktop = useIsDesktop()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Derive effective sidebar visibility - on desktop it's always visible via CSS
  // On mobile, it depends on sidebarOpen state
  const showMobileSidebar = !isDesktop && sidebarOpen

  // Focus trap for mobile sidebar
  useEffect(() => {
    if (!showMobileSidebar) return

    // Focus the close button when sidebar opens
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showMobileSidebar])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [showMobileSidebar])

  const handleNavigation = useCallback(() => {
    // Close mobile sidebar on navigation
    if (!isDesktop) {
      setSidebarOpen(false)
    }
  }, [isDesktop])

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-60'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
                   focus:px-4 focus:py-2 focus:bg-cyan-600 focus:text-white focus:rounded-md
                   focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Mobile backdrop */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 transition-opacity duration-200 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transition-all duration-200 ease-in-out
          ${isDesktop ? sidebarWidth : 'w-60'}
          ${isDesktop ? 'translate-x-0' : sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Sidebar"
      >
        {/* Header with logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {(!sidebarCollapsed || !isDesktop) && (
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Project Watch
            </h1>
          )}

          {/* Close button for mobile */}
          {!isDesktop && (
            <button
              ref={closeButtonRef}
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Collapse button for desktop */}
          {isDesktop && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <MainNav
            collapsed={sidebarCollapsed && isDesktop}
            onNavigate={handleNavigation}
          />
        </div>

        {/* Footer: Theme toggle and User menu */}
        <div className="border-t border-slate-200 dark:border-slate-800">
          {/* Theme toggle */}
          <div className={`p-3 ${sidebarCollapsed && isDesktop ? 'flex justify-center' : 'flex items-center justify-between'}`}>
            {(!sidebarCollapsed || !isDesktop) && (
              <span className="text-xs text-slate-500 dark:text-slate-500">
                Theme
              </span>
            )}
            <ThemeToggle />
          </div>

          {/* User menu */}
          <div className="p-3 pt-0">
            <UserMenu
              user={user}
              collapsed={sidebarCollapsed && isDesktop}
              onLogout={onLogout}
            />
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={`
          transition-all duration-200 ease-in-out
          ${isDesktop ? (sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60') : ''}
        `}
      >
        {/* Mobile header */}
        {!isDesktop && (
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Project Watch
            </span>
          </header>
        )}

        {/* Page content */}
        <main id="main-content" className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
