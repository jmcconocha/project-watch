import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem('theme') as Theme) || 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme

  if (effectiveTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    theme === 'system' ? getSystemTheme() : theme
  )

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
    setResolvedTheme(newTheme === 'system' ? getSystemTheme() : newTheme)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
        setResolvedTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return { theme, setTheme, resolvedTheme }
}
