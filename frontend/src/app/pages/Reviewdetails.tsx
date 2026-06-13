import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { CodeBlock, type CodeComment } from '../components/shared/CodeBlock'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { ArrowLeft, CheckCircle, Eye } from 'lucide-react'

const sampleCode = `function calculateFibonacci(n: number): number {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

// Usage example
const result = calculateFibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);

// Performance test
const start = Date.now();
for (let i = 0; i < 100; i++) {
  calculateFibonacci(20);
}
const end = Date.now();
console.log(\`Time: \${end - start}ms\`);`

const mockRequest = {
  id: 1,
  title: 'React hooks optimization',
  description:
    'Looking for feedback on performance optimizations in this custom hook implementation. Concerned about unnecessary re-renders.',
  language: 'typescript',
  code: sampleCode,
  author: { name: 'John Doe', avatar: '' },
  reviewer: { name: 'Sarah Chen', avatar: '', online: true },
  status: 'in-review' as const,
}

export function ReviewDetails() {
  const navigate = useNavigate()
  const [comments, setComments] = useState<CodeComment[]>([
    {
      line: 3,
      author: 'Sarah Chen',
      avatar: '',
      text: 'Exponential time complexity O(2ⁿ). Consider memoization or dynamic programming.',
      timestamp: '1 hour ago',
    },
    {
      line: 12,
      author: 'Sarah Chen',
      avatar: '',
      text: 'This test will be extremely slow for n=20 with the current approach.',
      timestamp: '45 min ago',
    },
  ])
  const [newComment, setNewComment] = useState('')
  const [selectedLine, setSelectedLine] = useState<number | null>(null)

  const handleAddComment = (line: number) => {
    setSelectedLine(line)
    setNewComment('')
  }

  const handleSubmitComment = () => {
    if (newComment.trim() && selectedLine) {
      setComments([
        ...comments,
        { line: selectedLine, author: 'You', avatar: '', text: newComment, timestamp: 'Just now' },
      ])
      setNewComment('')
      setSelectedLine(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Sticky header */}
        <div className="border-b border-border bg-[var(--surface)] sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-3">
            <button
              onClick={() => navigate('/my-requests')}
              className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-foreground mb-3 transition-colors mt-10 lg:mt-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Requests
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-base sm:text-lg font-medium truncate">{mockRequest.title}</h2>
                  <LanguageChip language={mockRequest.language} />
                  <StatusBadge status={mockRequest.status} />
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xl">
                  {mockRequest.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 text-sm">
                  <UserAvatar name={mockRequest.reviewer.name} online={mockRequest.reviewer.online} />
                  <div>
                    <div className="text-xs font-medium">{mockRequest.reviewer.name}</div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                      <Eye className="w-3 h-3" />
                      Reviewing
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/my-requests')}
                  variant="outline"
                  size="sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Complete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Split layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Code panel */}
          <div className="flex-1 lg:w-[60%] p-4 sm:p-6 overflow-auto border-b lg:border-b-0 lg:border-r border-border">
            <CodeBlock
              code={mockRequest.code}
              language={mockRequest.language}
              comments={comments}
              onAddComment={handleAddComment}
              highlightedLine={selectedLine}
              maxHeight="none"
            />
          </div>

          {/* Comments panel */}
          <div className="lg:w-[40%] p-4 sm:p-6 overflow-auto bg-[var(--surface)]">
            <h3 className="text-sm font-mono-display uppercase tracking-widest text-[var(--muted)] mb-4">
              Comments ({comments.length})
            </h3>

            {/* Add comment form */}
            {selectedLine && (
              <div className="mb-5 p-4 bg-[var(--code-surface)] border border-[var(--accent)]/30 rounded-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <span className="text-xs font-mono-display text-[var(--muted)]">
                    Line {selectedLine}
                  </span>
                </div>
                <Textarea
                  placeholder="Add your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="mb-2 text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitComment}
                    size="sm"
                    className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0"
                  >
                    Comment
                  </Button>
                  <Button
                    onClick={() => setSelectedLine(null)}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Comment list */}
            <div className="space-y-3">
              {comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[var(--code-surface)] border border-border rounded-md"
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <UserAvatar name={comment.author} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium">{comment.author}</span>
                        <span className="text-[10px] text-[var(--muted)]">{comment.timestamp}</span>
                        <span className="flex items-center gap-1 text-[10px] font-mono-display text-[var(--accent)]">
                          <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                          L{comment.line}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{comment.text}</p>
                </div>
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-12 text-[var(--muted)]">
                <p className="text-sm">No comments yet.</p>
                <p className="text-xs mt-1">Click on a line to add the first comment.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}