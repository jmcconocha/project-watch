import { useEffect, useState } from 'react'
import {
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Circle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useDocumentationStore, type Phase, type Stage } from '../../../stores'
import { ProgressBar } from '../../../components/ui'

interface DocumentationPanelProps {
  projectId: string
  projectPath: string
}

const statusIcons = {
  'not-started': <Circle className="h-3 w-3 text-slate-400" />,
  'in-progress': <Clock className="h-3 w-3 text-amber-500" />,
  'completed': <CheckCircle2 className="h-3 w-3 text-emerald-500" />,
}

const statusLabels = {
  'not-started': 'Pending',
  'in-progress': 'In Progress',
  'completed': 'Complete',
}

function StageItem({ stage }: { stage: Stage }) {
  const completedSteps = stage.steps.filter((s) => s.isCompleted).length
  const totalSteps = stage.steps.length

  if (totalSteps === 0) return null

  return (
    <div className="ml-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-0.5">
      <span className="truncate">{stage.name}</span>
      <span className="shrink-0 ml-2 tabular-nums">
        {completedSteps}/{totalSteps}
      </span>
    </div>
  )
}

function PhaseItem({ phase, isExpanded, onToggle }: {
  phase: Phase
  isExpanded: boolean
  onToggle: () => void
}) {
  const hasStages = phase.stages.length > 0
  const hasSteps = phase.stages.some((s) => s.steps.length > 0)

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 py-2 px-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        disabled={!hasStages || !hasSteps}
      >
        {hasStages && hasSteps ? (
          isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          )
        ) : (
          <span className="w-3.5" />
        )}

        <span className="flex-1 text-left text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
          Phase {phase.order}: {phase.name}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {statusIcons[phase.status]}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {statusLabels[phase.status]}
          </span>
        </div>
      </button>

      {isExpanded && hasStages && hasSteps && (
        <div className="pb-2">
          {phase.stages.map((stage) => (
            <StageItem key={stage.id} stage={stage} />
          ))}
        </div>
      )}
    </div>
  )
}

export function DocumentationPanel({ projectId, projectPath }: DocumentationPanelProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())
  const {
    getDocumentation,
    isLoading,
    getError,
    refreshDocumentation
  } = useDocumentationStore()

  const documentation = getDocumentation(projectId)
  const loading = isLoading(projectId)
  const error = getError(projectId)

  // Auto-load documentation on mount if not already loaded
  useEffect(() => {
    if (!documentation && !loading && !error) {
      refreshDocumentation(projectId, projectPath)
    }
  }, [projectId, projectPath, documentation, loading, error, refreshDocumentation])

  const handleRefresh = () => {
    refreshDocumentation(projectId, projectPath)
  }

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      if (next.has(phaseId)) {
        next.delete(phaseId)
      } else {
        next.add(phaseId)
      }
      return next
    })
  }

  // If no documentation found and not loading/error, show empty state
  if (!documentation && !loading && !error) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Documentation Progress
        </h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
          title="Refresh documentation"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && !documentation && (
        <div className="flex items-center justify-center py-4 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {/* Content */}
      {documentation && (
        <div className="space-y-3">
          {/* Overall Progress */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Overall</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {Math.round(documentation.progressPercentage)}%
              </span>
            </div>
            <ProgressBar
              value={documentation.progressPercentage}
              size="md"
              color={
                documentation.progressPercentage >= 100
                  ? 'emerald'
                  : documentation.progressPercentage > 50
                  ? 'cyan'
                  : 'amber'
              }
            />
          </div>

          {/* Phases */}
          {documentation.phases.length > 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
              {documentation.phases.map((phase) => (
                <PhaseItem
                  key={phase.id}
                  phase={phase}
                  isExpanded={expandedPhases.has(phase.id)}
                  onToggle={() => togglePhase(phase.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 dark:text-slate-500">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No phases found in documentation</p>
            </div>
          )}

          {/* Source Files */}
          {documentation.sourceFiles.length > 0 && (
            <div className="text-[10px] text-slate-400 dark:text-slate-500">
              Sources: {documentation.sourceFiles.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
