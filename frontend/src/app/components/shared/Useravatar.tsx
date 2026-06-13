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
    .slice(0, 2)

  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-12 w-12 text-base',
  }

  const dotSize = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  }

  return (
    <div className={cn('relative inline-block shrink-0', className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="bg-[var(--secondary)] text-[var(--foreground)] font-mono-display font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {online && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full bg-green-500 border-2 border-[var(--surface)]',
            dotSize[size]
          )}
        />
      )}
    </div>
  )
}