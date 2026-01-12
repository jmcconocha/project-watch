import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoardProject, BoardStatus } from '../features/projects-board'
import { getGitStatus } from '../services'

interface ProjectStore {
  // State
  projects: BoardProject[]
  isLoading: boolean
  isScanning: boolean
  isRefreshing: boolean
  lastRefreshed: string | null
  error: string | null

  // Actions
  setProjects: (projects: BoardProject[]) => void
  addProject: (project: BoardProject) => void
  addProjects: (projects: BoardProject[]) => void
  updateProject: (projectId: string, updates: Partial<BoardProject>) => void
  moveProject: (projectId: string, toStatus: BoardStatus) => void
  removeProject: (projectId: string) => void
  setLoading: (loading: boolean) => void
  setScanning: (scanning: boolean) => void
  setError: (error: string | null) => void
  clearSampleData: () => void
  refreshAllGitStatus: () => Promise<void>

  // Selectors
  getProjectById: (id: string) => BoardProject | undefined
  getProjectsByStatus: (status: BoardStatus) => BoardProject[]
  hasProject: (localPath: string) => boolean
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // Initial state - start empty, will be populated by scanning
      projects: [],
      isLoading: false,
      isScanning: false,
      isRefreshing: false,
      lastRefreshed: null,
      error: null,

      // Actions
      setProjects: (projects) => set({ projects }),

      addProject: (project) =>
        set((state) => {
          // Avoid duplicates based on localPath
          if (state.projects.some((p) => p.localPath === project.localPath)) {
            return state
          }
          return { projects: [...state.projects, project] }
        }),

      addProjects: (newProjects) =>
        set((state) => {
          // Filter out duplicates based on localPath
          const existingPaths = new Set(state.projects.map((p) => p.localPath))
          const uniqueNewProjects = newProjects.filter(
            (p) => !existingPaths.has(p.localPath)
          )
          return { projects: [...state.projects, ...uniqueNewProjects] }
        }),

      updateProject: (projectId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, ...updates } : p
          ),
        })),

      moveProject: (projectId, toStatus) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, status: toStatus } : p
          ),
        })),

      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setScanning: (isScanning) => set({ isScanning }),

      setError: (error) => set({ error }),

      clearSampleData: () => set({ projects: [] }),

      refreshAllGitStatus: async () => {
        const projects = get().projects
        if (projects.length === 0) return

        set({ isRefreshing: true })

        try {
          // Refresh git status for all projects in parallel
          const updates = await Promise.all(
            projects.map(async (project) => {
              try {
                const status = await getGitStatus(project.localPath)
                return {
                  id: project.id,
                  git: {
                    branch: status.branch,
                    isDirty: status.is_dirty,
                    uncommittedFiles: status.uncommitted_files,
                    commitsAhead: status.commits_ahead,
                    commitsBehind: status.commits_behind,
                  },
                  lastActivity: new Date().toISOString(),
                }
              } catch (error) {
                console.warn(`Failed to refresh git status for ${project.name}:`, error)
                return null
              }
            })
          )

          // Apply updates
          set((state) => ({
            projects: state.projects.map((project) => {
              const update = updates.find((u) => u?.id === project.id)
              if (update) {
                return { ...project, git: update.git, lastActivity: update.lastActivity }
              }
              return project
            }),
            lastRefreshed: new Date().toISOString(),
            isRefreshing: false,
          }))
        } catch (error) {
          console.error('Failed to refresh git status:', error)
          set({ isRefreshing: false })
        }
      },

      // Selectors
      getProjectById: (id) => get().projects.find((p) => p.id === id),

      getProjectsByStatus: (status) =>
        get().projects.filter((p) => p.status === status),

      hasProject: (localPath) =>
        get().projects.some((p) => p.localPath === localPath),
    }),
    {
      name: 'project-watch-projects',
      partialize: (state) => ({ projects: state.projects }),
    }
  )
)
