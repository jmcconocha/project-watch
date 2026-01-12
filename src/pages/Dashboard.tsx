import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dashboard as DashboardView,
  type ViewMode,
  type DashboardFilters,
  type Project,
} from '../features/dashboard'
import { useProjectStore, useSettingsStore, toast } from '../stores'
import { openInEditor, openInTerminal, openInFinder, openUrl } from '../services'

export function Dashboard() {
  const navigate = useNavigate()
  const boardProjects = useProjectStore((state) => state.projects)
  const editorId = useSettingsStore((state) => state.editorId)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [filters, setFilters] = useState<DashboardFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  })

  // Map BoardProject to Dashboard Project format
  const projects: Project[] = boardProjects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    localPath: p.localPath,
    githubUrl: p.githubUrl,
    priority: 'none' as const,
    status: p.status,
    dueDate: null,
    progress: p.status === 'completed' ? 100 : p.status === 'active' ? 50 : 0,
    lastActivity: p.lastActivity,
    git: {
      branch: p.git.branch,
      isDirty: p.git.isDirty,
      commitsAhead: p.git.commitsAhead,
      commitsBehind: p.git.commitsBehind,
      openPRs: p.github.openPRs,
    },
  }))

  const handleNavigateToProject = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  const handleNavigateToSettings = () => {
    navigate('/settings/projects')
  }

  const handleOpenInEditor = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      try {
        await openInEditor(project.localPath, editorId)
        toast.info('Opening in editor...')
      } catch (error) {
        toast.error(`Failed to open editor: ${error}`)
      }
    }
  }

  const handleOpenInFinder = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      try {
        await openInFinder(project.localPath)
        toast.info('Opening in Finder...')
      } catch (error) {
        toast.error(`Failed to open Finder: ${error}`)
      }
    }
  }

  const handleOpenInTerminal = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      try {
        await openInTerminal(project.localPath)
        toast.info('Opening in Terminal...')
      } catch (error) {
        toast.error(`Failed to open Terminal: ${error}`)
      }
    }
  }

  const handleOpenInGitHub = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project?.githubUrl) {
      try {
        await openUrl(project.githubUrl)
        toast.info('Opening GitHub...')
      } catch (error) {
        toast.error(`Failed to open GitHub: ${error}`)
      }
    }
  }

  const handleOpenInClaudeCode = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      try {
        // Claude Code uses similar invocation to VS Code
        await openInEditor(project.localPath, 'vscode')
        toast.info('Opening in Claude Code...')
      } catch (error) {
        toast.error(`Failed to open Claude Code: ${error}`)
      }
    }
  }

  return (
    <DashboardView
      projects={projects}
      viewMode={viewMode}
      filters={filters}
      onChangeViewMode={setViewMode}
      onFilterChange={setFilters}
      onNavigateToProject={handleNavigateToProject}
      onNavigateToSettings={handleNavigateToSettings}
      onOpenInEditor={handleOpenInEditor}
      onOpenInFinder={handleOpenInFinder}
      onOpenInTerminal={handleOpenInTerminal}
      onOpenInGitHub={handleOpenInGitHub}
      onOpenInClaudeCode={handleOpenInClaudeCode}
    />
  )
}
