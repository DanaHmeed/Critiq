import * as React from 'react'
import { cn } from './utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-white/[0.08] bg-[#0b0c10] px-3 py-2 text-xs text-[#f7f8f8]',
          'placeholder:text-[#525660]',
          'shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]',
          'focus-visible:outline-none focus-visible:border-[#5e6ad2] focus-visible:ring-2 focus-visible:ring-[#5e6ad2]/20',
          'disabled:cursor-not-allowed disabled:opacity-40',
          'transition-all duration-150',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }