import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { parseProjectDocs } from '../services'
import { useTaskStore, type LinkedTask } from './taskStore'
import type {
  ProjectDocumentation,
  Phase,
  Stage,
  Step,
  RawProjectDocumentation,
} from '../types/documentation'

// Transform raw Rust data to frontend types
function transformDocumentation(raw: RawProjectDocumentation): ProjectDocumentation {
  return {
    phases: raw.phases.map((phase, index) => ({
      id: `phase-${index}-${phase.order}`,
      name: phase.name,
      order: phase.order,
      status: phase.status as Phase['status'],
      stages: phase.stages.map((stage, stageIndex) => ({
        id: `stage-${index}-${stageIndex}`,
        name: stage.name,
        steps: stage.steps.map((step, stepIndex) => ({
          id: `step-${index}-${stageIndex}-${stepIndex}`,
          content: step.content,
          isCompleted: step.is_completed,
        })),
      })),
      progress: phase.progress,
    })),
    sourceFiles: raw.source_files,
    progressPercentage: raw.progress_percentage,
    lastParsed: new Date().toISOString(),
  }
}

// Convert documentation to tasks for the Kanban board
function documentationToTasks(documentation: ProjectDocumentation, projectId: string): LinkedTask[] {
  const tasks: LinkedTask[] = []
  let orderCounter = 0

  documentation.phases.forEach((phase) => {
    phase.stages.forEach((stage) => {
      stage.steps.forEach((step) => {
        const stepId = `doc-${projectId}-${step.id}`
        const sourcePath = phase.order > 0
          ? `Phase ${phase.order}: ${phase.name} > ${stage.name}`
          : `${phase.name} > ${stage.name}`

        // Determine column based on completion status
        const columnId = step.isCompleted ? 'done' : 'backlog'

        tasks.push({
          id: stepId,
          title: step.content,
          description: `From: ${sourcePath}`,
          columnId,
          order: orderCounter++,
          priority: 'medium',
          dueDate: null,
          labels: [`phase-${phase.order || 0}`],
          createdAt: new Date().toISOString(),
          // Documentation linking
          isFromDocumentation: true,
          documentationSource: sourcePath,
          documentationStepId: stepId,
        })
      })
    })
  })

  return tasks
}

interface DocumentationState {
  // State - keyed by projectId
  documentationByProject: Record<string, ProjectDocumentation>
  loadingByProject: Record<string, boolean>
  errorByProject: Record<string, string | null>
}

interface DocumentationActions {
  // Actions
  refreshDocumentation: (projectId: string, path: string) => Promise<void>
  importTasksFromDocumentation: (projectId: string) => void
  clearDocumentation: (projectId: string) => void
  clearAllDocumentation: () => void

  // Selectors
  getDocumentation: (projectId: string) => ProjectDocumentation | undefined
  isLoading: (projectId: string) => boolean
  getError: (projectId: string) => string | null
}

type DocumentationStore = DocumentationState & DocumentationActions

export const useDocumentationStore = create<DocumentationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      documentationByProject: {},
      loadingByProject: {},
      errorByProject: {},

      // Actions
      refreshDocumentation: async (projectId: string, path: string) => {
        // Set loading state
        set((state) => ({
          loadingByProject: { ...state.loadingByProject, [projectId]: true },
          errorByProject: { ...state.errorByProject, [projectId]: null },
        }))

        try {
          const rawDocs = await parseProjectDocs(path)
          const documentation = transformDocumentation(rawDocs)

          set((state) => ({
            documentationByProject: {
              ...state.documentationByProject,
              [projectId]: documentation,
            },
            loadingByProject: { ...state.loadingByProject, [projectId]: false },
          }))

          // Auto-import tasks from documentation
          if (documentation.phases.length > 0) {
            const tasks = documentationToTasks(documentation, projectId)
            if (tasks.length > 0) {
              useTaskStore.getState().mergeDocumentationTasks(projectId, tasks)
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to parse documentation'
          console.error(`Failed to parse documentation for project ${projectId}:`, error)

          set((state) => ({
            loadingByProject: { ...state.loadingByProject, [projectId]: false },
            errorByProject: { ...state.errorByProject, [projectId]: errorMessage },
          }))
        }
      },

      // Manually import tasks from already-parsed documentation
      importTasksFromDocumentation: (projectId: string) => {
        const documentation = get().documentationByProject[projectId]
        if (!documentation) return

        const tasks = documentationToTasks(documentation, projectId)
        if (tasks.length > 0) {
          useTaskStore.getState().mergeDocumentationTasks(projectId, tasks)
        }
      },

      clearDocumentation: (projectId: string) => {
        set((state) => {
          const { [projectId]: _, ...restDocs } = state.documentationByProject
          const { [projectId]: __, ...restLoading } = state.loadingByProject
          const { [projectId]: ___, ...restErrors } = state.errorByProject
          return {
            documentationByProject: restDocs,
            loadingByProject: restLoading,
            errorByProject: restErrors,
          }
        })
      },

      clearAllDocumentation: () => {
        set({
          documentationByProject: {},
          loadingByProject: {},
          errorByProject: {},
        })
      },

      // Selectors
      getDocumentation: (projectId: string) => {
        return get().documentationByProject[projectId]
      },

      isLoading: (projectId: string) => {
        return get().loadingByProject[projectId] ?? false
      },

      getError: (projectId: string) => {
        return get().errorByProject[projectId] ?? null
      },
    }),
    {
      name: 'project-watch-documentation',
      partialize: (state) => ({
        documentationByProject: state.documentationByProject,
      }),
    }
  )
)

// Export types for use in components
export type { ProjectDocumentation, Phase, Stage, Step }
