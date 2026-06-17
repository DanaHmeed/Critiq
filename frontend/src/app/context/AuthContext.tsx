// frontend/src/app/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi } from '../../api/auth'
import type { User } from '../../api/types'

/* ── Types ───────────────────────────────────────────────────────── */
export type AuthUser = User

interface AuthContextValue {
  user:    AuthUser | null
  token:   string | null
  loading: boolean
  login:   (email: string, password: string) => Promise<void>
  register:(name: string, email: string, password: string, role: string) => Promise<void>
  logout:  () => void
  updateUser: (updates: Partial<AuthUser>) => void
}

/* ── Context ─────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | null>(null)

/* ── Provider ────────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [token,   setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('critiq-token')
    const savedUser  = localStorage.getItem('critiq-user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('critiq-token')
        localStorage.removeItem('critiq-user')
      }
    }
    setLoading(false)
  }, [])

  function persist(token: string, user: AuthUser) {
    localStorage.setItem('critiq-token', token)
    localStorage.setItem('critiq-user',  JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  async function login(email: string, password: string) {
    const { token, user } = await authApi.login({ email, password })
    persist(token, user)
  }

  async function register(name: string, email: string, password: string, role: string) {
    const { token, user } = await authApi.register({ name, email, password, role })
    persist(token, user)
  }

  function logout() {
    localStorage.removeItem('critiq-token')
    localStorage.removeItem('critiq-user')
    setToken(null)
    setUser(null)
    window.location.href = '/login'
  }

  // Call this after a profile update so the UI reflects new name/bio instantly
  function updateUser(updates: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      localStorage.setItem('critiq-user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ── Hook ────────────────────────────────────────────────────────── */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
