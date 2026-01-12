import {
  FolderGit2,
  GitBranch,
  Github,
  Bell,
  RefreshCw,
  Sun,
  Folder,
  Terminal,
  Code,
  ExternalLink,
  Layout,
} from 'lucide-react'

const features = [
  {
    icon: FolderGit2,
    title: 'Project Discovery',
    description:
      'Automatically discovers Git repositories in your watched folders. Just point Project Watch at your development directory and it finds all your projects.',
  },
  {
    icon: GitBranch,
    title: 'Git Status Tracking',
    description:
      'See at a glance which branch you\'re on, how many uncommitted files you have, and whether you\'re ahead or behind the remote.',
  },
  {
    icon: Github,
    title: 'GitHub Integration',
    description:
      'Connect your GitHub account to see open pull requests, review requests, and assigned issues directly on your project cards.',
  },
  {
    icon: Bell,
    title: 'Native Notifications',
    description:
      'Get macOS notifications when projects have uncommitted changes or fall behind the remote branch. Never forget to commit or pull again.',
  },
  {
    icon: RefreshCw,
    title: 'Auto-Refresh',
    description:
      'Configurable automatic refresh keeps your project status up to date. Set the interval that works best for your workflow.',
  },
  {
    icon: Layout,
    title: 'Menu Bar Access',
    description:
      'Quick access from the macOS menu bar. Click the tray icon to show the app, or right-click for quick actions.',
  },
  {
    icon: Folder,
    title: 'Open in Finder',
    description:
      'Quickly open any project folder in Finder with a single click. Great for file management and exploration.',
  },
  {
    icon: Terminal,
    title: 'Open in Terminal',
    description:
      'Launch Terminal directly in any project directory. Perfect for running commands and scripts.',
  },
  {
    icon: Code,
    title: 'Open in Editor',
    description:
      'Open projects in your preferred code editor. Supports VS Code, Cursor, Sublime Text, WebStorm, Zed, and Neovim.',
  },
  {
    icon: ExternalLink,
    title: 'Open on GitHub',
    description:
      'Jump directly to your project\'s GitHub repository. Quick access to pull requests, issues, and code review.',
  },
  {
    icon: Sun,
    title: 'Light & Dark Mode',
    description:
      'Choose between light mode, dark mode, or follow your system preference. Easy on the eyes, day or night.',
  },
]

export function Features() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Features
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Project Watch is packed with features to help you manage your development projects.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
