import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { cn } from '../ui/utils'

export interface CodeComment {
  line: number
  author: string
  avatar: string
  text: string
  timestamp: string
}

interface CodeBlockProps {
  code: string
  language?: string
  comments?: CodeComment[]
  onAddComment?: (line: number) => void
  showLineNumbers?: boolean
  highlightedLine?: number | null
  maxHeight?: string
}

export function CodeBlock({
  code,
  language = 'typescript',
  comments = [],
  onAddComment,
  showLineNumbers = true,
  highlightedLine,
  maxHeight = '600px',
}: CodeBlockProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const lines = code.split('\n')
  const commentedLines = new Set(comments.map((c) => c.line))

  return (
    <div className="w-full border border-border rounded-md overflow-hidden bg-[var(--code-surface)]">
      {/* Header bar */}
      <div className="px-4 py-2.5 border-b border-border bg-[var(--surface)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          <span className="text-xs text-[var(--muted)] font-mono-display uppercase tracking-widest ml-2">
            {language}
          </span>
        </div>
        {comments.length > 0 && (
          <span className="text-xs text-[var(--muted)] font-mono-display">
            {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Code lines */}
      <div
        className="overflow-auto scrollbar-thin"
        style={{ maxHeight: maxHeight === 'none' ? undefined : maxHeight }}
      >
        <div className="min-w-max">
          {lines.map((line, index) => {
            const lineNumber = index + 1
            const hasComment = commentedLines.has(lineNumber)
            const isHighlighted = highlightedLine === lineNumber
            const isHovered = hoveredLine === lineNumber

            return (
              <div
                key={lineNumber}
                className={cn(
                  'flex items-start group relative',
                  isHighlighted && 'bg-[var(--accent)]/8',
                  isHovered && !isHighlighted && 'bg-[var(--surface)]/40',
                  'transition-colors'
                )}
                onMouseEnter={() => setHoveredLine(lineNumber)}
                onMouseLeave={() => setHoveredLine(null)}
              >
                {showLineNumbers && (
                  <div className="flex items-center shrink-0 sticky left-0 bg-inherit">
                    {/* Line number */}
                    <div className="w-12 text-right pr-3 py-1.5 text-[11px] text-[var(--muted)]/50 select-none font-mono-display border-r border-border/50">
                      {lineNumber}
                    </div>
                    {/* Comment dot */}
                    <div className="w-5 flex items-center justify-center py-1.5">
                      {hasComment && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_4px_var(--accent)]" />
                      )}
                    </div>
                  </div>
                )}

                <pre className="flex-1 px-4 py-1.5 text-sm font-mono leading-relaxed overflow-visible text-[var(--foreground)]">
                  <code>{line || ' '}</code>
                </pre>

                {/* Add comment button on hover */}
                {onAddComment && isHovered && !hasComment && (
                  <button
                    onClick={() => onAddComment(lineNumber)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[var(--surface)] border border-border rounded hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--muted)] font-mono-display"
                  >
                    <MessageSquarePlus className="w-3 h-3" />
                    comment
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}