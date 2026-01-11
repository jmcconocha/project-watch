import { useState } from 'react'
import {
  FolderOpen,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import type { ProjectFolder, ManualProject } from '../types'

interface ProjectsSettingsProps {
  projectFolders: ProjectFolder[]
  manualProjects: ManualProject[]
  onAddProjectFolder?: (path: string) => void
  onRemoveProjectFolder?: (folderId: string) => void
  onUpdateFolderExclusions?: (folderId: string, exclusions: string[]) => void
  onAddManualProject?: (path: string) => void
  onRemoveManualProject?: (projectId: string) => void
  onOpenFolderPicker?: (purpose: 'projectFolder' | 'manualProject') => void
}

function FolderCard({
  folder,
  onRemove,
  onUpdateExclusions,
}: {
  folder: ProjectFolder
  onRemove?: () => void
  onUpdateExclusions?: (exclusions: string[]) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [newExclusion, setNewExclusion] = useState('')

  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      onUpdateExclusions?.([...folder.exclusions, newExclusion.trim()])
      setNewExclusion('')
    }
  }

  const handleRemoveExclusion = (exclusion: string) => {
    onUpdateExclusions?.(folder.exclusions.filter((e) => e !== exclusion))
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <FolderOpen className="h-5 w-5 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 dark:text-slate-100 truncate font-mono text-sm">
            {folder.path}
          </p>
          {folder.exclusions.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {folder.exclusions.length} exclusion{folder.exclusions.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-colors"
          title="Remove folder"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Exclusions Panel */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Excluded Folders
          </p>

          {folder.exclusions.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {folder.exclusions.map((exclusion) => (
                <span
                  key={exclusion}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono text-slate-700 dark:text-slate-300"
                >
                  {exclusion}
                  <button
                    onClick={() => handleRemoveExclusion(exclusion)}
                    className="p-0.5 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
              No exclusions — all subfolders will be scanned.
            </p>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddExclusion()}
              placeholder="Add exclusion (e.g., node_modules)"
              className="flex-1 px-3 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-600
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                         placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
                         outline-none transition-colors"
            />
            <button
              onClick={handleAddExclusion}
              disabled={!newExclusion.trim()}
              className="px-3 py-1.5 text-sm font-medium rounded
                         bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200
                         hover:bg-slate-300 dark:hover:bg-slate-500
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ManualProjectCard({
  project,
  onRemove,
}: {
  project: ManualProject
  onRemove?: () => void
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <FolderOpen className="h-4 w-4 text-cyan-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
          {project.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
          {project.path}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-colors"
        title="Remove project"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ProjectsSettings({
  projectFolders,
  manualProjects,
  onRemoveProjectFolder,
  onUpdateFolderExclusions,
  onRemoveManualProject,
  onOpenFolderPicker,
}: ProjectsSettingsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Projects
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure which folders to scan for projects and add individual projects manually.
        </p>
      </div>

      {/* Project Folders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Scan Folders
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Project Watch scans these folders for git repositories.
            </p>
          </div>
          <button
            onClick={() => onOpenFolderPicker?.('projectFolder')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                       bg-cyan-500 hover:bg-cyan-600 text-white
                       transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Folder
          </button>
        </div>

        {projectFolders.length > 0 ? (
          <div className="space-y-3">
            {projectFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onRemove={() => onRemoveProjectFolder?.(folder.id)}
                onUpdateExclusions={(exclusions) =>
                  onUpdateFolderExclusions?.(folder.id, exclusions)
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              No folders configured. Add a folder to start discovering projects.
            </p>
          </div>
        )}
      </div>

      {/* Manual Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Manual Projects
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Projects added individually, not discovered through folder scanning.
            </p>
          </div>
          <button
            onClick={() => onOpenFolderPicker?.('manualProject')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                       border border-slate-200 dark:border-slate-700
                       hover:bg-slate-50 dark:hover:bg-slate-800
                       text-slate-700 dark:text-slate-300
                       transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>

        {manualProjects.length > 0 ? (
          <div className="space-y-2">
            {manualProjects.map((project) => (
              <ManualProjectCard
                key={project.id}
                project={project}
                onRemove={() => onRemoveManualProject?.(project.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            No manual projects added.
          </p>
        )}
      </div>
    </div>
  )
}
