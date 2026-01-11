import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom'
import { Settings as SettingsIcon, FolderGit2, Github, Bell } from 'lucide-react'

const settingsTabs = [
  { path: '/settings/general', label: 'General', icon: SettingsIcon },
  { path: '/settings/projects', label: 'Projects', icon: FolderGit2 },
  { path: '/settings/github', label: 'GitHub', icon: Github },
  { path: '/settings/notifications', label: 'Notifications', icon: Bell },
]

export function Settings() {
  const location = useLocation()

  // Redirect /settings to /settings/general
  if (location.pathname === '/settings') {
    return <Navigate to="/settings/general" replace />
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Settings
      </h1>

      <div className="flex gap-6">
        {/* Settings navigation */}
        <nav className="w-48 shrink-0">
          <ul className="space-y-1">
            {settingsTabs.map((tab) => (
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

        {/* Settings content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
