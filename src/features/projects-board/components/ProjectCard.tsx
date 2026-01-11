import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import {
  GitBranch,
  GitPullRequest,
  Clock,
  MoreVertical,
  Code,
  Terminal,
  Github,
  FolderOpen,
  Tag,
  Archive,
  Trash2,
  ChevronDown,
  AlertCircle,
  CircleDot,
} from 'lucide-react'
import type { ProjectCardProps, BoardStatus } from '../types'

const statusOptions: { value: BoardStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export function ProjectCard({
  project,
  isDragging,
  onSelect,
  onChangeStatus,
  onOpenInEditor,
  onOpenInTerminal,
  onOpenInGitHub,
  onOpenInFinder,
  onEditTags,
  onArchive,
  onRemove,
}: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: project.id,
    data: { project },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const hasUncommitted = project.git.isDirty
  const hasPRs = project.github.openPRs > 0
  const hasIssues = project.github.openIssues > 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700
                 shadow-sm hover:shadow-md hover:border-cyan-300 dark:hover:border-cyan-700
                 transition-all duration-200 cursor-grab active:cursor-grabbing
                 ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      {/* Card Header - Clickable area */}
      <div
        className="p-3 cursor-pointer"
        onClick={onSelect}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Project Name */}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate mb-2">
          {project.name}
        </h3>

        {/* Git Status Row */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="flex items-center gap-1 font-mono">
            <GitBranch className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{project.git.branch}</span>
          </span>

          {hasUncommitted && (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3 w-3" />
              {project.git.uncommittedFiles}
            </span>
          )}

          {hasPRs && (
            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
              <GitPullRequest className="h-3 w-3" />
              {project.github.openPRs}
            </span>
          )}

          {hasIssues && (
            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <CircleDot className="h-3 w-3" />
              {project.github.openIssues}
            </span>
          )}
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[10px] font-medium rounded
                           bg-slate-100 dark:bg-slate-700
                           text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Last Activity */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(project.lastActivity)}
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div
        className="px-3 py-2 border-t border-slate-100 dark:border-slate-700/50
                      flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowStatusDropdown(!showStatusDropdown)
            }}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400
                       hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <span className="capitalize">{project.status.replace('-', ' ')}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {showStatusDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowStatusDropdown(false)}
              />
              <div className="absolute left-0 top-full mt-1 z-20 w-32
                              bg-white dark:bg-slate-800 rounded-lg shadow-lg
                              border border-slate-200 dark:border-slate-700 py-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation()
                      onChangeStatus?.(option.value)
                      setShowStatusDropdown(false)
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-700
                               ${project.status === option.value
                                 ? 'text-cyan-600 dark:text-cyan-400 font-medium'
                                 : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700
                       text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 w-44
                              bg-white dark:bg-slate-800 rounded-lg shadow-lg
                              border border-slate-200 dark:border-slate-700 py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenInEditor?.()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2
                             hover:bg-slate-50 dark:hover:bg-slate-700
                             text-slate-700 dark:text-slate-200"
                >
                  <Code className="h-4 w-4 text-slate-400" />
                  Open in Editor
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenInTerminal?.()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2
                             hover:bg-slate-50 dark:hover:bg-slate-700
                             text-slate-700 dark:text-slate-200"
                >
                  <Terminal className="h-4 w-4 text-slate-400" />
                  Open in Terminal
                </button>
                {project.githubUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenInGitHub?.()
                      setShowMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm flex items-center gap-2
                               hover:bg-slate-50 dark:hover:bg-slate-700
                               text-slate-700 dark:text-slate-200"
                  >
                    <Github className="h-4 w-4 text-slate-400" />
                    Open on GitHub
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenInFinder?.()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2
                             hover:bg-slate-50 dark:hover:bg-slate-700
                             text-slate-700 dark:text-slate-200"
                >
                  <FolderOpen className="h-4 w-4 text-slate-400" />
                  Open in Finder
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditTags?.()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2
                             hover:bg-slate-50 dark:hover:bg-slate-700
                             text-slate-700 dark:text-slate-200"
                >
                  <Tag className="h-4 w-4 text-slate-400" />
                  Edit Tags
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onArchive?.()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2
                             hover:bg-slate-50 dark:hover:bg-slate-700
                             text-slate-700 dark:text-slate-200"
                >
                  <Archive className="h-4 w-4 text-slate-400" />
                  Archive
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove?.()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm flex items-center gap-2
                             hover:bg-red-50 dark:hover:bg-red-950/30
                             text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
