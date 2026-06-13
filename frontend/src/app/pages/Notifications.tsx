import { AppSidebar } from '../components/shared/AppSidebar'
import { UserAvatar } from '../components/shared/Useravatar'
import { Button } from '../components/ui/button'
import { CheckCheck } from 'lucide-react'
import { cn } from '../components/ui/utils'

const groups = {
  Today: [
    { id: 1, user: 'Sarah Chen', action: 'commented on', target: 'React hooks optimization', time: '10 min ago', unread: true },
    { id: 2, user: 'Mike Johnson', action: 'completed review of', target: 'Authentication middleware', time: '1 hour ago', unread: true },
    { id: 3, user: 'Emma Davis', action: 'accepted your review request', target: 'Database query performance', time: '2 hours ago', unread: false },
  ],
  'This Week': [
    { id: 4, user: 'Alex Kumar', action: 'mentioned you in', target: 'API endpoint validation', time: '2 days ago', unread: false },
    { id: 5, user: 'Sarah Chen', action: 'started reviewing', target: 'State management refactor', time: '3 days ago', unread: false },
  ],
  Earlier: [
    { id: 6, user: 'Mike Johnson', action: 'left 5 comments on', target: 'Error handling improvements', time: '1 week ago', unread: false },
    { id: 7, user: 'Emma Davis', action: 'marked as complete', target: 'TypeScript migration', time: '2 weeks ago', unread: false },
  ],
}

type Notification = typeof groups.Today[0]

function NotificationItem({ n }: { n: Notification }) {
  return (
    <div className={cn('flex gap-3 p-4 transition-colors', n.unread ? 'bg-[var(--accent)]/5' : '')}>
      <UserAvatar name={n.user} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-medium">{n.user}</span>{' '}
          <span className="text-[var(--muted)]">{n.action}</span>{' '}
          <span className="font-medium">{n.target}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[var(--muted)]">{n.time}</span>
          {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
        </div>
      </div>
    </div>
  )
}

export function Notifications() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 mt-10 lg:mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="mb-1">Notifications</h1>
              <p className="text-sm text-[var(--muted)]">Stay updated on your code reviews</p>
            </div>
            <Button variant="outline" size="sm">
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          </div>

          <div className="space-y-8">
            {Object.entries(groups).map(([group, notifications]) => (
              <div key={group}>
                <h3 className="text-[10px] font-mono-display uppercase tracking-widest text-[var(--muted)] mb-3 px-1">
                  {group}
                </h3>
                <div className="bg-[var(--surface)] border border-border rounded-md divide-y divide-border">
                  {notifications.map((n) => (
                    <NotificationItem key={n.id} n={n} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}