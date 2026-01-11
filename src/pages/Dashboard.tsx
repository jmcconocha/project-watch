import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dashboard as DashboardView,
  sampleProjects,
  type ViewMode,
  type DashboardFilters,
} from '../features/dashboard'
import { useSettingsStore, toast } from '../stores'
import { openInEditor, openInTerminal, openInFinder, openUrl } from '../services'

export function Dashboard() {
  const navigate = useNavigate()
  const editorId = useSettingsStore((state) => state.editorId)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [filters, setFilters] = useState<DashboardFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  })

  const handleNavigateToProject = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  const handleNavigateToSettings = () => {
    navigate('/settings/projects')
  }

  const handleOpenInEditor = async (projectId: string) => {
    const project = sampleProjects.find((p) => p.id === projectId)
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
    const project = sampleProjects.find((p) => p.id === projectId)
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
    const project = sampleProjects.find((p) => p.id === projectId)
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
    const project = sampleProjects.find((p) => p.id === projectId)
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
    const project = sampleProjects.find((p) => p.id === projectId)
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
      projects={sampleProjects}
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
