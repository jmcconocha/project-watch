import { useSyncExternalStore, useCallback } from 'react'

function getServerSnapshot(): boolean {
  return false
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', callback)
      return () => mediaQuery.removeEventListener('change', callback)
    },
    [query]
  )

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// Convenience hooks for common breakpoints
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px)')
}

export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 768px)')
}
