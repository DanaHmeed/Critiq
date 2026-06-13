import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-14 h-14 rounded-md bg-[var(--secondary)] flex items-center justify-center mb-4 border border-border">
        <Icon className="w-6 h-6 text-[var(--muted)]" />
      </div>
      <h3 className="mb-2 text-base font-medium text-foreground">{title}</h3>
      <p className="text-sm text-[var(--muted)] mb-6 max-w-sm leading-relaxed">{description}</p>
      {action}
    </div>
  )
}