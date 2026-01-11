import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BoardProject, BoardStatus } from '../features/projects-board'

interface ProjectStore {
  // State
  projects: BoardProject[]
  isLoading: boolean
  isScanning: boolean
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
