import { useState } from 'react'
import { FileText, Edit3, Check, X } from 'lucide-react'

interface NotesEditorProps {
  notes: string
  onSave?: (notes: string) => void
}

// Simple Markdown renderer for preview (basic formatting only)
function renderMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono text-cyan-600 dark:text-cyan-400">$1</code>')
    // Checkboxes
    .replace(/^- \[x\] (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-emerald-500">✓</span><span class="line-through text-slate-400">$1</span></div>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-slate-400">○</span><span>$1</span></div>')
    // List items
    .replace(/^- (.+)$/gm, '<li class="ml-4 my-0.5">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-4 border-slate-200 dark:border-slate-700" />')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="my-2">')
    .replace(/\n/g, '<br />')
}

export function NotesEditor({ notes, onSave }: NotesEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState(notes)

  const handleSave = () => {
    onSave?.(editedNotes)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedNotes(notes)
    setIsEditing(false)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          Notes
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <Edit3 className="h-3 w-3" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-600 text-white transition-colors"
            >
              <Check className="h-3 w-3" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          value={editedNotes}
          onChange={(e) => setEditedNotes(e.target.value)}
          className="w-full h-64 p-3 text-sm font-mono text-slate-700 dark:text-slate-300
                     bg-slate-50 dark:bg-slate-800/50 rounded-lg
                     border border-slate-200 dark:border-slate-700
                     focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-1 focus:ring-cyan-400/30
                     resize-none outline-none"
          placeholder="Add notes in Markdown..."
        />
      ) : notes ? (
        <div
          className="prose prose-sm prose-slate dark:prose-invert max-w-none
                     p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg
                     text-sm text-slate-600 dark:text-slate-400"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }}
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full p-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700
                     text-slate-400 dark:text-slate-500 text-sm
                     hover:border-cyan-400 dark:hover:border-cyan-600 hover:text-cyan-500
                     transition-colors"
        >
          Click to add notes...
        </button>
      )}
    </div>
  )
}
