import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How do I add projects to Project Watch?',
    answer:
      'Go to Settings → Projects and click "Add Folder". Select the directory containing your development projects. Project Watch will automatically discover all Git repositories in that folder and its subdirectories.',
  },
  {
    question: 'Why don\'t I see my GitHub pull requests?',
    answer:
      'Make sure you\'ve connected your GitHub account in Settings → GitHub. You\'ll need to create a Personal Access Token (PAT) with the "repo" scope. Also ensure that your local project has a remote pointing to GitHub.',
  },
  {
    question: 'How do I create a GitHub Personal Access Token?',
    answer:
      'Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic). Click "Generate new token", give it a name, select the "repo" scope, and click "Generate token". Copy the token and paste it in Project Watch settings.',
  },
  {
    question: 'Can I use Project Watch with GitLab or Bitbucket?',
    answer:
      'Currently, Project Watch only supports GitHub integration for pull requests and issues. However, Git status tracking works with any Git repository regardless of where it\'s hosted.',
  },
  {
    question: 'How often does the Git status refresh?',
    answer:
      'You can configure the auto-refresh interval in Settings → General. The default is 5 minutes. You can also manually refresh at any time by clicking the "Refresh Now" button.',
  },
  {
    question: 'Why am I not receiving notifications?',
    answer:
      'Make sure notifications are enabled in Settings → Notifications. Also check that you\'ve granted notification permission to Project Watch in macOS System Settings → Notifications.',
  },
  {
    question: 'How do I change the default code editor?',
    answer:
      'Go to Settings → General and select your preferred editor from the dropdown. Supported editors include VS Code, Cursor, Sublime Text, WebStorm, Zed, and Neovim.',
  },
  {
    question: 'What does "behind remote" mean?',
    answer:
      'This means there are commits on the remote branch (e.g., origin/main) that you haven\'t pulled yet. Run "git pull" in that project to sync with the remote.',
  },
  {
    question: 'What does "ahead of remote" mean?',
    answer:
      'This means you have local commits that haven\'t been pushed to the remote yet. Run "git push" to upload your commits to the remote repository.',
  },
  {
    question: 'How do I remove a watched folder?',
    answer:
      'Go to Settings → Projects, find the folder you want to remove, and click the remove button (trash icon) next to it. This won\'t delete any files, just stop watching that folder.',
  },
  {
    question: 'Does Project Watch work offline?',
    answer:
      'Yes! Git status tracking works completely offline. GitHub integration features (pull requests, issues) require an internet connection.',
  },
  {
    question: 'Where is my data stored?',
    answer:
      'Project Watch stores settings and project data locally on your Mac. Your GitHub token is stored securely in the app\'s local storage. No data is sent to external servers.',
  },
]

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-3 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex-shrink-0 mt-0.5 text-slate-400">
          {isOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </span>
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {item.question}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pl-8 pr-4">
          <p className="text-slate-600 dark:text-slate-400">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

export function FAQ() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Find answers to common questions about Project Watch.
      </p>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {faqs.map((faq, index) => (
          <FAQAccordion key={index} item={faq} />
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Still have questions?</strong> Visit our{' '}
          <a
            href="https://github.com/jmcconocha/project-watch/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            GitHub Issues
          </a>{' '}
          page to ask questions or report bugs.
        </p>
      </div>
    </div>
  )
}
