import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'

export interface GitStatus {
  branch: string
  is_dirty: boolean
  uncommitted_files: number
  commits_ahead: number
  commits_behind: number
}

export interface ProjectInfo {
  name: string
  path: string
  has_git: boolean
}

// Check if running in Tauri
export const isTauri = (): boolean => {
  return '__TAURI_INTERNALS__' in window
}

// Open a folder in Finder/Explorer
export async function openInFinder(path: string): Promise<void> {
  if (!isTauri()) {
    console.log('[Mock] Open in Finder:', path)
    return
  }
  await invoke('open_in_finder', { path })
}

// Open a folder in Terminal
export async function openInTerminal(path: string): Promise<void> {
  if (!isTauri()) {
    console.log('[Mock] Open in Terminal:', path)
    return
  }
  await invoke('open_in_terminal', { path })
}

// Open a folder in the configured editor
export async function openInEditor(path: string, editor: string = 'vscode'): Promise<void> {
  if (!isTauri()) {
    console.log('[Mock] Open in Editor:', path, editor)
    return
  }
  await invoke('open_in_editor', { path, editor })
}

// Open a URL in the default browser
export async function openUrl(url: string): Promise<void> {
  if (!isTauri()) {
    console.log('[Mock] Open URL:', url)
    window.open(url, '_blank')
    return
  }
  await invoke('open_url', { url })
}

// Get git status for a project
export async function getGitStatus(path: string): Promise<GitStatus> {
  if (!isTauri()) {
    console.log('[Mock] Get git status:', path)
    return {
      branch: 'main',
      is_dirty: false,
      uncommitted_files: 0,
      commits_ahead: 0,
      commits_behind: 0,
    }
  }
  return await invoke<GitStatus>('get_git_status', { path })
}

// Scan a folder for git repositories
export async function scanFolderForProjects(path: string, maxDepth: number = 3): Promise<ProjectInfo[]> {
  if (!isTauri()) {
    console.log('[Mock] Scan folder:', path, maxDepth)
    return []
  }
  return await invoke<ProjectInfo[]>('scan_folder_for_projects', { path, max_depth: maxDepth })
}

// Open folder picker dialog
export async function pickFolder(): Promise<string | null> {
  if (!isTauri()) {
    console.log('[Mock] Pick folder')
    return '/Users/demo/Projects'
  }
  const result = await open({
    directory: true,
    multiple: false,
    title: 'Select Folder',
  })
  return result as string | null
}

// Documentation parsing types (raw from Rust)
export interface RawDocFileInfo {
  path: string
  name: string
  relative_path: string
}

export interface RawStep {
  content: string
  is_completed: boolean
}

export interface RawStage {
  name: string
  steps: RawStep[]
}

export interface RawPhase {
  name: string
  order: number
  status: string
  stages: RawStage[]
  progress: number
}

export interface RawProjectDocumentation {
  phases: RawPhase[]
  source_files: string[]
  progress_percentage: number
}

// Discover documentation files in a project
export async function discoverDocFiles(path: string): Promise<RawDocFileInfo[]> {
  if (!isTauri()) {
    console.log('[Mock] Discover doc files:', path)
    return [
      { path: `${path}/README.md`, name: 'README.md', relative_path: 'README.md' },
      { path: `${path}/docs/spec.md`, name: 'spec.md', relative_path: 'docs/spec.md' },
    ]
  }
  return await invoke<RawDocFileInfo[]>('discover_doc_files', { path })
}

// Parse project documentation
export async function parseProjectDocs(path: string): Promise<RawProjectDocumentation> {
  if (!isTauri()) {
    console.log('[Mock] Parse project docs:', path)
    return {
      phases: [
        {
          name: 'Foundation',
          order: 1,
          status: 'completed',
          stages: [
            {
              name: 'Setup',
              steps: [
                { content: 'Initialize project', is_completed: true },
                { content: 'Add dependencies', is_completed: true },
              ],
            },
          ],
          progress: 100.0,
        },
        {
          name: 'Development',
          order: 2,
          status: 'in-progress',
          stages: [
            {
              name: 'Core Features',
              steps: [
                { content: 'Build main component', is_completed: true },
                { content: 'Add routing', is_completed: false },
                { content: 'Style components', is_completed: false },
              ],
            },
          ],
          progress: 33.3,
        },
      ],
      source_files: ['README.md', 'docs/spec.md'],
      progress_percentage: 50.0,
    }
  }
  return await invoke<RawProjectDocumentation>('parse_project_docs', { path })
}
