import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '../ui/utils'

interface UserAvatarProps {
  name: string
  src?: string
  online?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatar({ name, src, online, size = 'md', className }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
  }

  const dotSize = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  }

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <Avatar className={cn(sizeClasses[size], 'border border-white/[0.1] shadow-sm')}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-[#1c1d27] to-[#12131a] text-[#d0d6e0] font-mono font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {online && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full bg-emerald-400 ring-2 ring-[#08090a]',
            dotSize[size]
          )}
        />
      )}
    </div>
  )
}