import { FolderPlus, FolderSearch, Github, Bell, RefreshCw } from 'lucide-react'

export function GettingStarted() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Getting Started
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Welcome to Project Watch! This guide will help you get up and running quickly.
      </p>

      <div className="space-y-8">
        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">1</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Add Your Projects
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Start by adding the folders where your development projects live.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Go to <strong>Settings → Projects</strong></li>
              <li>Click <strong>"Add Folder"</strong> to select a directory</li>
              <li>Project Watch will automatically discover all Git repositories in that folder</li>
            </ol>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">2</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <FolderSearch className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              View Your Projects
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Once projects are added, you'll see them on the Projects Board.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Each project card shows Git status (branch, uncommitted files, sync status)</li>
              <li>Click a project to see more details</li>
              <li>Use quick actions to open in Finder, Terminal, or your code editor</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">3</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Github className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Connect GitHub (Optional)
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Connect your GitHub account to see pull requests and issues.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Go to <strong>Settings → GitHub</strong></li>
              <li>Enter a Personal Access Token (PAT) with <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">repo</code> scope</li>
              <li>Your open PRs and assigned issues will appear on project cards</li>
            </ol>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">4</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Configure Notifications
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Get notified about important changes to your projects.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Go to <strong>Settings → Notifications</strong> to customize alerts</li>
              <li>Get notified when projects have uncommitted changes</li>
              <li>Receive alerts when you fall behind the remote branch</li>
            </ul>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">5</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Enable Auto-Refresh
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Keep your project status up to date automatically.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Go to <strong>Settings → General</strong></li>
              <li>Enable auto-refresh and set your preferred interval</li>
              <li>Project Watch will periodically check Git status for all projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
