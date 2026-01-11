import { DndContext, DragOverlay } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { Search } from 'lucide-react'
import type { ProjectsBoardProps, BoardProject, BoardStatus } from '../types'
import { KanbanColumn } from './KanbanColumn'
import { ProjectDetailPanel } from './ProjectDetailPanel'
import { ProjectCard } from './ProjectCard'

export function ProjectsBoard({
  columns,
  projects,
  selectedProject,
  searchQuery = '',
  onSearch,
  onSelectProject,
  onClosePanel,
  onMoveProject,
  onChangeStatus,
  onOpenInEditor,
  onOpenInTerminal,
  onOpenInGitHub,
  onOpenInFinder,
  onEditTags,
  onArchiveProject,
  onRemoveProject,
  onUpdateGitHubUrl,
}: ProjectsBoardProps) {
  const [activeProject, setActiveProject] = useState<BoardProject | null>(null)

  // Filter projects by search query
  const filteredProjects = searchQuery
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects

  // Group projects by status
  const projectsByStatus = columns.reduce(
    (acc, column) => {
      acc[column.id] = filteredProjects.filter(
        (p) => p.status === column.id
      )
      return acc
    },
    {} as Record<string, typeof projects>
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const project = projects.find((p) => p.id === active.id)
    if (project) {
      setActiveProject(project)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveProject(null)

    if (over && active.id !== over.id) {
      const projectId = active.id as string
      const newStatus = over.id as BoardStatus
      onMoveProject?.(projectId, newStatus)
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full">
        {/* Main Board Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          selectedProject ? 'mr-0' : ''
        }`}>
          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch?.(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 rounded-lg
                           bg-slate-100 dark:bg-slate-800
                           border border-transparent
                           focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                           text-slate-900 dark:text-slate-100
                           placeholder:text-slate-400 dark:placeholder:text-slate-500
                           outline-none transition-all"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>
            )}
          </div>

          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto p-6">
            <div className="flex gap-4 h-full min-w-max">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  projects={projectsByStatus[column.id] || []}
                  onSelectProject={onSelectProject}
                  onChangeStatus={onChangeStatus}
                  onOpenInEditor={onOpenInEditor}
                  onOpenInTerminal={onOpenInTerminal}
                  onOpenInGitHub={onOpenInGitHub}
                  onOpenInFinder={onOpenInFinder}
                  onEditTags={(id) => onEditTags?.(id, [])}
                  onArchiveProject={onArchiveProject}
                  onRemoveProject={onRemoveProject}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Slide-out Panel */}
        {selectedProject && (
          <div className="w-[400px] shrink-0 border-l border-slate-200 dark:border-slate-800
                          animate-in slide-in-from-right duration-300">
            <ProjectDetailPanel
              project={selectedProject}
              onClose={onClosePanel}
              onOpenInEditor={() => onOpenInEditor?.(selectedProject.id)}
              onOpenInTerminal={() => onOpenInTerminal?.(selectedProject.id)}
              onOpenInGitHub={() => onOpenInGitHub?.(selectedProject.id)}
              onOpenInFinder={() => onOpenInFinder?.(selectedProject.id)}
              onUpdateGitHubUrl={(url) => onUpdateGitHubUrl?.(selectedProject.id, url)}
            />
          </div>
        )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeProject ? (
          <div className="w-[280px]">
            <ProjectCard project={activeProject} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
