import { useDroppable } from '@dnd-kit/core'
import type { KanbanColumnProps, BoardStatus } from '../types'
import { ProjectCard } from './ProjectCard'

const columnColors: Record<BoardStatus, { bg: string; border: string; text: string; count: string; dropzone: string }> = {
  active: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/20',
    border: 'border-cyan-200 dark:border-cyan-900/50',
    text: 'text-cyan-700 dark:text-cyan-300',
    count: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300',
    dropzone: 'border-cyan-400 bg-cyan-100/50 dark:bg-cyan-900/30',
  },
  'on-hold': {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-900/50',
    text: 'text-amber-700 dark:text-amber-300',
    count: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    dropzone: 'border-amber-400 bg-amber-100/50 dark:bg-amber-900/30',
  },
  completed: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    count: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    dropzone: 'border-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30',
  },
  archived: {
    bg: 'bg-slate-50 dark:bg-slate-800/50',
    border: 'border-slate-200 dark:border-slate-700',
    text: 'text-slate-500 dark:text-slate-400',
    count: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    dropzone: 'border-slate-400 bg-slate-200/50 dark:bg-slate-700/30',
  },
}

export function KanbanColumn({
  column,
  projects,
  onSelectProject,
  onChangeStatus,
  onOpenInEditor,
  onOpenInTerminal,
  onOpenInGitHub,
  onOpenInFinder,
  onEditTags,
  onArchiveProject,
  onRemoveProject,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { column },
  })

  const colors = columnColors[column.id]

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
      {/* Column Header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg border-t border-x ${colors.bg} ${colors.border}`}>
        <h2 className={`font-semibold text-sm ${colors.text}`}>
          {column.title}
        </h2>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.count}`}>
          {projects.length}
        </span>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 space-y-2 rounded-b-lg border-b border-x
                    bg-slate-50/50 dark:bg-slate-900/30 min-h-[400px] overflow-y-auto
                    transition-all duration-200
                    ${isOver ? `border-2 border-dashed ${colors.dropzone}` : colors.border}`}
      >
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={() => onSelectProject?.(project.id)}
              onChangeStatus={(status) => onChangeStatus?.(project.id, status)}
              onOpenInEditor={() => onOpenInEditor?.(project.id)}
              onOpenInTerminal={() => onOpenInTerminal?.(project.id)}
              onOpenInGitHub={() => onOpenInGitHub?.(project.id)}
              onOpenInFinder={() => onOpenInFinder?.(project.id)}
              onEditTags={() => onEditTags?.(project.id)}
              onArchive={() => onArchiveProject?.(project.id)}
              onRemove={() => onRemoveProject?.(project.id)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-sm text-slate-400 dark:text-slate-500">
            No projects
          </div>
        )}
      </div>
    </div>
  )
}
