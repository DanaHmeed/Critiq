import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import {
  Clock,
  FileCode,
  CheckCircle2,
  TrendingUp,
  Plus,
  MessageSquare,
  Search,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { requestApi } from '../../api/requests'
import type { ReviewRequest } from '../../api/types'
import { countValue, formatRelativeTime } from '../utils/format'

export function Dashboard() {
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-review' | 'completed'>('all')

  useEffect(() => {
    let active = true

    requestApi.mine()
      .then(({ requests }) => {
        if (active) setRequests(requests)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load dashboard')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'pending').length
    const inReview = requests.filter((r) => r.status === 'in-review').length
    const completed = requests.filter((r) => r.status === 'completed').length

    return [
      { label: 'Pending Triage', value: pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
      { label: 'In Active Review', value: inReview, icon: FileCode, color: 'text-[#8b95ea]', bg: 'bg-[#5e6ad2]/10' },
      { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      { label: 'Total Submitted', value: requests.length, icon: TrendingUp, color: 'text-white', bg: 'bg-white/[0.06]' },
    ]
  }, [requests])

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (req.description && req.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || req.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [requests, searchQuery, statusFilter])

  return (
    <div className="flex min-h-screen bg-[#08090a] text-[#f7f8f8]">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#8a8f98] mb-1">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-white">Dashboard</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                Peer Review Overview
              </h1>
            </div>

            <Link to="/create-request">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-[0_0_15px_rgba(94,106,210,0.3)]">
                <Plus className="w-3.5 h-3.5" />
                New Review Request
              </Button>
            </Link>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-xl linear-panel flex items-center justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono text-[#8a8f98] mb-1">{s.label}</div>
                  <div className="text-2xl font-semibold tracking-tight text-white">{s.value}</div>
                </div>
                <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Requests Table */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filter Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-xl bg-[#0e0f14] border border-white/[0.06]">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#525660] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter requests by title or language..."
                    className="w-full h-8 pl-8 pr-3 bg-transparent text-xs text-white placeholder:text-[#525660] focus:outline-none"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1 bg-[#14151f] p-0.5 rounded-lg border border-white/[0.04]">
                  {(['all', 'pending', 'in-review', 'completed'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono capitalize transition-all ${
                        statusFilter === tab
                          ? 'bg-[#5e6ad2] text-white font-medium shadow-sm'
                          : 'text-[#8a8f98] hover:text-white'
                      }`}
                    >
                      {tab === 'in-review' ? 'In Review' : tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Requests List Card */}
              <div className="rounded-xl linear-panel overflow-hidden">
                {loading && (
                  <div className="p-8 text-center text-xs text-[#8a8f98] font-mono">
                    Loading requests...
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 text-xs text-rose-400">
                    {error}
                  </div>
                )}

                {!loading && filteredRequests.length === 0 && (
                  <div className="p-12 text-center">
                    <FileCode className="w-8 h-8 text-[#525660] mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-white mb-1">No review requests found</h3>
                    <p className="text-xs text-[#8a8f98] mb-4">
                      {searchQuery ? 'Try adjusting your search query.' : 'Submit your first snippet for peer review.'}
                    </p>
                    <Link to="/create-request">
                      <Button variant="primary" size="sm">
                        Create Request
                      </Button>
                    </Link>
                  </div>
                )}

                {!loading && filteredRequests.length > 0 && (
                  <div className="divide-y divide-white/[0.04]">
                    {filteredRequests.map((req) => (
                      <Link
                        key={req.id}
                        to={`/review/${req.id}`}
                        className="group flex items-center justify-between p-3.5 sm:px-5 hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <StatusBadge status={req.status} size="sm" showDot />

                          <div className="min-w-0">
                            <div className="text-xs font-medium text-[#f7f8f8] group-hover:text-white flex items-center gap-2">
                              <span className="truncate">{req.title}</span>
                              {countValue(req.comment_count) > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#8a8f98]">
                                  <MessageSquare className="w-2.5 h-2.5 text-[#5e6ad2]" />
                                  {countValue(req.comment_count)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-[#8a8f98]">
                              <LanguageChip language={req.language} />
                              <span>·</span>
                              <span>{formatRelativeTime(req.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          {req.reviewer_name ? (
                            <div className="hidden sm:flex items-center gap-2">
                              <UserAvatar name={req.reviewer_name} size="sm" />
                              <span className="text-[11px] text-[#8a8f98] font-mono">{req.reviewer_name}</span>
                            </div>
                          ) : (
                            <span className="hidden sm:inline text-[11px] text-[#525660] font-mono">Unassigned</span>
                          )}
                          <ArrowUpRight className="w-4 h-4 text-[#525660] group-hover:text-white transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Activity & Peer Highlights */}
            <div className="space-y-4">
              <div className="rounded-xl linear-panel p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-medium text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    Review Activity
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8f98]">Live feed</span>
                </div>

                <div className="space-y-3">
                  {requests.slice(0, 4).map((req) => (
                    <div key={req.id} className="p-2.5 rounded-lg bg-[#0b0c10] border border-white/[0.04] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white truncate max-w-[140px]">{req.title}</span>
                        <StatusBadge status={req.status} size="sm" showDot={false} />
                      </div>
                      <div className="text-[10px] text-[#8a8f98] font-mono">
                        Updated {formatRelativeTime(req.created_at)}
                      </div>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <div className="text-xs text-[#525660] text-center py-4">
                      No recent activity recorded
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Widget */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#141522] to-[#0c0d12] border border-[#5e6ad2]/20">
                <div className="text-xs font-medium text-white mb-1">Pro Tip: Inline Reviews</div>
                <p className="text-[11px] text-[#8a8f98] leading-relaxed mb-3">
                  Hover over code line numbers inside any review request to drop precision line comments.
                </p>
                <Link to="/my-requests">
                  <button className="text-[11px] font-medium text-[#8b95ea] hover:text-white flex items-center gap-1 transition-colors">
                    View my assigned reviews <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
