import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import {
  LayoutDashboard,
  FileCode,
  Bell,
  User,
  Settings,
  Shield,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react'
import { useTheme } from "../../hooks/useTheme"
import { cn } from '../ui/utils'

interface SidebarLinkProps {
  to: string
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function SidebarLink({ to, icon, label, active, onClick }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
        active
          ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-medium'
          : 'text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

interface AppSidebarProps {
  isAdmin?: boolean
}

export function AppSidebar({ isAdmin = false }: AppSidebarProps) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = (
    <>
      <SidebarLink
        to="/dashboard"
        icon={<LayoutDashboard className="w-4 h-4" />}
        label="Dashboard"
        active={location.pathname === '/dashboard'}
        onClick={() => setMobileOpen(false)}
      />
      <SidebarLink
        to="/my-requests"
        icon={<FileCode className="w-4 h-4" />}
        label="My Requests"
        active={location.pathname === '/my-requests'}
        onClick={() => setMobileOpen(false)}
      />
      <SidebarLink
        to="/notifications"
        icon={<Bell className="w-4 h-4" />}
        label="Notifications"
        active={location.pathname === '/notifications'}
        onClick={() => setMobileOpen(false)}
      />
      <SidebarLink
        to="/profile"
        icon={<User className="w-4 h-4" />}
        label="Profile"
        active={location.pathname === '/profile'}
        onClick={() => setMobileOpen(false)}
      />
      {isAdmin && (
        <>
          <div className="pt-4 pb-1 px-3">
            <span className="text-[10px] text-[var(--muted)] font-mono-display uppercase tracking-widest">
              Admin
            </span>
          </div>
          <SidebarLink
            to="/admin"
            icon={<Shield className="w-4 h-4" />}
            label="Admin"
            active={location.pathname === '/admin'}
            onClick={() => setMobileOpen(false)}
          />
        </>
      )}
    </>
  )

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--sidebar-border)]">
        <h1 className="text-xl font-mono-display text-[var(--sidebar-foreground)] tracking-tight">
          Critiq
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">{links}</nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--sidebar-border)] space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--sidebar-foreground)]/70 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <SidebarLink
          to="/settings"
          icon={<Settings className="w-4 h-4" />}
          label="Settings"
          active={location.pathname === '/settings'}
          onClick={() => setMobileOpen(false)}
        />
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[var(--surface)] border border-border text-foreground shadow-lg"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 h-full z-50 w-64 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] sidebar-transition',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)]/70"
        >
          <X className="w-4 h-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 h-screen bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex-col sticky top-0">
        {sidebarContent}
      </aside>
    </>
  )
}