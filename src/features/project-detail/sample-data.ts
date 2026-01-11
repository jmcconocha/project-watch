import type { ProjectDetail, Column, Task } from './types'

export const sampleProject: ProjectDetail = {
  id: 'proj-001',
  name: 'project-watch',
  description: 'A local development project tracker that monitors folders and GitHub repos',
  localPath: '/Users/jmcconocha/Projects/project-watch',
  githubUrl: 'https://github.com/alexdev/project-watch',
  priority: 'high',
  status: 'active',
  dueDate: '2024-02-28',
  notes: `## Current Focus

Wrapping up the dashboard filters feature, then moving on to the project detail view.

### Next Steps

- [ ] Finish filter persistence
- [ ] Add keyboard shortcuts
- [ ] Write tests for filter logic

### Notes

Consider using \`zustand\` for state management instead of context. The current approach is getting unwieldy with all the filter combinations.

---

**Tech debt**: The git status polling is too aggressive. Need to debounce or use file watchers instead.`,
  git: {
    branch: 'feature/dashboard-filters',
    isDirty: true,
    uncommittedFiles: 3,
    commitsAhead: 3,
    commitsBehind: 0,
    lastCommit: {
      hash: 'a1b2c3d',
      message: 'Add status and priority filter dropdowns',
      author: 'Alex Chen',
      timestamp: '2024-02-10T14:32:00Z',
    },
  },
  github: {
    openPRs: [
      {
        number: 42,
        title: 'feat: Add dashboard filter bar',
        author: 'alexdev',
        status: 'review_requested',
        url: 'https://github.com/alexdev/project-watch/pull/42',
      },
    ],
    openIssues: 5,
    lastSynced: '2024-02-10T15:00:00Z',
  },
}

export const sampleColumns: Column[] = [
  { id: 'backlog', title: 'Backlog', order: 0 },
  { id: 'todo', title: 'To Do', order: 1 },
  { id: 'in-progress', title: 'In Progress', order: 2 },
  { id: 'in-review', title: 'In Review', order: 3 },
  { id: 'done', title: 'Done', order: 4 },
]

export const sampleTasks: Task[] = [
  {
    id: 'task-001',
    columnId: 'done',
    title: 'Set up project scaffolding',
    description: 'Initialize the React project with Vite, configure TypeScript, and set up the basic folder structure.',
    priority: 'high',
    dueDate: null,
    labels: ['setup'],
    createdAt: '2024-01-15T09:00:00Z',
    order: 0,
  },
  {
    id: 'task-002',
    columnId: 'done',
    title: 'Design system foundation',
    description: 'Set up Tailwind CSS, define color tokens, and create base components (Button, Card, Input).',
    priority: 'high',
    dueDate: null,
    labels: ['design', 'setup'],
    createdAt: '2024-01-16T10:30:00Z',
    order: 1,
  },
  {
    id: 'task-003',
    columnId: 'done',
    title: 'Dashboard grid layout',
    description: 'Implement the responsive grid layout for project cards on the dashboard.',
    priority: 'medium',
    dueDate: '2024-02-01',
    labels: ['feature', 'ui'],
    createdAt: '2024-01-20T14:00:00Z',
    order: 2,
  },
  {
    id: 'task-004',
    columnId: 'in-review',
    title: 'Filter bar component',
    description: 'Create the filter bar with search input, status dropdown, and priority dropdown. Should persist filter state to localStorage.',
    priority: 'high',
    dueDate: '2024-02-12',
    labels: ['feature', 'ui'],
    createdAt: '2024-02-01T09:00:00Z',
    order: 0,
  },
  {
    id: 'task-005',
    columnId: 'in-progress',
    title: 'Filter persistence',
    description: 'Save selected filters to localStorage and restore on page load. Include URL query param sync for shareable filtered views.',
    priority: 'medium',
    dueDate: '2024-02-14',
    labels: ['feature'],
    createdAt: '2024-02-05T11:00:00Z',
    order: 0,
  },
  {
    id: 'task-006',
    columnId: 'in-progress',
    title: 'View mode toggle',
    description: 'Add toggle to switch between card view, table view, and list view on the dashboard.',
    priority: 'medium',
    dueDate: '2024-02-15',
    labels: ['feature', 'ui'],
    createdAt: '2024-02-06T13:00:00Z',
    order: 1,
  },
  {
    id: 'task-007',
    columnId: 'todo',
    title: 'Keyboard shortcuts',
    description: 'Add keyboard shortcuts for common actions:\n- `Cmd+K` for quick search\n- `Cmd+N` for new project\n- `1-4` for filter by status',
    priority: 'low',
    dueDate: '2024-02-20',
    labels: ['enhancement', 'ux'],
    createdAt: '2024-02-07T10:00:00Z',
    order: 0,
  },
  {
    id: 'task-008',
    columnId: 'todo',
    title: 'Empty state designs',
    description: 'Design and implement empty states for:\n- No projects yet\n- No matching filters\n- Error loading projects',
    priority: 'medium',
    dueDate: '2024-02-18',
    labels: ['ui', 'ux'],
    createdAt: '2024-02-07T14:30:00Z',
    order: 1,
  },
  {
    id: 'task-009',
    columnId: 'backlog',
    title: 'Git status polling optimization',
    description: 'Current polling is too aggressive and causes performance issues. Investigate using file system watchers or longer polling intervals with smart invalidation.',
    priority: 'medium',
    dueDate: null,
    labels: ['tech-debt', 'performance'],
    createdAt: '2024-02-08T09:00:00Z',
    order: 0,
  },
  {
    id: 'task-010',
    columnId: 'backlog',
    title: 'Migrate to Zustand',
    description: 'Replace React Context with Zustand for global state management. The current context-based approach is becoming hard to maintain with nested providers.',
    priority: 'low',
    dueDate: null,
    labels: ['tech-debt', 'refactor'],
    createdAt: '2024-02-09T16:00:00Z',
    order: 1,
  },
  {
    id: 'task-011',
    columnId: 'backlog',
    title: 'Add project sorting options',
    description: '',
    priority: 'low',
    dueDate: null,
    labels: ['enhancement'],
    createdAt: '2024-02-10T11:00:00Z',
    order: 2,
  },
]
