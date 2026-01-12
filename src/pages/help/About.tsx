import { Github, Heart, ExternalLink } from 'lucide-react'

export function About() {
  const version = '1.0.0'

  return (
    <div className="space-y-6">
      {/* App Info */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 100 100" className="w-10 h-10">
              <path
                d="M50 35c-8-12-16-17-27-17-14 0-25 11-25 25s11 25 25 25c11 0 19-5 27-17 8 12 16 17 27 17 14 0 25-11 25-25s-11-25-25-25c-11 0-19 5-27 17z"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(-12 50 50)"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Project Watch
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Version {version}
            </p>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          A native macOS app for tracking and managing your development projects.
          Keep an eye on Git status, pull requests, and never forget to commit again.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/jmcconocha/project-watch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300
                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Github className="w-4 h-4" />
            View on GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/jmcconocha/project-watch/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300
                       hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Report an Issue
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
          Built With
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <TechItem name="Tauri" description="Native app framework" />
          <TechItem name="React" description="UI library" />
          <TechItem name="TypeScript" description="Type-safe JavaScript" />
          <TechItem name="Tailwind CSS" description="Utility-first CSS" />
          <TechItem name="Rust" description="Backend runtime" />
          <TechItem name="Vite" description="Build tool" />
        </div>
      </div>

      {/* Credits */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
          Credits
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <p>
            <strong>Icons:</strong>{' '}
            <a
              href="https://lucide.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Lucide Icons
            </a>
          </p>
          <p>
            <strong>Fonts:</strong>{' '}
            <a
              href="https://rsms.me/inter/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Inter
            </a>
            {' & '}
            <a
              href="https://www.jetbrains.com/lp/mono/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              JetBrains Mono
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-red-500" /> by{' '}
          <a
            href="https://github.com/jmcconocha"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            jmcconocha
          </a>
        </p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Project Watch. MIT License.</p>
      </div>
    </div>
  )
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <p className="font-medium text-slate-900 dark:text-slate-100">{name}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}
