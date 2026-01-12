import { useEffect, useRef, useCallback } from 'react'
import { useProjectStore } from '../stores'
import { useSettingsStore } from '../stores'
import { parseGitHubUrl, getRepoStats } from '../services'

interface UseGitHubRefreshOptions {
  /** Refresh interval in milliseconds (default: 5 minutes) */
  interval?: number
  /** Whether to enable auto-refresh (default: true) */
  enabled?: boolean
}

export function useGitHubRefresh(options: UseGitHubRefreshOptions = {}) {
  // Get settings from store
  const autoRefreshEnabled = useSettingsStore((state) => state.autoRefreshEnabled)
  const autoRefreshInterval = useSettingsStore((state) => state.autoRefreshInterval)

  // GitHub refresh is less frequent - use 2x the git refresh interval (minimum 5 minutes)
  const defaultInterval = Math.max(autoRefreshInterval * 2, 5) * 60 * 1000
  const enabled = options.enabled ?? autoRefreshEnabled
  const interval = options.interval ?? defaultInterval

  const projects = useProjectStore((state) => state.projects)
  const updateProject = useProjectStore((state) => state.updateProject)
  const github = useSettingsStore((state) => state.github)
  const isRefreshing = useRef(false)
  const lastRefresh = useRef<Date | null>(null)

  const refreshGitHubStatus = useCallback(async () => {
    // Only refresh if connected and have a token
    if (!github.isConnected || !github.accessToken || !github.username) {
      return
    }

    if (isRefreshing.current || projects.length === 0) {
      return
    }

    isRefreshing.current = true

    try {
      // Filter projects that have a GitHub URL
      const projectsWithGitHub = projects.filter((p) => p.githubUrl)

      // Process in chunks to avoid rate limiting
      const CONCURRENCY = 3
      const chunks: typeof projectsWithGitHub[] = []

      for (let i = 0; i < projectsWithGitHub.length; i += CONCURRENCY) {
        chunks.push(projectsWithGitHub.slice(i, i + CONCURRENCY))
      }

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async (project) => {
            if (!project.githubUrl) return

            try {
              const parsed = parseGitHubUrl(project.githubUrl)
              if (!parsed) return

              const stats = await getRepoStats(
                github.accessToken!,
                parsed.owner,
                parsed.repo,
                github.username!
              )

              updateProject(project.id, {
                github: {
                  openPRs: stats.openPRs,
                  openIssues: stats.openIssues,
                },
                lastActivity: new Date().toISOString(),
              })
            } catch (error) {
              console.warn(
                `Failed to refresh GitHub status for ${project.name}:`,
                error
              )
            }
          })
        )

        // Small delay between chunks to respect rate limits
        if (chunks.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      lastRefresh.current = new Date()
    } finally {
      isRefreshing.current = false
    }
  }, [projects, updateProject, github])

  // Set up periodic refresh
  useEffect(() => {
    if (!enabled || !github.isConnected || !github.accessToken) {
      return
    }

    // Initial refresh after a short delay
    const initialTimeout = setTimeout(() => {
      refreshGitHubStatus()
    }, 3000)

    // Periodic refresh
    const intervalId = setInterval(() => {
      refreshGitHubStatus()
    }, interval)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(intervalId)
    }
  }, [enabled, interval, refreshGitHubStatus, github.isConnected, github.accessToken])

  return {
    refreshGitHubStatus,
    isRefreshing: isRefreshing.current,
    lastRefresh: lastRefresh.current,
  }
}
