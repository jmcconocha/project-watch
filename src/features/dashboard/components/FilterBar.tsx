import { Search, X } from 'lucide-react'
import type { Priority, ProjectStatus } from '../types'

interface FilterBarProps {
  search: string
  status: ProjectStatus | 'all'
  priority: Priority | 'all'
  onSearchChange?: (search: string) => void
  onStatusChange?: (status: ProjectStatus | 'all') => void
  onPriorityChange?: (priority: Priority | 'all') => void
}

export function FilterBar({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                     rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
                     focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 dark:focus:border-cyan-500
                     transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange?.('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange?.(e.target.value as ProjectStatus | 'all')}
        className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                   rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                   focus:border-cyan-500 dark:focus:border-cyan-500 transition-colors cursor-pointer"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="on-hold">On Hold</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
      </select>

      {/* Priority Filter */}
      <select
        value={priority}
        onChange={(e) => onPriorityChange?.(e.target.value as Priority | 'all')}
        className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                   rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20
                   focus:border-cyan-500 dark:focus:border-cyan-500 transition-colors cursor-pointer"
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="none">None</option>
      </select>
    </div>
  )
}
