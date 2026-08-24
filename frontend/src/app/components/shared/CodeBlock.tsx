import { useState } from 'react'
import { MessageSquarePlus, Copy, Check, MessageSquare } from 'lucide-react'
import { cn } from '../ui/utils'
import { UserAvatar } from './Useravatar'

export interface CodeComment {
  line: number
  author: string
  avatar?: string
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
  inlineComments?: boolean
}

export function CodeBlock({
  code,
  language = 'typescript',
  comments = [],
  onAddComment,
  showLineNumbers = true,
  highlightedLine,
  maxHeight = '600px',
  inlineComments = true,
}: CodeBlockProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')

  // Map comments by line number
  const commentsByLine = comments.reduce<Record<number, CodeComment[]>>((acc, c) => {
    if (!acc[c.line]) acc[c.line] = []
    acc[c.line].push(c)
    return acc
  }, {})

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-[#0b0c10] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-[#0f1015] border-b border-white/[0.06] flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 border border-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 border border-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 border border-emerald-500/80" />
          </div>
          <div className="h-3 w-px bg-white/[0.08] ml-1" />
          <span className="text-[11px] font-mono text-[#8a8f98] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" />
            {language}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {comments.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#8a8f98] font-mono bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06]">
              <MessageSquare className="w-3 h-3 text-[#5e6ad2]" />
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.06] transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code viewport */}
      <div
        className="overflow-auto scrollbar-thin font-mono text-xs leading-relaxed"
        style={{ maxHeight: maxHeight === 'none' ? undefined : maxHeight }}
      >
        <div className="min-w-max py-2">
          {lines.map((line, index) => {
            const lineNumber = index + 1
            const lineComments = commentsByLine[lineNumber] || []
            const hasComment = lineComments.length > 0
            const isHighlighted = highlightedLine === lineNumber
            const isHovered = hoveredLine === lineNumber

            return (
              <div key={lineNumber} className="group/line">
                <div
                  className={cn(
                    'flex items-center relative transition-colors duration-100',
                    isHighlighted && 'bg-[#5e6ad2]/15 border-l-2 border-[#5e6ad2]',
                    isHovered && !isHighlighted && 'bg-white/[0.03]',
                    hasComment && !isHighlighted && 'bg-[#5e6ad2]/[0.04]'
                  )}
                  onMouseEnter={() => setHoveredLine(lineNumber)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {showLineNumbers && (
                    <div className="flex items-center shrink-0 select-none">
                      {/* Gutter with + button */}
                      <div className="w-12 text-right pr-3 py-1 text-[11px] text-[#525660] font-mono group-hover/line:text-[#8a8f98] relative">
                        {onAddComment && (
                          <button
                            onClick={() => onAddComment(lineNumber)}
                            className={cn(
                              'absolute left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded flex items-center justify-center text-[#5e6ad2] bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 transition-opacity',
                              isHovered ? 'opacity-100' : 'opacity-0'
                            )}
                            title={`Add comment on line ${lineNumber}`}
                          >
                            <MessageSquarePlus className="w-2.5 h-2.5" />
                          </button>
                        )}
                        <span className={cn(isHovered && onAddComment ? 'opacity-0' : 'opacity-100')}>
                          {lineNumber}
                        </span>
                      </div>

                      {/* Comment indicator dot */}
                      <div className="w-4 flex items-center justify-center">
                        {hasComment && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] shadow-[0_0_6px_#5e6ad2]" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Code Line Text */}
                  <pre className="flex-1 px-3 py-1 font-mono text-[12px] leading-relaxed overflow-visible text-[#f7f8f8]/90">
                    <code>{line || ' '}</code>
                  </pre>
                </div>

                {/* Inline Comment Thread */}
                {inlineComments && lineComments.length > 0 && (
                  <div className="pl-16 pr-4 py-2 bg-[#0e0f14] border-y border-white/[0.04] space-y-2">
                    {lineComments.map((comment, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#14151f] border border-white/[0.06] shadow-sm flex items-start gap-3"
                      >
                        <UserAvatar name={comment.author} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-[#f7f8f8]">{comment.author}</span>
                            <span className="text-[10px] text-[#8a8f98] font-mono">{comment.timestamp}</span>
                            <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#5e6ad2]/20 text-[#8b95ea] border border-[#5e6ad2]/30">
                              L{comment.line}
                            </span>
                          </div>
                          <p className="text-xs text-[#d0d6e0] leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}