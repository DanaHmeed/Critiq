import { useEffect, useState } from 'react'
import { AppSidebar } from '../components/shared/AppSidebar'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { Button } from '../components/ui/button'
import { cn } from '../components/ui/utils'
import {
  Users,
  FileCode,
  MessageSquare,
  CheckCircle,
  Clock,
  Eye,
  ShieldOff,
  Shield,
  TrendingUp,
} from 'lucide-react'
import { adminApi, type AdminStats } from '../../api/admin'
import type { ReviewRequest, User } from '../../api/types'
import { countValue, formatRelativeTime } from '../utils/format'

type Tab = 'overview' | 'users' | 'requests'

const roleColors: Record<string, string> = {
  admin: 'text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent)]/10',
  reviewer: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  requester: 'text-[var(--muted)] border-border bg-[var(--secondary)]',
  suspended: 'text-red-400 border-red-500/30 bg-red-500/10',
}

const emptyStats: AdminStats = {
  total_users: 0,
  total_requests: 0,
  total_comments: 0,
  pending: 0,
  in_review: 0,
  completed: 0,
}

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<AdminStats>(emptyStats)
  const [users, setUsers] = useState<User[]>([])
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.all([adminApi.stats(), adminApi.users(), adminApi.requests()])
      .then(([statsRes, usersRes, requestsRes]) => {
        if (!active) return
        setStats(statsRes.stats)
        setUsers(usersRes.users)
        setRequests(requestsRes.requests)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load admin data')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function toggleSuspend(id: string, currentRole: string) {
    setError('')
    try {
      const { user } = await adminApi.suspend(id, currentRole !== 'suspended')
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: user.role } : u)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update user')
    }
  }

  const statCards = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Requests', value: stats.total_requests, icon: FileCode, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Comments', value: stats.total_comments, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'In Review', value: stats.in_review, icon: TrendingUp, color: 'text-[var(--muted)]', bg: 'bg-[var(--secondary)]' },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar isAdmin />

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 mt-10 lg:mt-0">
            <div className="flex items-center gap-2 mb-1">
              <h1>Admin Dashboard</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono-display bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 rounded uppercase tracking-widest">
                Admin
              </span>
            </div>
            <p className="text-sm text-[var(--muted)]">Platform overview and user management</p>
          </div>

          {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
          {loading && <div className="mb-4 text-sm text-[var(--muted)]">Loading admin data...</div>}

          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            {(['overview', 'users', 'requests'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-1.5 text-xs font-mono-display rounded-md capitalize whitespace-nowrap transition-colors shrink-0',
                  tab === t
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--surface)] border border-border text-[var(--muted)] hover:text-foreground hover:bg-[var(--secondary)]'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((s) => (
                  <div key={s.label} className="p-4 bg-[var(--surface)] border border-border rounded-md">
                    <div className={cn('w-8 h-8 rounded-md flex items-center justify-center mb-3', s.bg)}>
                      <s.icon className={cn('w-4 h-4', s.color)} />
                    </div>
                    <div className="text-xl font-mono-display font-medium">{s.value}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-mono-display uppercase tracking-widest text-[var(--muted)] mb-3">
                    Recent Users
                  </h3>
                  <div className="bg-[var(--surface)] border border-border rounded-md divide-y divide-border">
                    {users.slice(0, 4).map((u) => (
                      <div key={u.id} className="flex items-center gap-3 p-3">
                        <UserAvatar name={u.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{u.name}</p>
                          <p className="text-xs text-[var(--muted)] truncate">{u.email}</p>
                        </div>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-mono-display', roleColors[u.role])}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                    {!loading && users.length === 0 && <div className="p-3 text-sm text-[var(--muted)]">No users yet.</div>}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-mono-display uppercase tracking-widest text-[var(--muted)] mb-3">
                    Recent Requests
                  </h3>
                  <div className="bg-[var(--surface)] border border-border rounded-md divide-y divide-border">
                    {requests.slice(0, 4).map((r) => (
                      <div key={r.id} className="flex items-center gap-3 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{r.title}</p>
                          <p className="text-xs text-[var(--muted)]">{r.author_name} · {formatRelativeTime(r.created_at)}</p>
                        </div>
                        <StatusBadge status={r.status} size="sm" />
                      </div>
                    ))}
                    {!loading && requests.length === 0 && <div className="p-3 text-sm text-[var(--muted)]">No requests yet.</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="bg-[var(--surface)] border border-border rounded-md overflow-hidden">
              <div className="sm:hidden divide-y divide-border">
                {users.map((u) => (
                  <div key={u.id} className="p-4 flex items-start gap-3">
                    <UserAvatar name={u.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-sm">{u.name}</span>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-mono-display', roleColors[u.role])}>
                          {u.role}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted)] mb-2">{u.email}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSuspend(u.id, u.role)}
                        className={cn(
                          'text-xs h-7',
                          u.role === 'suspended'
                            ? 'text-green-400 border-green-500/30 hover:bg-green-500/10'
                            : 'text-red-400 border-red-500/30 hover:bg-red-500/10'
                        )}
                      >
                        {u.role === 'suspended' ? <Shield className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                        {u.role === 'suspended' ? 'Unsuspend' : 'Suspend'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <table className="hidden sm:table w-full">
                <thead className="bg-[var(--secondary)] text-[10px] font-mono-display uppercase tracking-widest border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">User</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Email</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Role</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Reviews</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Joined</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--secondary)]/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={u.name} size="sm" />
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--muted)]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-mono-display', roleColors[u.role])}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono-display">{u.review_count}</td>
                      <td className="px-4 py-3 text-xs text-[var(--muted)]">{formatRelativeTime(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="h-7 px-2">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSuspend(u.id, u.role)}
                            className={cn(
                              'h-7 text-xs',
                              u.role === 'suspended'
                                ? 'text-green-400 border-green-500/30 hover:bg-green-500/10'
                                : 'text-red-400 border-red-500/30 hover:bg-red-500/10'
                            )}
                          >
                            {u.role === 'suspended' ? (
                              <><Shield className="w-3 h-3" /> Unsuspend</>
                            ) : (
                              <><ShieldOff className="w-3 h-3" /> Suspend</>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'requests' && (
            <div className="bg-[var(--surface)] border border-border rounded-md overflow-hidden">
              <div className="sm:hidden divide-y divide-border">
                {requests.map((r) => (
                  <div key={r.id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-sm">{r.title}</span>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <p className="text-xs text-[var(--muted)]">
                      {r.author_name} · {r.language} · {formatRelativeTime(r.created_at)}
                    </p>
                  </div>
                ))}
              </div>

              <table className="hidden sm:table w-full">
                <thead className="bg-[var(--secondary)] text-[10px] font-mono-display uppercase tracking-widest border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Title</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Author</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Language</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Status</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Comments</th>
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--secondary)]/40 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{r.title}</td>
                      <td className="px-4 py-3 text-sm text-[var(--muted)]">{r.author_name}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 bg-[var(--secondary)] border border-border rounded font-mono-display text-[var(--muted)]">
                          {r.language}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} size="sm" /></td>
                      <td className="px-4 py-3 text-sm font-mono-display text-[var(--muted)]">{countValue(r.comment_count)}</td>
                      <td className="px-4 py-3 text-xs text-[var(--muted)]">{formatRelativeTime(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
