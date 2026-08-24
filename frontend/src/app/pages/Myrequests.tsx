import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import { FileCode, Plus, MessageSquare, ArrowUpRight, Search } from 'lucide-react'
import { cn } from '../components/ui/utils'
import { requestApi } from '../../api/requests'
import type { ReviewRequest } from '../../api/types'
import { countValue, formatRelativeTime } from '../utils/format'

type FilterType = 'all' | 'pending' | 'in-review' | 'completed'

export function MyRequests() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let active = true

    requestApi.mine()
      .then(({ requests }) => {
        if (active) setRequests(requests)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load requests')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filtered = requests.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.language.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All Requests' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-review', label: 'In Review' },
    { id: 'completed', label: 'Completed' },
  ]

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
                <span className="text-white">Submissions</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                My Review Requests
              </h1>
              <p className="text-xs text-[#8a8f98] mt-1">
                Manage and track feedback across all your submitted code snippets.
              </p>
            </div>

            <Link to="/create-request">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-[0_0_15px_rgba(94,106,210,0.3)]">
                <Plus className="w-3.5 h-3.5" />
                New Request
              </Button>
            </Link>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-2 rounded-xl bg-[#0e0f14] border border-white/[0.06]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#525660] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or language..."
                className="w-full h-8 pl-8 pr-3 bg-transparent text-xs text-white placeholder:text-[#525660] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#14151f] p-0.5 rounded-lg border border-white/[0.04] overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all ${
                    filter === tab.id
                      ? 'bg-[#5e6ad2] text-white font-medium shadow-sm'
                      : 'text-[#8a8f98] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error}
            </div>
          )}

          {/* Content Card */}
          <div className="rounded-2xl linear-panel overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-[#8a8f98] font-mono">
                Loading submissions...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center">
                <FileCode className="w-9 h-9 text-[#525660] mx-auto mb-3" />
                <h3 className="text-sm font-medium text-white mb-1">No requests match this view</h3>
                <p className="text-xs text-[#8a8f98] max-w-sm mx-auto mb-6">
                  {search ? 'Try clearing your search query to see all submissions.' : 'Submit your first snippet for peer review to start receiving line-by-line feedback.'}
                </p>
                <Link to="/create-request">
                  <Button variant="primary" size="sm">
                    Create Review Request
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {filtered.map((req) => (
                  <Link
                    key={req.id}
                    to={`/review/${req.id}`}
                    className="group flex items-center justify-between p-4 sm:px-6 hover:bg-white/[0.03] transition-colors"
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
                          <span>Submitted {formatRelativeTime(req.created_at)}</span>
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
      </main>
    </div>
  )
}
