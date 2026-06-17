import { useState } from 'react'
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

const mockStats = [
  { label: 'Total Users',    value: '142',  icon: Users,        color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  { label: 'Total Requests', value: '584',  icon: FileCode,     color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'Comments',       value: '2.3k', icon: MessageSquare,color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Completed',      value: '391',  icon: CheckCircle,  color: 'text-green-400',  bg: 'bg-green-500/10' },
  { label: 'Pending',        value: '47',   icon: Clock,        color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { label: 'Avg Response',   value: '3.8h', icon: TrendingUp,   color: 'text-[var(--muted)]', bg: 'bg-[var(--secondary)]' },
]

const mockUsers = [
  { id: '1', name: 'Sarah Chen',   email: 'sarah@dev.io',  role: 'reviewer',  review_count: 47, created_at: '2026-01-12' },
  { id: '2', name: 'Mike Johnson', email: 'mike@dev.io',   role: 'reviewer',  review_count: 32, created_at: '2026-02-03' },
  { id: '3', name: 'Emma Davis',   email: 'emma@dev.io',   role: 'requester', review_count: 0,  created_at: '2026-03-15' },
  { id: '4', name: 'Alex Kumar',   email: 'alex@dev.io',   role: 'admin',     review_count: 58, created_at: '2025-11-20' },
  { id: '5', name: 'Tom Baker',    email: 'tom@dev.io',    role: 'suspended', review_count: 3,  created_at: '2026-04-01' },
]

const mockRequests = [
  { id: '1', title: 'React hooks optimisation', language: 'TypeScript', author_name: 'Emma Davis',   status: 'in-review' as const, comment_count: 3, created_at: '2 hours ago' },
  { id: '2', title: 'Auth middleware',          language: 'JavaScript', author_name: 'Tom Baker',    status: 'completed' as const, comment_count: 7, created_at: '1 day ago' },
  { id: '3', title: 'DB query performance',     language: 'SQL',        author_name: 'Emma Davis',   status: 'pending'   as const, comment_count: 0, created_at: '3 hours ago' },
  { id: '4', title: 'API rate limiting',        language: 'TypeScript', author_name: 'Alex Kumar',   status: 'completed' as const, comment_count: 5, created_at: '2 days ago' },
]

type Tab = 'overview' | 'users' | 'requests'

const roleColors: Record<string, string> = {
  admin:     'text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent)]/10',
  reviewer:  'text-blue-400 border-blue-500/30 bg-blue-500/10',
  requester: 'text-[var(--muted)] border-border bg-[var(--secondary)]',
  suspended: 'text-red-400 border-red-500/30 bg-red-500/10',
}

/* ── Component ───────────────────────────────────────────────────── */
export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [users, setUsers] = useState(mockUsers)

  function toggleSuspend(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, role: u.role === 'suspended' ? 'requester' : 'suspended' }
          : u
      )
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar isAdmin />

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">

          {/* Header */}
          <div className="mb-8 mt-10 lg:mt-0">
            <div className="flex items-center gap-2 mb-1">
              <h1>Admin Dashboard</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono-display bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 rounded uppercase tracking-widest">
                Admin
              </span>
            </div>
            <p className="text-sm text-[var(--muted)]">Platform overview and user management</p>
          </div>

          {/* Tabs */}
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

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {mockStats.map((s) => (
                  <div key={s.label} className="p-4 bg-[var(--surface)] border border-border rounded-md">
                    <div className={cn('w-8 h-8 rounded-md flex items-center justify-center mb-3', s.bg)}>
                      <s.icon className={cn('w-4 h-4', s.color)} />
                    </div>
                    <div className="text-xl font-mono-display font-medium">{s.value}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent users */}
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
                  </div>
                </div>

                {/* Recent requests */}
                <div>
                  <h3 className="text-xs font-mono-display uppercase tracking-widest text-[var(--muted)] mb-3">
                    Recent Requests
                  </h3>
                  <div className="bg-[var(--surface)] border border-border rounded-md divide-y divide-border">
                    {mockRequests.slice(0, 4).map((r) => (
                      <div key={r.id} className="flex items-center gap-3 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{r.title}</p>
                          <p className="text-xs text-[var(--muted)]">{r.author_name} · {r.created_at}</p>
                        </div>
                        <StatusBadge status={r.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {tab === 'users' && (
            <div className="bg-[var(--surface)] border border-border rounded-md overflow-hidden">
              {/* Mobile cards */}
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
                        onClick={() => toggleSuspend(u.id)}
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

              {/* Desktop table */}
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
                      <td className="px-4 py-3 text-xs text-[var(--muted)]">{u.created_at}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="h-7 px-2">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSuspend(u.id)}
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

          {/* ── Requests ── */}
          {tab === 'requests' && (
            <div className="bg-[var(--surface)] border border-border rounded-md overflow-hidden">
              {/* Mobile */}
              <div className="sm:hidden divide-y divide-border">
                {mockRequests.map((r) => (
                  <div key={r.id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-sm">{r.title}</span>
                      <StatusBadge status={r.status} size="sm" />
                    </div>
                    <p className="text-xs text-[var(--muted)]">
                      {r.author_name} · {r.language} · {r.created_at}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
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
                  {mockRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--secondary)]/40 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{r.title}</td>
                      <td className="px-4 py-3 text-sm text-[var(--muted)]">{r.author_name}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 bg-[var(--secondary)] border border-border rounded font-mono-display text-[var(--muted)]">
                          {r.language}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} size="sm" /></td>
                      <td className="px-4 py-3 text-sm font-mono-display text-[var(--muted)]">{r.comment_count}</td>
                      <td className="px-4 py-3 text-xs text-[var(--muted)]">{r.created_at}</td>
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