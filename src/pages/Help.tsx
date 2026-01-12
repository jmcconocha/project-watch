import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom'
import { BookOpen, Rocket, Keyboard, Info, MessageCircleQuestion } from 'lucide-react'

const helpTabs = [
  { path: '/help/getting-started', label: 'Getting Started', icon: Rocket },
  { path: '/help/features', label: 'Features', icon: BookOpen },
  { path: '/help/shortcuts', label: 'Shortcuts', icon: Keyboard },
  { path: '/help/faq', label: 'FAQ', icon: MessageCircleQuestion },
  { path: '/help/about', label: 'About', icon: Info },
]

export function Help() {
  const location = useLocation()

  // Redirect /help to /help/getting-started
  if (location.pathname === '/help') {
    return <Navigate to="/help/getting-started" replace />
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Help
      </h1>

      <div className="flex gap-6">
        {/* Help navigation */}
        <nav className="w-48 shrink-0">
          <ul className="space-y-1">
            {helpTabs.map((tab) => (
              <li key={tab.path}>
                <NavLink
                  to={tab.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Help content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
