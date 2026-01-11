import { FolderSearch, Settings, ArrowRight, Search, X } from 'lucide-react'

interface EmptyStateProps {
  variant?: 'no-projects' | 'no-matches'
  onNavigateToSettings?: () => void
  onClearFilters?: () => void
}

export function EmptyState({
  variant = 'no-projects',
  onNavigateToSettings,
  onClearFilters,
}: EmptyStateProps) {
  if (variant === 'no-matches') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
        {/* Illustration */}
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
            <Search className="h-10 w-10 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <X className="h-4 w-4 text-white" />
          </div>
        </div>

        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          No matching projects
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
          Try adjusting your search or filters
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 text-cyan-600 dark:text-cyan-400
                     hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors
                     focus-ring btn-press font-medium"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-inner">
          <FolderSearch className="h-12 w-12 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-lg animate-pulse">
          <Settings className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        No projects found
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
        Configure your projects folder to start tracking your development repositories.
        Project Watch will automatically scan and display all git repos.
      </p>

      {/* CTA */}
      <button
        onClick={onNavigateToSettings}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg
                   shadow-md hover:shadow-lg transition-all focus-ring btn-press group"
      >
        <Settings className="h-4 w-4" />
        Configure Projects Folder
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Help text */}
      <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
        You can also manually add projects in Settings
      </p>
    </div>
  )
}
