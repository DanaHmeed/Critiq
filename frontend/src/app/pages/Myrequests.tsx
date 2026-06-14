import { useState } from 'react'
import { Link } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { StatusBadge } from '../components/shared/Statusbadge'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { EmptyState } from '../components/shared/Emptystate'
import { Button } from '../components/ui/button'
import { FileCode, Plus, MessageSquare } from 'lucide-react'
import { cn } from '../components/ui/utils'

const mockRequests = [
  { id: 1, title: 'React hooks optimization', language: 'typescript', reviewer: { name: 'Sarah Chen', avatar: '' }, status: 'in-review' as const, date: '2 hours ago', comments: 3 },
  { id: 2, title: 'Authentication middleware', language: 'javascript', reviewer: { name: 'Mike Johnson', avatar: '' }, status: 'completed' as const, date: '1 day ago', comments: 7 },
  { id: 3, title: 'Database query performance', language: 'sql', reviewer: null, status: 'pending' as const, date: '3 hours ago', comments: 0 },
  { id: 4, title: 'API endpoint validation', language: 'typescript', reviewer: { name: 'Emma Davis', avatar: '' }, status: 'completed' as const, date: '2 days ago', comments: 5 },
  { id: 5, title: 'State management refactor', language: 'typescript', reviewer: null, status: 'pending' as const, date: '5 hours ago', comments: 0 },
]

type FilterType = 'all' | 'pending' | 'in-review' | 'completed'

export function MyRequests() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = mockRequests.filter((r) => filter === 'all' || r.status === filter)

  const filterLabels: Record<FilterType, string> = {
    all: 'All',
    pending: 'Pending',
    'in-review': 'In Review',
    completed: 'Completed',
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1100px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 mt-10 lg:mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="mb-1">My Requests</h1>
              <p className="text-sm text-[var(--muted)]">Track your code review submissions</p>
            </div>
            <Link to="/create-request">
              <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0 shrink-0">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
            {(['all', 'pending', 'in-review', 'completed'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 text-xs font-mono-display rounded-md whitespace-nowrap transition-colors shrink-0',
                  filter === f
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--surface)] border border-border text-[var(--muted)] hover:text-foreground hover:bg-[var(--secondary)]'
                )}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={FileCode}
              title="No requests yet"
              description="Submit your first code snippet to get started with peer reviews."
              action={
                <Link to="/create-request">
                  <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0">
                    Create Request
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="bg-[var(--surface)] border border-border rounded-md overflow-hidden">
              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-border">
                {filtered.map((req) => (
                  <Link
                    key={req.id}
                    to={`/review/${req.id}`}
                    className="block p-4 hover:bg-[var(--secondary)]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-medium text-sm">{req.title}</span>
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      <LanguageChip language={req.language} />
                      {req.reviewer && <UserAvatar name={req.reviewer.name} size="sm" />}
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
                    <th className="text-left px-4 py-3 text-[var(--muted)]">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((req) => (
                    <tr key={req.id} className="hover:bg-[var(--secondary)]/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <Link to={`/review/${req.id}`} className="hover:text-[var(--accent)] font-medium text-sm transition-colors">
                          {req.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5"><LanguageChip language={req.language} /></td>
                      <td className="px-4 py-3.5">
                        {req.reviewer ? (
                          <div className="flex items-center gap-2">
                            <UserAvatar name={req.reviewer.name} size="sm" />
                            <span className="text-xs text-[var(--muted)]">{req.reviewer.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={req.status} size="sm" /></td>
                      <td className="px-4 py-3.5 text-xs text-[var(--muted)]">{req.date}</td>
                      <td className="px-4 py-3.5">
                        {req.comments > 0 ? (
                          <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {req.comments}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">—</span>
                        )}
                      </td>
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