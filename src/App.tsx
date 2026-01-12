import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout'
import { ToastContainer } from './components/ui'
import { useSettingsStore } from './stores'
import { useGitRefresh, useGitHubRefresh } from './hooks'
import { initNotifications } from './services'
import {
  Dashboard,
  ProjectsBoard,
  ProjectDetail,
  Settings,
  GeneralSettings,
  ProjectsSettings,
  GitHubSettings,
  NotificationsSettings,
} from './pages'

function App() {
  const theme = useSettingsStore((state) => state.theme)

  // Initialize notifications on app startup
  useEffect(() => {
    initNotifications()
  }, [])

  // Enable periodic git status refresh (uses settings for interval)
  useGitRefresh()

  // Enable periodic GitHub status refresh (uses settings for interval)
  useGitHubRefresh()

  // Apply theme on initial load and when it changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      // Listen for system theme changes
      const handler = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          {/* Default redirect to board */}
          <Route index element={<Navigate to="/board" replace />} />

          {/* Main routes */}
          <Route path="board" element={<ProjectsBoard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="project/:id" element={<ProjectDetail />} />

          {/* Settings routes */}
          <Route path="settings" element={<Settings />}>
            <Route path="general" element={<GeneralSettings />} />
            <Route path="projects" element={<ProjectsSettings />} />
            <Route path="github" element={<GitHubSettings />} />
            <Route path="notifications" element={<NotificationsSettings />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
