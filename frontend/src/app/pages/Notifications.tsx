import { useEffect, useState } from 'react'
import { AppSidebar } from '../components/shared/AppSidebar'
import { UserAvatar } from '../components/shared/Useravatar'
import { Button } from '../components/ui/button'
import { CheckCheck } from 'lucide-react'
import { cn } from '../components/ui/utils'
import { notificationApi } from '../../api/notifications'
import type { Notification } from '../../api/types'
import { formatRelativeTime } from '../utils/format'

function notificationTitle(type: string) {
  return type
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function NotificationItem({ n }: { n: Notification }) {
  return (
    <div className={cn('flex gap-3 p-4 transition-colors', !n.is_read ? 'bg-[var(--accent)]/5' : '')}>
      <UserAvatar name={notificationTitle(n.type)} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-medium">{notificationTitle(n.type)}</span>{' '}
          <span className="text-[var(--muted)]">{n.message}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[var(--muted)]">{formatRelativeTime(n.created_at)}</span>
          {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
        </div>
      </div>
    </div>
  )
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    notificationApi.list()
      .then(({ notifications }) => {
        if (active) setNotifications(notifications)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load notifications')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function markAllRead() {
    setError('')
    try {
      await notificationApi.markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to mark notifications read')
    }
  }

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
            <Button variant="outline" size="sm" onClick={markAllRead} disabled={notifications.length === 0}>
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          </div>

          {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

          <div className="bg-[var(--surface)] border border-border rounded-md divide-y divide-border">
            {loading && <div className="p-4 text-sm text-[var(--muted)]">Loading notifications...</div>}
            {!loading && notifications.length === 0 && (
              <div className="p-4 text-sm text-[var(--muted)]">No notifications yet.</div>
            )}
            {notifications.map((n) => (
              <NotificationItem key={n.id} n={n} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
