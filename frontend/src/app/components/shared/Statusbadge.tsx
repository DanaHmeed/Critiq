import { cn } from '../ui/utils'

type Status = 'pending' | 'in-review' | 'completed' | 'rejected' | 'active' | 'suspended'

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md'
  showDot?: boolean
}

export function StatusBadge({ status, size = 'md', showDot = true }: StatusBadgeProps) {
  const config: Record<Status, { label: string; text: string; bg: string; border: string; dot: string }> = {
    pending: {
      label: 'Pending',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      dot: 'bg-amber-400',
    },
    'in-review': {
      label: 'In Review',
      text: 'text-[#8b95ea]',
      bg: 'bg-[#5e6ad2]/15',
      border: 'border-[#5e6ad2]/30',
      dot: 'bg-[#5e6ad2]',
    },
    completed: {
      label: 'Completed',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    rejected: {
      label: 'Rejected',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      dot: 'bg-rose-400',
    },
    active: {
      label: 'Active',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-400',
    },
    suspended: {
      label: 'Suspended',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      dot: 'bg-rose-400',
    },
  }

  const s = config[status] || config.pending
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-mono tracking-tight font-medium select-none',
        s.bg,
        s.border,
        s.text,
        sizeClasses
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', s.dot)} />}
      <span>{s.label}</span>
    </span>
  )
}