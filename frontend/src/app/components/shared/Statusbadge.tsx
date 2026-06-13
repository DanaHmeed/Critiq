import { cn } from '../ui/utils'

type Status = 'pending' | 'in-review' | 'completed' | 'rejected' | 'active' | 'suspended'

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles: Record<Status, string> = {
    pending:
      'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    'in-review':
      'bg-blue-500/15 text-blue-400 border-blue-500/30',
    completed:
      'bg-green-500/15 text-green-400 border-green-500/30',
    rejected:
      'bg-red-500/15 text-red-400 border-red-500/30',
    active:
      'bg-green-500/15 text-green-400 border-green-500/30',
    suspended:
      'bg-red-500/15 text-red-400 border-red-500/30',
  }

  const labels: Record<Status, string> = {
    pending: 'Pending',
    'in-review': 'In Review',
    completed: 'Completed',
    rejected: 'Rejected',
    active: 'Active',
    suspended: 'Suspended',
  }

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border font-mono-display',
        styles[status],
        sizeClasses
      )}
    >
      {labels[status]}
    </span>
  )
}