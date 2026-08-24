import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { CodeBlock, type CodeComment } from '../components/shared/CodeBlock'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  MessageSquarePlus,
  Send,
  Sparkles,
  AlertCircle,
  Clock,
  UserCheck,
} from 'lucide-react'
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
    <div className="flex min-h-screen bg-[#08090a] text-[#f7f8f8]">
      <AppSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Control Bar */}
        <div className="border-b border-white/[0.06] bg-[#0c0d12] px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-md hover:bg-white/[0.06] text-[#8a8f98] hover:text-white transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-white/[0.08]" />

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#8a8f98] hidden sm:inline">Request /</span>
                <h1 className="text-sm font-medium text-white truncate max-w-sm sm:max-w-md">
                  {request ? request.title : 'Loading...'}
                </h1>
                {request && <StatusBadge status={request.status} size="sm" />}
              </div>
            </div>
          </div>

          {request && (
            <div className="flex items-center gap-2 shrink-0">
              <LanguageChip language={request.language} />
              <Button
                onClick={handleComplete}
                variant={request.status === 'completed' ? 'outline' : 'primary'}
                size="sm"
                disabled={submitting || request.status === 'completed'}
                className="gap-1.5 text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {request.status === 'completed' ? 'Completed' : 'Mark Completed'}
              </Button>
            </div>
          )}
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8a8f98] font-mono">
            Loading review inspection workspace...
          </div>
        )}

        {error && (
          <div className="p-4 m-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {error}
          </div>
        )}

        {/* IDE Split View */}
        {request && !loading && (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
            {/* Left: Code Canvas */}
            <div className="flex-1 lg:w-[65%] p-4 sm:p-6 overflow-y-auto scrollbar-thin border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-[#08090a]">
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Description Pill */}
                {request.description && (
                  <div className="p-3.5 rounded-xl bg-[#0e0f14] border border-white/[0.06] text-xs text-[#d0d6e0] leading-relaxed">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8a8f98] block mb-1">
                      Author's Context
                    </span>
                    {request.description}
                  </div>
                )}

                {/* Main Code View */}
                <CodeBlock
                  code={request.code}
                  language={request.language}
                  comments={codeComments}
                  onAddComment={handleAddComment}
                  highlightedLine={selectedLine}
                  maxHeight="none"
                />
              </div>
            </div>

            {/* Right: Review Inspector Panel */}
            <div className="lg:w-[35%] flex flex-col bg-[#0b0c10] overflow-hidden">
              {/* Review Inspector Header */}
              <div className="p-4 border-b border-white/[0.06] bg-[#0e0f14]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    Review Inspector
                  </span>
                  <span className="text-[10px] font-mono text-[#8a8f98]">
                    {comments.length} inline {comments.length === 1 ? 'note' : 'notes'}
                  </span>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#14151f] border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-[#8a8f98] block mb-1">Author</span>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={request.author_name || 'Author'} size="sm" />
                      <span className="text-xs text-white truncate font-medium">{request.author_name || 'Author'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#14151f] border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-[#8a8f98] block mb-1">Assigned Peer</span>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={request.reviewer_name || 'Unassigned'} size="sm" online={Boolean(request.reviewer_name)} />
                      <span className="text-xs text-white truncate font-medium">
                        {request.reviewer_name || 'Open for review'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Feed & Inline Composer */}
              <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-3">
                {/* Active Composer on Selected Line */}
                {selectedLine && (
                  <div className="p-3.5 rounded-xl bg-[#141522] border border-[#5e6ad2]/50 shadow-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#5e6ad2]" />
                        <span className="text-xs font-mono font-medium text-[#8b95ea]">
                          Adding note on Line {selectedLine}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedLine(null)}
                        className="text-[10px] text-[#8a8f98] hover:text-white"
                      >
                        Dismiss
                      </button>
                    </div>

                    <Textarea
                      placeholder="Write your line-specific review note..."
                      value={newCommentText}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="mb-2 text-xs bg-[#08090a]"
                    />

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => setSelectedLine(null)}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitComment}
                        variant="primary"
                        size="sm"
                        disabled={submitting || !newComment.trim()}
                        className="gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Post Note
                      </Button>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-xl bg-[#0e0f14] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={comment.author_name} size="sm" />
                        <span className="text-xs font-medium text-white">{comment.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#8a8f98] font-mono">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                        <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-[#5e6ad2]/15 text-[#8b95ea] border border-[#5e6ad2]/30">
                          L{comment.line_number}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#d0d6e0] leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                ))}

                {comments.length === 0 && !selectedLine && (
                  <div className="py-16 text-center text-[#525660]">
                    <MessageSquarePlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-medium text-[#8a8f98]">No review comments yet</p>
                    <p className="text-[11px] text-[#525660] mt-1">
                      Hover over any line in the code view on the left and click the comment icon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
