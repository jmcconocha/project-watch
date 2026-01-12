import { useEffect, useRef, useCallback } from 'react'
import { useProjectStore, useSettingsStore } from '../stores'
import { getGitStatus, isTauri } from '../services'

interface UseGitRefreshOptions {
  /** Refresh interval in milliseconds (overrides settings if provided) */
  interval?: number
  /** Whether to enable auto-refresh (overrides settings if provided) */
  enabled?: boolean
}

export function useGitRefresh(options: UseGitRefreshOptions = {}) {
  // Get settings from store
  const autoRefreshEnabled = useSettingsStore((state) => state.autoRefreshEnabled)
  const autoRefreshInterval = useSettingsStore((state) => state.autoRefreshInterval)

  // Use options if provided, otherwise fall back to settings
  const enabled = options.enabled ?? autoRefreshEnabled
  const interval = options.interval ?? (autoRefreshInterval * 60 * 1000) // Convert minutes to ms

  const projects = useProjectStore((state) => state.projects)
  const updateProject = useProjectStore((state) => state.updateProject)
  const isRefreshing = useRef(false)
  const lastRefresh = useRef<Date | null>(null)

  const refreshGitStatus = useCallback(async () => {
    if (!isTauri() || isRefreshing.current || projects.length === 0) {
      return
    }

    isRefreshing.current = true

    try {
      // Refresh git status for all projects in parallel (with concurrency limit)
      const CONCURRENCY = 5
      const chunks: typeof projects[] = []

      for (let i = 0; i < projects.length; i += CONCURRENCY) {
        chunks.push(projects.slice(i, i + CONCURRENCY))
      }

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async (project) => {
            try {
              const status = await getGitStatus(project.localPath)
              updateProject(project.id, {
                git: {
                  branch: status.branch,
                  isDirty: status.is_dirty,
                  uncommittedFiles: status.uncommitted_files,
                  commitsAhead: status.commits_ahead,
                  commitsBehind: status.commits_behind,
                },
                lastActivity: new Date().toISOString(),
              })
            } catch (error) {
              // Silently fail for individual projects
              console.warn(`Failed to refresh git status for ${project.name}:`, error)
            }
          })
        )
      }

      lastRefresh.current = new Date()
    } finally {
      isRefreshing.current = false
    }
  }, [projects, updateProject])

  // Set up periodic refresh
  useEffect(() => {
    if (!enabled || !isTauri()) {
      return
    }

    // Initial refresh after a short delay
    const initialTimeout = setTimeout(() => {
      refreshGitStatus()
    }, 2000)

    // Periodic refresh
    const intervalId = setInterval(() => {
      refreshGitStatus()
    }, interval)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(intervalId)
    }
  }, [enabled, interval, refreshGitStatus])

  return {
    refreshGitStatus,
    isRefreshing: isRefreshing.current,
    lastRefresh: lastRefresh.current,
  }
}
