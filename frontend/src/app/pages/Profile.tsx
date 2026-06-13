import { useState } from 'react'
import { AppSidebar } from '../components/shared/AppSidebar'
import { UserAvatar } from '../components/shared/Useravatar'
import { LanguageChip } from '../components/shared/Languagechip'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Edit2, Save, X } from 'lucide-react'
import { cn } from '../components/ui/utils'

const mockProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  bio: 'Senior Frontend Developer specialising in React and TypeScript. Passionate about clean code and best practices.',
  stats: { reviewsGiven: 23, reviewsReceived: 47, avgTime: '3.5h' },
  languages: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Python'],
}

const mockActivity = [
  { type: 'review', text: 'Completed review: React hooks optimization', time: '2 hours ago' },
  { type: 'comment', text: 'Commented on: Database query performance', time: '5 hours ago' },
  { type: 'request', text: 'Submitted: Authentication middleware', time: '1 day ago' },
  { type: 'review', text: 'Completed review: API endpoint validation', time: '2 days ago' },
  { type: 'request', text: 'Submitted: State management refactor', time: '3 days ago' },
]

const dotColor = { review: 'bg-green-500', comment: 'bg-blue-500', request: 'bg-yellow-500' }

export function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: mockProfile.name, bio: mockProfile.bio })

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1100px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 mt-10 lg:mt-0">
            <h1 className="mb-1">Profile</h1>
            <p className="text-sm text-[var(--muted)]">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--surface)] border border-border rounded-md p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <UserAvatar name={mockProfile.name} size="lg" online />
                  <h3 className="mt-4 mb-0.5 text-base font-medium">{mockProfile.name}</h3>
                  <p className="text-xs text-[var(--muted)]">{mockProfile.email}</p>
                </div>

                {!isEditing ? (
                  <>
                    <p className="text-sm text-[var(--muted)] mb-5 text-center leading-relaxed">
                      {mockProfile.bio}
                    </p>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
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
                        onClick={() => setIsEditing(false)}
                        size="sm"
                        className="flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-6 pt-5 border-t border-border space-y-4">
                  <div>
                    <p className="text-[10px] text-[var(--muted)] font-mono-display uppercase tracking-widest mb-3">
                      Statistics
                    </p>
                    <div className="space-y-2">
                      {[
                        ['Reviews Given', mockProfile.stats.reviewsGiven],
                        ['Reviews Received', mockProfile.stats.reviewsReceived],
                        ['Avg Response', mockProfile.stats.avgTime],
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
                      {mockProfile.languages.map((lang) => (
                        <LanguageChip key={lang} language={lang} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity timeline */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--surface)] border border-border rounded-md p-6">
                <h3 className="text-sm font-mono-display uppercase tracking-widest text-[var(--muted)] mb-6">
                  Activity Timeline
                </h3>
                <div className="space-y-0">
                  {mockActivity.map((item, idx) => {
                    const type = item.type as keyof typeof dotColor
                    const isLast = idx === mockActivity.length - 1
                    return (
                      <div key={idx} className="flex gap-4 relative">
                        {!isLast && (
                          <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />
                        )}
                        <div
                          className={cn(
                            'w-3.5 h-3.5 rounded-full border-2 border-[var(--surface)] mt-1 z-10 shrink-0',
                            dotColor[type]
                          )}
                        />
                        <div className="flex-1 pb-6">
                          <p className="text-sm">{item.text}</p>
                          <p className="text-xs text-[var(--muted)] mt-1">{item.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}