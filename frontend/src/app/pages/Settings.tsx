// frontend/src/app/pages/Settings.tsx
import { useState } from 'react'
import { AppSidebar } from '../components/shared/AppSidebar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Separator } from '../components/ui/separator'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon, Bell, Shield, Trash2, Save } from 'lucide-react'
import { cn } from '../components/ui/utils'

type Section = 'appearance' | 'notifications' | 'account' | 'danger'

const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'appearance',    label: 'Appearance',    icon: <Sun className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'account',       label: 'Account',       icon: <Shield className="w-4 h-4" /> },
  { id: 'danger',        label: 'Danger Zone',   icon: <Trash2 className="w-4 h-4" /> },
]

export function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [active, setActive]   = useState<Section>('appearance')

  const [notifs, setNotifs] = useState({
    newComment:       true,
    reviewAssigned:   true,
    reviewCompleted:  true,
    marketing:        false,
  })

  const [account, setAccount] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })

  const isDark = theme === 'dark'

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 mt-10 lg:mt-0">
            <h1 className="mb-1">Settings</h1>
            <p className="text-sm text-[var(--muted)]">Manage your preferences and account</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* ── Sidebar nav ── */}
            <nav className="sm:w-48 shrink-0">
              <div className="bg-[var(--surface)] border border-border rounded-md overflow-hidden">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-border last:border-0 transition-colors',
                      active === s.id
                        ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                        : 'text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-foreground'
                    )}
                  >
                    {s.icon}
                    {s.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* ── Content panel ── */}
            <div className="flex-1 bg-[var(--surface)] border border-border rounded-md p-6">

              {/* Appearance */}
              {active === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-1">Appearance</h3>
                    <p className="text-sm text-[var(--muted)]">Choose how Critiq looks for you</p>
                  </div>
                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-xs font-mono-display uppercase tracking-widest text-[var(--muted)]">
                      Theme
                    </Label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Dark card */}
                      <button
                        onClick={() => !isDark && toggleTheme()}
                        className={cn(
                          'p-4 rounded-md border text-left transition-all',
                          isDark
                            ? 'border-[var(--accent)] bg-[var(--accent)]/8'
                            : 'border-border hover:border-[var(--accent)]/40'
                        )}
                      >
                        <div className="w-full h-16 rounded bg-[#141412] border border-[#2E2D29] mb-3 flex items-center justify-center">
                          <Moon className="w-5 h-5 text-[#8A8880]" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Dark</span>
                          {isDark && (
                            <div className="w-4 h-4 rounded-full bg-[var(--accent)] flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-0.5">Default — easy on the eyes</p>
                      </button>

                      {/* Light card */}
                      <button
                        onClick={() => isDark && toggleTheme()}
                        className={cn(
                          'p-4 rounded-md border text-left transition-all',
                          !isDark
                            ? 'border-[var(--accent)] bg-[var(--accent)]/8'
                            : 'border-border hover:border-[var(--accent)]/40'
                        )}
                      >
                        <div className="w-full h-16 rounded bg-[#F7F6F3] border border-[#E2E0DB] mb-3 flex items-center justify-center">
                          <Sun className="w-5 h-5 text-[#D97B4F]" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Light</span>
                          {!isDark && (
                            <div className="w-4 h-4 rounded-full bg-[var(--accent)] flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-0.5">Clean, high contrast</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {active === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-1">Notifications</h3>
                    <p className="text-sm text-[var(--muted)]">Choose what you want to be notified about</p>
                  </div>
                  <Separator />

                  <div className="space-y-5">
                    {[
                      { key: 'newComment',      label: 'New comments',        desc: 'When someone comments on your code' },
                      { key: 'reviewAssigned',  label: 'Review assigned',     desc: 'When you are assigned a review request' },
                      { key: 'reviewCompleted', label: 'Review completed',    desc: 'When your review request is marked complete' },
                      { key: 'marketing',       label: 'Product updates',     desc: 'News and announcements from Critiq' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-[var(--muted)] mt-0.5">{desc}</p>
                        </div>
                        <Switch
                          checked={notifs[key as keyof typeof notifs]}
                          onCheckedChange={(val) => setNotifs({ ...notifs, [key]: val })}
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />
                  <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0">
                    <Save className="w-4 h-4" />
                    Save preferences
                  </Button>
                </div>
              )}

              {/* Account / Password */}
              {active === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-1">Account Security</h3>
                    <p className="text-sm text-[var(--muted)]">Update your password</p>
                  </div>
                  <Separator />

                  <div className="space-y-4 max-w-sm">
                    <div className="space-y-1.5">
                      <Label htmlFor="current-pw">Current password</Label>
                      <Input
                        id="current-pw"
                        type="password"
                        placeholder="••••••••"
                        value={account.currentPassword}
                        onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="new-pw">New password</Label>
                      <Input
                        id="new-pw"
                        type="password"
                        placeholder="••••••••"
                        value={account.newPassword}
                        onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm-pw">Confirm new password</Label>
                      <Input
                        id="confirm-pw"
                        type="password"
                        placeholder="••••••••"
                        value={account.confirmPassword}
                        onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                      />
                    </div>
                    <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0 w-full">
                      <Save className="w-4 h-4" />
                      Update password
                    </Button>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              {active === 'danger' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-1 text-red-400">Danger Zone</h3>
                    <p className="text-sm text-[var(--muted)]">Irreversible actions — proceed with caution</p>
                  </div>
                  <Separator />

                  <div className="space-y-4">
                    <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-red-400">Delete account</p>
                          <p className="text-xs text-[var(--muted)] mt-0.5">
                            Permanently delete your account and all associated data. This cannot be undone.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete account
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-yellow-400">Export data</p>
                          <p className="text-xs text-[var(--muted)] mt-0.5">
                            Download a copy of all your requests, comments, and profile data.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0">
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}