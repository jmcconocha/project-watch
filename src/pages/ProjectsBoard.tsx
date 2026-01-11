import { useState } from 'react'
import {
  ProjectsBoard as ProjectsBoardView,
  sampleColumns,
  type BoardProject,
  type BoardStatus,
} from '../features/projects-board'
import { useProjectStore, useSettingsStore, toast } from '../stores'
import { openInEditor, openInTerminal, openInFinder, openUrl } from '../services'

export function ProjectsBoard() {
  const projects = useProjectStore((state) => state.projects)
  const moveProject = useProjectStore((state) => state.moveProject)
  const updateProject = useProjectStore((state) => state.updateProject)
  const removeProject = useProjectStore((state) => state.removeProject)
  const editorId = useSettingsStore((state) => state.editorId)

  const [selectedProject, setSelectedProject] = useState<BoardProject | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSelectProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    setSelectedProject(project || null)
  }

  const handleClosePanel = () => {
    setSelectedProject(null)
  }

  const handleMoveProject = (projectId: string, toStatus: BoardStatus) => {
    moveProject(projectId, toStatus)
    // Update selected project if it was moved
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) =>
        prev ? { ...prev, status: toStatus } : null
      )
    }
    toast.success(`Project moved to ${toStatus.replace('-', ' ')}`)
  }

  const handleChangeStatus = (projectId: string, status: BoardStatus) => {
    handleMoveProject(projectId, status)
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

  const handleOpenInTerminal = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      try {
        await openInTerminal(project.localPath)
        toast.info('Opening in terminal...')
      } catch (error) {
        toast.error(`Failed to open terminal: ${error}`)
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

  const handleEditTags = (projectId: string, tags: string[]) => {
    console.log('Edit tags:', projectId, 'current tags:', tags)
    toast.info('Tag editing coming soon')
    // TODO: Implement tag editing modal
  }

  const handleArchiveProject = (projectId: string) => {
    handleMoveProject(projectId, 'archived')
  }

  const handleRemoveProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    removeProject(projectId)
    if (selectedProject?.id === projectId) {
      setSelectedProject(null)
    }
    toast.success(`${project?.name || 'Project'} removed from tracking`)
  }

  const handleUpdateGitHubUrl = (projectId: string, url: string | null) => {
    updateProject(projectId, { githubUrl: url })
    // Update selected project state too
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => prev ? { ...prev, githubUrl: url } : null)
    }
    toast.success(url ? 'GitHub URL updated' : 'GitHub URL removed')
  }

  return (
    <div className="h-full">
      <ProjectsBoardView
        columns={sampleColumns}
        projects={projects}
        selectedProject={selectedProject}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onSelectProject={handleSelectProject}
        onClosePanel={handleClosePanel}
        onMoveProject={handleMoveProject}
        onChangeStatus={handleChangeStatus}
        onOpenInEditor={handleOpenInEditor}
        onOpenInTerminal={handleOpenInTerminal}
        onOpenInGitHub={handleOpenInGitHub}
        onOpenInFinder={handleOpenInFinder}
        onEditTags={handleEditTags}
        onArchiveProject={handleArchiveProject}
        onRemoveProject={handleRemoveProject}
        onUpdateGitHubUrl={handleUpdateGitHubUrl}
      />
    </div>
  )
}
