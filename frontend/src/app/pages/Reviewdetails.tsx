import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { CodeBlock, type CodeComment } from '../components/shared/CodeBlock'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { ArrowLeft, CheckCircle, Eye } from 'lucide-react'
import { requestApi } from '../../api/requests'
import { commentApi } from '../../api/comments'
import type { ReviewComment, ReviewRequest } from '../../api/types'
import { formatRelativeTime } from '../utils/format'

function toCodeComment(comment: ReviewComment): CodeComment {
  return {
    line: comment.line_number,
    author: comment.author_name,
    avatar: '',
    text: comment.text,
    timestamp: formatRelativeTime(comment.created_at),
  }
}

export function ReviewDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [request, setRequest] = useState<ReviewRequest | null>(null)
  const [comments, setComments] = useState<ReviewComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true

    requestApi.get(id)
      .then(({ request, comments }) => {
        if (!active) return
        setRequest(request)
        setComments(comments)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load review')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  const handleAddComment = (line: number) => {
    setSelectedLine(line)
    setNewComment('')
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedLine || !request) return

    setSubmitting(true)
    setError('')
    try {
      const { comment } = await commentApi.add({
        request_id: request.id,
        line_number: selectedLine,
        text: newComment,
      })
      setComments((prev) => [...prev, comment])
      setNewComment('')
      setSelectedLine(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleComplete() {
    if (!request) return
    setSubmitting(true)
    setError('')
    try {
      const { request: updated } = await requestApi.updateStatus(request.id, 'completed')
      setRequest(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update status')
    } finally {
      setSubmitting(false)
    }
  }

  const codeComments = comments.map(toCodeComment)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-border bg-[var(--surface)] sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-3">
            <button
              onClick={() => navigate('/my-requests')}
              className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-foreground mb-3 transition-colors mt-10 lg:mt-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Requests
            </button>

            {loading && <p className="text-sm text-[var(--muted)]">Loading review...</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}

            {request && (
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-base sm:text-lg font-medium truncate">{request.title}</h2>
                    <LanguageChip language={request.language} />
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xl">
                    {request.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-sm">
                    <UserAvatar name={request.reviewer_name || 'Unassigned'} online={Boolean(request.reviewer_name)} />
                    <div>
                      <div className="text-xs font-medium">{request.reviewer_name || 'Unassigned'}</div>
                      <div className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                        <Eye className="w-3 h-3" />
                        Reviewing
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleComplete}
                    variant="outline"
                    size="sm"
                    disabled={submitting || request.status === 'completed'}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Complete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {request && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div className="flex-1 lg:w-[60%] p-4 sm:p-6 overflow-auto border-b lg:border-b-0 lg:border-r border-border">
              <CodeBlock
                code={request.code}
                language={request.language}
                comments={codeComments}
                onAddComment={handleAddComment}
                highlightedLine={selectedLine}
                maxHeight="none"
              />
            </div>

            <div className="lg:w-[40%] p-4 sm:p-6 overflow-auto bg-[var(--surface)]">
              <h3 className="text-sm font-mono-display uppercase tracking-widest text-[var(--muted)] mb-4">
                Comments ({comments.length})
              </h3>

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
                      disabled={submitting}
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

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-[var(--code-surface)] border border-border rounded-md"
                  >
                    <div className="flex items-start gap-2.5 mb-2">
                      <UserAvatar name={comment.author_name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium">{comment.author_name}</span>
                          <span className="text-[10px] text-[var(--muted)]">{formatRelativeTime(comment.created_at)}</span>
                          <span className="flex items-center gap-1 text-[10px] font-mono-display text-[var(--accent)]">
                            <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                            L{comment.line_number}
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
        )}
      </main>
    </div>
  )
}
