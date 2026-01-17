/**
 * GitHub API Service
 * Handles all interactions with the GitHub API
 */

const GITHUB_API_BASE = 'https://api.github.com'

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string | null
  email: string | null
}

export interface GitHubPullRequest {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  user: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  html_url: string
  draft: boolean
  requested_reviewers: Array<{ login: string }>
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  user: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  html_url: string
  labels: Array<{ name: string; color: string }>
  assignees: Array<{ login: string; avatar_url: string }>
}

export interface GitHubRepoStats {
  openPRs: number
  openIssues: number
  myPRs: GitHubPullRequest[]
  myIssues: GitHubIssue[]
  reviewRequests: GitHubPullRequest[]
}

/**
 * Validate a GitHub token by making a request to the user endpoint
 */
export async function validateGitHubToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get the authenticated user's information
 */
export async function getGitHubUser(token: string): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Parse a GitHub URL to extract owner and repo
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com[/:]([^/]+)\/([^/.]+)/,  // HTTPS or SSH
    /^([^/]+)\/([^/]+)$/,                 // owner/repo format
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
    }
  }

  return null
}

/**
 * Get open pull requests for a repository
 */
export async function getRepoPullRequests(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubPullRequest[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=open&per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      return [] // Repo not found or no access
    }
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Get open issues for a repository (excluding PRs)
 */
export async function getRepoIssues(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubIssue[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=open&per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      return [] // Repo not found or no access
    }
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const issues: GitHubIssue[] = await response.json()
  // Filter out pull requests (they appear in issues API too)
  return issues.filter((issue) => !('pull_request' in issue))
}

/**
 * Get comprehensive stats for a repository
 */
export async function getRepoStats(
  token: string,
  owner: string,
  repo: string,
  username: string
): Promise<GitHubRepoStats> {
  const [prs, issues] = await Promise.all([
    getRepoPullRequests(token, owner, repo),
    getRepoIssues(token, owner, repo),
  ])

  // Filter for user's PRs and issues
  const myPRs = prs.filter((pr) => pr.user.login === username)
  const myIssues = issues.filter((issue) =>
    issue.assignees.some((a) => a.login === username)
  )
  const reviewRequests = prs.filter((pr) =>
    pr.requested_reviewers.some((r) => r.login === username)
  )

  return {
    openPRs: prs.length,
    openIssues: issues.length,
    myPRs,
    myIssues,
    reviewRequests,
  }
}

// =============================================================================
// Issue Management (Two-way Sync)
// =============================================================================

export interface CreateIssueParams {
  title: string
  body?: string
  labels?: string[]
  assignees?: string[]
}

export interface UpdateIssueParams {
  title?: string
  body?: string
  state?: 'open' | 'closed'
  labels?: string[]
  assignees?: string[]
}

/**
 * Create a new GitHub issue
 */
export async function createGitHubIssue(
  token: string,
  owner: string,
  repo: string,
  params: CreateIssueParams
): Promise<GitHubIssue> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`GitHub API error: ${response.status} - ${error.message || 'Unknown error'}`)
  }

  return response.json()
}

/**
 * Update an existing GitHub issue
 */
export async function updateGitHubIssue(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  params: UpdateIssueParams
): Promise<GitHubIssue> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`GitHub API error: ${response.status} - ${error.message || 'Unknown error'}`)
  }

  return response.json()
}

/**
 * Close a GitHub issue
 */
export async function closeGitHubIssue(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number
): Promise<GitHubIssue> {
  return updateGitHubIssue(token, owner, repo, issueNumber, { state: 'closed' })
}

/**
 * Reopen a GitHub issue
 */
export async function reopenGitHubIssue(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number
): Promise<GitHubIssue> {
  return updateGitHubIssue(token, owner, repo, issueNumber, { state: 'open' })
}

/**
 * Add a comment to a GitHub issue
 */
export async function addIssueComment(
  token: string,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
): Promise<{ id: number; body: string; created_at: string }> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body }),
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`GitHub API error: ${response.status} - ${error.message || 'Unknown error'}`)
  }

  return response.json()
}

/**
 * Get available labels for a repository
 */
export async function getRepoLabels(
  token: string,
  owner: string,
  repo: string
): Promise<Array<{ name: string; color: string; description: string | null }>> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/labels?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    if (response.status === 404) return []
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}
