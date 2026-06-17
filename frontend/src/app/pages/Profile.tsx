import { useEffect, useState } from 'react'
import { AppSidebar } from '../components/shared/AppSidebar'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Edit2, Save, X } from 'lucide-react'
import { cn } from '../components/ui/utils'
import { useAuth } from '../context/AuthContext'
import { userApi } from '../../api/users'
import { requestApi } from '../../api/requests'
import type { ReviewRequest } from '../../api/types'
import { formatRelativeTime } from '../utils/format'

const dotColor: Record<string, string> = {
  pending: 'bg-yellow-500',
  'in-review': 'bg-blue-500',
  completed: 'bg-green-500',
  rejected: 'bg-red-500',
}

export function Profile() {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({ name: user?.name || '', bio: user?.bio || '' })
  const [isEditing, setIsEditing] = useState(false)
  const [requests, setRequests] = useState<ReviewRequest[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormData({ name: user?.name || '', bio: user?.bio || '' })
  }, [user])

  useEffect(() => {
    let active = true

    requestApi.mine()
      .then(({ requests }) => {
        if (active) setRequests(requests)
      })
      .catch(() => {
        if (active) setRequests([])
      })

    return () => {
      active = false
    }
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const { user: updated } = await userApi.updateMe({ name: formData.name, bio: formData.bio })
      updateUser(updated)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update profile')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setFormData({ name: user?.name || '', bio: user?.bio || '' })
    setIsEditing(false)
  }

  function handleEdit() {
    setFormData({ name: user?.name || '', bio: user?.bio || '' })
    setIsEditing(true)
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1100px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 mt-10 lg:mt-0">
            <h1 className="mb-1">Profile</h1>
            <p className="text-sm text-[var(--muted)]">Manage your account and preferences</p>
          </div>

          {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-[var(--surface)] border border-border rounded-md p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <UserAvatar name={user.name} size="lg" online />
                  <h3 className="mt-4 mb-0.5 text-base font-medium">{user.name}</h3>
                  <p className="text-xs text-[var(--muted)]">{user.email}</p>
                </div>

                {!isEditing ? (
                  <>
                    <p className="text-sm text-[var(--muted)] mb-5 text-center leading-relaxed">
                      {user.bio || 'No bio yet.'}
                    </p>
                    <Button onClick={handleEdit} variant="outline" size="sm" className="w-full">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[var(--muted)] font-mono-display uppercase tracking-widest">
                        Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-[var(--muted)] font-mono-display uppercase tracking-widest">
                        Bio
                      </label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        size="sm"
                        disabled={saving}
                        className="flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} size="sm" variant="outline" className="flex-1">
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-border space-y-4">
                  <div>
                    <p className="text-[10px] text-[var(--muted)] font-mono-display uppercase tracking-widest mb-3">
                      Statistics
                    </p>
                    <div className="space-y-2">
                      {[
                        ['Role', user.role],
                        ['Reviews Given', user.review_count],
                        ['Requests Submitted', requests.length],
                      ].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between text-sm">
                          <span className="text-[var(--muted)]">{label}</span>
                          <span className="font-mono-display font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-[var(--muted)] font-mono-display uppercase tracking-widest mb-3">
                      Languages
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(new Set(requests.map((r) => r.language))).map((lang) => (
                        <LanguageChip key={lang} language={lang} />
                      ))}
                      {requests.length === 0 && <span className="text-xs text-[var(--muted)]">No request languages yet</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[var(--surface)] border border-border rounded-md p-6">
                <h3 className="text-sm font-mono-display uppercase tracking-widest text-[var(--muted)] mb-6">
                  Activity Timeline
                </h3>
                <div className="space-y-0">
                  {requests.slice(0, 8).map((item, idx) => {
                    const isLast = idx === Math.min(requests.length, 8) - 1
                    return (
                      <div key={item.id} className="flex gap-4 relative">
                        {!isLast && (
                          <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />
                        )}
                        <div className={cn(
                          'w-3.5 h-3.5 rounded-full border-2 border-[var(--surface)] mt-1 z-10 shrink-0',
                          dotColor[item.status]
                        )} />
                        <div className="flex-1 pb-6">
                          <p className="text-sm">{item.title}</p>
                          <p className="text-xs text-[var(--muted)] mt-1">
                            {item.status} · {formatRelativeTime(item.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  {requests.length === 0 && (
                    <p className="text-sm text-[var(--muted)]">Request activity will appear here.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
