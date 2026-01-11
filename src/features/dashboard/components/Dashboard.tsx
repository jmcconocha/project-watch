import { LayoutGrid, List, Table2 } from 'lucide-react'
import type { Project, ViewMode, DashboardFilters } from '../types'
import { filterProjects } from '../types'
import { FilterBar } from './FilterBar'
import { ProjectCard } from './ProjectCard'
import { ProjectTableRow } from './ProjectTableRow'
import { ProjectListItem } from './ProjectListItem'
import { EmptyState } from './EmptyState'

const viewModeIcons: Record<ViewMode, React.ReactNode> = {
  cards: <LayoutGrid className="h-4 w-4" />,
  table: <Table2 className="h-4 w-4" />,
  list: <List className="h-4 w-4" />,
}

interface DashboardProps {
  projects: Project[]
  viewMode: ViewMode
  filters: DashboardFilters
  onChangeViewMode?: (mode: ViewMode) => void
  onFilterChange?: (filters: DashboardFilters) => void
  onNavigateToProject?: (projectId: string) => void
  onNavigateToSettings?: () => void
  onOpenInEditor?: (projectId: string) => void
  onOpenInFinder?: (projectId: string) => void
  onOpenInTerminal?: (projectId: string) => void
  onOpenInGitHub?: (projectId: string) => void
  onOpenInClaudeCode?: (projectId: string) => void
}

export function Dashboard({
  projects,
  viewMode,
  filters,
  onChangeViewMode,
  onFilterChange,
  onNavigateToProject,
  onNavigateToSettings,
  onOpenInEditor,
  onOpenInFinder,
  onOpenInTerminal,
  onOpenInGitHub,
  onOpenInClaudeCode,
}: DashboardProps) {
  const filteredProjects = filterProjects(projects, filters)

  const handleSearchChange = (search: string) => {
    onFilterChange?.({ ...filters, search })
  }

  const handleStatusChange = (status: typeof filters.status) => {
    onFilterChange?.({ ...filters, status })
  }

  const handlePriorityChange = (priority: typeof filters.priority) => {
    onFilterChange?.({ ...filters, priority })
  }

  const handleClearFilters = () => {
    onFilterChange?.({ search: '', status: 'all', priority: 'all' })
  }

  const isFiltered = filters.status !== 'all' || filters.priority !== 'all' || filters.search !== ''

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                {isFiltered ? ' (filtered)' : ''}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {(['cards', 'table', 'list'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onChangeViewMode?.(mode)}
                  className={`
                    flex items-center justify-center p-2 rounded-md transition-all
                    ${
                      viewMode === mode
                        ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }
                  `}
                  title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
                >
                  {viewModeIcons[mode]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <FilterBar
            search={filters.search}
            status={filters.status}
            priority={filters.priority}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {projects.length === 0 ? (
          <EmptyState
            variant="no-projects"
            onNavigateToSettings={onNavigateToSettings}
          />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            variant="no-matches"
            onClearFilters={handleClearFilters}
          />
        ) : viewMode === 'cards' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onNavigate={() => onNavigateToProject?.(project.id)}
                onOpenInEditor={() => onOpenInEditor?.(project.id)}
                onOpenInFinder={() => onOpenInFinder?.(project.id)}
                onOpenInTerminal={() => onOpenInTerminal?.(project.id)}
                onOpenInGitHub={() => onOpenInGitHub?.(project.id)}
                onOpenInClaudeCode={() => onOpenInClaudeCode?.(project.id)}
              />
            ))}
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                      Project
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                      Priority
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                      Progress
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                      Git
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                      Due
                    </th>
                    <th className="text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredProjects.map((project) => (
                    <ProjectTableRow
                      key={project.id}
                      project={project}
                      onNavigate={() => onNavigateToProject?.(project.id)}
                      onOpenInEditor={() => onOpenInEditor?.(project.id)}
                      onOpenInFinder={() => onOpenInFinder?.(project.id)}
                      onOpenInTerminal={() => onOpenInTerminal?.(project.id)}
                      onOpenInGitHub={() => onOpenInGitHub?.(project.id)}
                      onOpenInClaudeCode={() => onOpenInClaudeCode?.(project.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                onNavigate={() => onNavigateToProject?.(project.id)}
                onOpenInEditor={() => onOpenInEditor?.(project.id)}
                onOpenInFinder={() => onOpenInFinder?.(project.id)}
                onOpenInTerminal={() => onOpenInTerminal?.(project.id)}
                onOpenInGitHub={() => onOpenInGitHub?.(project.id)}
                onOpenInClaudeCode={() => onOpenInClaudeCode?.(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
