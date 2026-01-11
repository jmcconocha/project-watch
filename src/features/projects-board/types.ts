// =============================================================================
// Data Types
// =============================================================================

export type BoardStatus = 'active' | 'on-hold' | 'completed' | 'archived'

export interface GitStatus {
  branch: string
  isDirty: boolean
  uncommittedFiles: number
  commitsAhead: number
  commitsBehind: number
}

export interface GitHubStatus {
  openPRs: number
  openIssues: number
}

export interface BoardProject {
  id: string
  name: string
  description: string
  localPath: string
  githubUrl: string | null
  status: BoardStatus
  tags: string[]
  lastActivity: string
  git: GitStatus
  github: GitHubStatus
}

export interface BoardColumn {
  id: BoardStatus
  title: string
  order: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface ProjectCardProps {
  project: BoardProject
  isDragging?: boolean
  onSelect?: () => void
  onChangeStatus?: (status: BoardStatus) => void
  onOpenInEditor?: () => void
  onOpenInTerminal?: () => void
  onOpenInGitHub?: () => void
  onOpenInFinder?: () => void
  onEditTags?: () => void
  onArchive?: () => void
  onRemove?: () => void
}

export interface KanbanColumnProps {
  column: BoardColumn
  projects: BoardProject[]
  onSelectProject?: (projectId: string) => void
  onChangeStatus?: (projectId: string, status: BoardStatus) => void
  onOpenInEditor?: (projectId: string) => void
  onOpenInTerminal?: (projectId: string) => void
  onOpenInGitHub?: (projectId: string) => void
  onOpenInFinder?: (projectId: string) => void
  onEditTags?: (projectId: string) => void
  onArchiveProject?: (projectId: string) => void
  onRemoveProject?: (projectId: string) => void
}

export interface ProjectDetailPanelProps {
  project: BoardProject
  onClose?: () => void
  onOpenInEditor?: () => void
  onOpenInTerminal?: () => void
  onOpenInGitHub?: () => void
  onOpenInFinder?: () => void
  onUpdateGitHubUrl?: (url: string | null) => void
}

export interface ProjectsBoardProps {
  columns: BoardColumn[]
  projects: BoardProject[]
  selectedProject?: BoardProject | null
  searchQuery?: string
  onSearch?: (query: string) => void
  onSelectProject?: (projectId: string) => void
  onClosePanel?: () => void
  onMoveProject?: (projectId: string, toStatus: BoardStatus) => void
  onChangeStatus?: (projectId: string, status: BoardStatus) => void
  onOpenInEditor?: (projectId: string) => void
  onOpenInTerminal?: (projectId: string) => void
  onOpenInGitHub?: (projectId: string) => void
  onOpenInFinder?: (projectId: string) => void
  onEditTags?: (projectId: string, tags: string[]) => void
  onArchiveProject?: (projectId: string) => void
  onRemoveProject?: (projectId: string) => void
  onUpdateGitHubUrl?: (projectId: string, url: string | null) => void
}
