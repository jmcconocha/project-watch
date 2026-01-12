import { useState } from 'react'
import { FolderSearch, Loader2, Check, AlertCircle } from 'lucide-react'
import {
  ProjectsSettings as ProjectsSettingsPanel,
  type ProjectFolder,
  type ManualProject,
} from '../../features/settings'
import { useProjectStore, toast } from '../../stores'
import { pickFolder, scanFolderForProjects, getGitStatus } from '../../services'
import type { BoardProject } from '../../features/projects-board'

export function ProjectsSettings() {
  const [projectFolders, setProjectFolders] = useState<ProjectFolder[]>([])
  const [manualProjects, setManualProjects] = useState<ManualProject[]>([])
  const [scanResults, setScanResults] = useState<{ path: string; count: number } | null>(null)

  const addProjects = useProjectStore((state) => state.addProjects)
  const isScanning = useProjectStore((state) => state.isScanning)
  const setScanning = useProjectStore((state) => state.setScanning)
  const hasProject = useProjectStore((state) => state.hasProject)

  // Convert scanned project info to BoardProject
  const convertToProject = async (projectInfo: { name: string; path: string; has_git: boolean }): Promise<BoardProject> => {
    let gitStatus = {
      branch: 'main',
      isDirty: false,
      uncommittedFiles: 0,
      commitsAhead: 0,
      commitsBehind: 0,
    }

    // Try to get real git status
    try {
      const status = await getGitStatus(projectInfo.path)
      gitStatus = {
        branch: status.branch,
        isDirty: status.is_dirty,
        uncommittedFiles: status.uncommitted_files,
        commitsAhead: status.commits_ahead,
        commitsBehind: status.commits_behind,
      }
    } catch (error) {
      console.warn('Could not get git status for', projectInfo.path, error)
    }

    return {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: projectInfo.name,
      description: '',
      localPath: projectInfo.path,
      githubUrl: null,
      status: 'active',
      tags: [],
      lastActivity: new Date().toISOString(),
      git: gitStatus,
      github: {
        openPRs: 0,
        openIssues: 0,
      },
    }
  }

  const handleScanFolder = async (path: string) => {
    setScanning(true)
    setScanResults(null)

    try {
      toast.info(`Scanning ${path} for projects...`)
      const projects = await scanFolderForProjects(path, 3)

      if (projects.length === 0) {
        toast.warning('No git repositories found in this folder')
        setScanResults({ path, count: 0 })
        return
      }

      // Filter out already tracked projects
      const newProjects = projects.filter((p) => !hasProject(p.path))

      if (newProjects.length === 0) {
        toast.info('All discovered projects are already being tracked')
        setScanResults({ path, count: 0 })
        return
      }

      // Convert and add projects
      const boardProjects = await Promise.all(
        newProjects.map((p) => convertToProject(p))
      )

      addProjects(boardProjects)
      setScanResults({ path, count: newProjects.length })
      toast.success(`Added ${newProjects.length} project${newProjects.length !== 1 ? 's' : ''}`)
    } catch (error) {
      console.error('Scan error:', error)
      toast.error(`Failed to scan folder: ${error}`)
    } finally {
      setScanning(false)
    }
  }

  const handleAddProjectFolder = async (path: string) => {
    const newFolder: ProjectFolder = {
      id: `folder-${Date.now()}`,
      path,
      exclusions: [],
      addedAt: new Date().toISOString(),
    }
    setProjectFolders((prev) => [...prev, newFolder])

    // Automatically scan the folder
    await handleScanFolder(path)
  }

  const handleRemoveProjectFolder = (folderId: string) => {
    setProjectFolders((prev) => prev.filter((f) => f.id !== folderId))
  }

  const handleUpdateFolderExclusions = (folderId: string, exclusions: string[]) => {
    setProjectFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, exclusions } : f))
    )
  }

  const handleAddManualProject = async (path: string) => {
    const name = path.split('/').pop() || 'Untitled'
    const newManualProject: ManualProject = {
      id: `manual-${Date.now()}`,
      path,
      name,
      addedAt: new Date().toISOString(),
    }
    setManualProjects((prev) => [...prev, newManualProject])

    // Add to project store
    if (!hasProject(path)) {
      const project = await convertToProject({ name, path, has_git: true })
      addProjects([project])
      toast.success(`Added ${name} to projects`)
    } else {
      toast.info('This project is already being tracked')
    }
  }

  const handleRemoveManualProject = (projectId: string) => {
    setManualProjects((prev) => prev.filter((p) => p.id !== projectId))
  }

  const handleOpenFolderPicker = async (purpose: 'projectFolder' | 'manualProject') => {
    try {
      const selectedPath = await pickFolder()

      if (!selectedPath) {
        return // User cancelled
      }

      if (purpose === 'projectFolder') {
        await handleAddProjectFolder(selectedPath)
      } else {
        await handleAddManualProject(selectedPath)
      }
    } catch (error) {
      console.error('Folder picker error:', error)
      toast.error(`Failed to open folder picker: ${error}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Scan Status Banner */}
      {isScanning && (
        <div className="flex items-center gap-3 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg animate-fade-in">
          <Loader2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 animate-spin" />
          <span className="text-sm text-cyan-700 dark:text-cyan-300">
            Scanning for git repositories...
          </span>
        </div>
      )}

      {/* Scan Results Banner */}
      {scanResults && !isScanning && (
        <div className={`flex items-center gap-3 p-4 rounded-lg animate-fade-in ${
          scanResults.count > 0
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
        }`}>
          {scanResults.count > 0 ? (
            <>
              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-700 dark:text-emerald-300">
                Found and added {scanResults.count} new project{scanResults.count !== 1 ? 's' : ''} from {scanResults.path}
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm text-amber-700 dark:text-amber-300">
                No new projects found in {scanResults.path}
              </span>
            </>
          )}
          <button
            onClick={() => setScanResults(null)}
            className="ml-auto text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Scan Button */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <FolderSearch className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-1">
              Scan for Projects
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Select a folder to scan for git repositories. Projects will be automatically added to your board.
            </p>
            <button
              onClick={() => handleOpenFolderPicker('projectFolder')}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700
                         disabled:bg-slate-400 disabled:cursor-not-allowed
                         text-white font-medium rounded-lg shadow-sm transition-colors
                         focus-ring btn-press"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <FolderSearch className="h-4 w-4" />
                  Choose Folder to Scan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Existing Settings Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <ProjectsSettingsPanel
          projectFolders={projectFolders}
          manualProjects={manualProjects}
          onAddProjectFolder={handleAddProjectFolder}
          onRemoveProjectFolder={handleRemoveProjectFolder}
          onUpdateFolderExclusions={handleUpdateFolderExclusions}
          onAddManualProject={handleAddManualProject}
          onRemoveManualProject={handleRemoveManualProject}
          onOpenFolderPicker={handleOpenFolderPicker}
        />
      </div>
    </div>
  )
}
