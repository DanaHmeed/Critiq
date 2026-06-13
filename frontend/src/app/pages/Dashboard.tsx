import { Link } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import { Clock, FileCode, CheckCircle, TrendingUp, Plus, MessageSquare } from 'lucide-react'

const mockRequests = [
  {
    id: 1,
    title: 'React hooks optimization',
    language: 'typescript',
    reviewer: { name: 'Sarah Chen', avatar: '' },
    status: 'in-review' as const,
    date: '2 hours ago',
    comments: 3,
  },
  {
    id: 2,
    title: 'Authentication middleware',
    language: 'javascript',
    reviewer: { name: 'Mike Johnson', avatar: '' },
    status: 'completed' as const,
    date: '1 day ago',
    comments: 7,
  },
  {
    id: 3,
    title: 'Database query performance',
    language: 'sql',
    reviewer: null,
    status: 'pending' as const,
    date: '3 hours ago',
    comments: 0,
  },
]

const mockActivity = [
  { user: 'Sarah Chen', text: 'commented on line 42', time: '10 min ago' },
  { user: 'Mike Johnson', text: 'completed review', time: '1 hour ago' },
  { user: 'You', text: 'submitted new request', time: '3 hours ago' },
]

const stats = [
  { label: 'Open', value: '3', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'In Review', value: '1', icon: FileCode, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Avg Response', value: '4.2h', icon: TrendingUp, color: 'text-[var(--muted)]', bg: 'bg-[var(--secondary)]' },
]

export function Dashboard() {
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
                {/* Mobile card view */}
                <div className="sm:hidden divide-y divide-border">
                  {mockRequests.map((req) => (
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
                        <span>{req.date}</span>
                        {req.comments > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {req.comments}
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
                    {mockRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[var(--secondary)]/50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            to={`/review/${req.id}`}
                            className="flex items-center gap-2 hover:text-[var(--accent)] text-sm transition-colors"
                          >
                            <span>{req.title}</span>
                            {req.comments > 0 && (
                              <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                                <MessageSquare className="w-3 h-3" />
                                {req.comments}
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <LanguageChip language={req.language} />
                        </td>
                        <td className="px-4 py-3">
                          {req.reviewer ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar name={req.reviewer.name} size="sm" />
                              <span className="text-xs text-[var(--muted)]">{req.reviewer.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--muted)]">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={req.status} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted)]">{req.date}</td>
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
                {mockActivity.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <UserAvatar name={item.user} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{item.user}</span>{' '}
                        <span className="text-[var(--muted)]">{item.text}</span>
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}