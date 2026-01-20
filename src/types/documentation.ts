// Documentation parsing types

export interface Step {
  id: string
  content: string
  isCompleted: boolean
}

export interface Stage {
  id: string
  name: string
  steps: Step[]
}

export interface Phase {
  id: string
  name: string
  order: number
  status: 'not-started' | 'in-progress' | 'completed'
  stages: Stage[]
  progress: number
}

export interface ProjectDocumentation {
  phases: Phase[]
  sourceFiles: string[]
  progressPercentage: number
  lastParsed: string
}

export interface DocFileInfo {
  path: string
  name: string
  relativePath: string
}

// Raw types from Rust backend (snake_case)
export interface RawStep {
  content: string
  is_completed: boolean
}

export interface RawStage {
  name: string
  steps: RawStep[]
}

export interface RawPhase {
  name: string
  order: number
  status: string
  stages: RawStage[]
  progress: number
}

export interface RawProjectDocumentation {
  phases: RawPhase[]
  source_files: string[]
  progress_percentage: number
}

export interface RawDocFileInfo {
  path: string
  name: string
  relative_path: string
}

// Transform functions
export function transformDocumentation(raw: RawProjectDocumentation): ProjectDocumentation {
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

export function transformDocFileInfo(raw: RawDocFileInfo): DocFileInfo {
  return {
    path: raw.path,
    name: raw.name,
    relativePath: raw.relative_path,
  }
}
