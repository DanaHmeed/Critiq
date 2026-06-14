import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Code, Eye } from 'lucide-react'
import { cn } from '../components/ui/utils'

export function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('user', JSON.stringify(formData))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-mono-display mb-2">Critiq</h1>
          </Link>
          <p className="text-sm text-[var(--muted)]">Create your account</p>
        </div>

        <div className="bg-[var(--surface)] border border-border rounded-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>I want to</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'requester' })}
                  className={cn(
                    'p-4 border rounded-md text-left transition-all',
                    formData.role === 'requester'
                      ? 'border-[var(--accent)] bg-[var(--accent)]/8'
                      : 'border-border hover:border-[var(--accent)]/40 bg-transparent'
                  )}
                >
                  <Code className="w-5 h-5 mb-2 text-[var(--accent)]" />
                  <div className="text-sm font-medium text-foreground">Request Reviews</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">Submit code for feedback</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'reviewer' })}
                  className={cn(
                    'p-4 border rounded-md text-left transition-all',
                    formData.role === 'reviewer'
                      ? 'border-[var(--accent)] bg-[var(--accent)]/8'
                      : 'border-border hover:border-[var(--accent)]/40 bg-transparent'
                  )}
                >
                  <Eye className="w-5 h-5 mb-2 text-[var(--accent)]" />
                  <div className="text-sm font-medium text-foreground">Review Code</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">Provide expert feedback</div>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!formData.role}
              className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0 disabled:opacity-40"
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}