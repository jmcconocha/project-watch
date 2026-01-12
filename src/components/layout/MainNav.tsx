import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Kanban, Settings, HelpCircle, type LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

export interface MainNavProps {
  items?: NavItem[]
  collapsed?: boolean
  onNavigate?: () => void
}

const defaultNavItems: NavItem[] = [
  { id: 'board', label: 'Projects Board', href: '/board', icon: Kanban },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
  { id: 'help', label: 'Help', href: '/help', icon: HelpCircle },
]

export function MainNav({
  items = defaultNavItems,
  collapsed = false,
  onNavigate,
}: MainNavProps) {
  return (
    <nav className="px-3 space-y-1" aria-label="Main navigation">
      <ul role="list" className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.id}>
              <NavLink
                to={item.href}
                onClick={onNavigate}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                  transition-colors duration-150 focus-ring
                  ${collapsed ? 'justify-center' : ''}
                  ${
                    isActive
                      ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }
                `}
                title={collapsed ? item.label : undefined}
                aria-label={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
