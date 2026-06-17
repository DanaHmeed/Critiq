import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import { Clock, FileCode, CheckCircle, TrendingUp, Plus, MessageSquare } from 'lucide-react'
import { requestApi } from '../../api/requests'
import type { ReviewRequest } from '../../api/types'
import { countValue, formatRelativeTime } from '../utils/format'

export function Dashboard() {
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      { label: 'Open', value: String(pending), icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
      { label: 'In Review', value: String(inReview), icon: FileCode, color: 'text-blue-400', bg: 'bg-blue-500/10' },
      { label: 'Completed', value: String(completed), icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
      { label: 'Total', value: String(requests.length), icon: TrendingUp, color: 'text-[var(--muted)]', bg: 'bg-[var(--secondary)]' },
    ]
  }, [requests])

  const recentRequests = requests.slice(0, 5)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1100px] mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 mt-10 lg:mt-0">
            <h1 className="mb-1">Dashboard</h1>
            <p className="text-sm text-[var(--muted)]">Overview of your code reviews</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 sm:p-5 bg-[var(--surface)] border border-border rounded-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-md ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <span className="text-xl sm:text-2xl font-mono-display">{stat.value}</span>
                </div>
                <div className="text-xs sm:text-sm text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="mb-6">
            <Link to="/create-request">
              <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0">
                <Plus className="w-4 h-4" />
                New Review Request
              </Button>
            </Link>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Requests */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-mono-display uppercase tracking-widest text-[var(--muted)] mb-4">
                Recent Requests
              </h3>
              <div className="bg-[var(--surface)] border border-border rounded-md overflow-hidden">
                {error && <div className="p-4 text-sm text-red-400">{error}</div>}
                {loading && <div className="p-4 text-sm text-[var(--muted)]">Loading requests...</div>}
                {!loading && !error && recentRequests.length === 0 && (
                  <div className="p-4 text-sm text-[var(--muted)]">No review requests yet.</div>
                )}
                {/* Mobile card view */}
                <div className="sm:hidden divide-y divide-border">
                  {recentRequests.map((req) => (
                    <Link
                      key={req.id}
                      to={`/review/${req.id}`}
                      className="block p-4 hover:bg-[var(--secondary)]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-medium text-sm text-foreground">{req.title}</span>
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                        <LanguageChip language={req.language} />
                        <span>{formatRelativeTime(req.created_at)}</span>
                        {countValue(req.comment_count) > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {countValue(req.comment_count)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Desktop table */}
                <table className="hidden sm:table w-full">
                  <thead className="bg-[var(--secondary)] text-[10px] font-mono-display uppercase tracking-widest border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 text-[var(--muted)]">Title</th>
                      <th className="text-left px-4 py-3 text-[var(--muted)]">Language</th>
                      <th className="text-left px-4 py-3 text-[var(--muted)]">Reviewer</th>
                      <th className="text-left px-4 py-3 text-[var(--muted)]">Status</th>
                      <th className="text-left px-4 py-3 text-[var(--muted)]">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[var(--secondary)]/50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            to={`/review/${req.id}`}
                            className="flex items-center gap-2 hover:text-[var(--accent)] text-sm transition-colors"
                          >
                            <span>{req.title}</span>
                            {countValue(req.comment_count) > 0 && (
                              <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                                <MessageSquare className="w-3 h-3" />
                                {countValue(req.comment_count)}
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <LanguageChip language={req.language} />
                        </td>
                        <td className="px-4 py-3">
                          {req.reviewer_name ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar name={req.reviewer_name} size="sm" />
                              <span className="text-xs text-[var(--muted)]">{req.reviewer_name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--muted)]">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={req.status} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted)]">{formatRelativeTime(req.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <h3 className="text-sm font-mono-display uppercase tracking-widest text-[var(--muted)] mb-4">
                Activity
              </h3>
              <div className="bg-[var(--surface)] border border-border rounded-md p-4 space-y-4">
                {recentRequests.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <UserAvatar name={item.reviewer_name || item.author_name || 'You'} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{item.title}</span>{' '}
                        <span className="text-[var(--muted)]">is {item.status}</span>
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{formatRelativeTime(item.created_at)}</p>
                    </div>
                  </div>
                ))}
                {!loading && recentRequests.length === 0 && (
                  <p className="text-sm text-[var(--muted)]">Recent activity will appear here.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
