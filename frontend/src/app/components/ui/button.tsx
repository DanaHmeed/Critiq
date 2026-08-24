import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#f7f8f8] text-[#08090a] hover:bg-[#ffffff] active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.4)]',
        primary:
          'bg-[#5e6ad2] text-white hover:bg-[#6f7de3] active:scale-[0.98] shadow-[0_0_15px_rgba(94,106,210,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-[#5e6ad2]/80',
        accent:
          'bg-[#5e6ad2] text-white hover:bg-[#6f7de3] active:scale-[0.98] shadow-[0_0_15px_rgba(94,106,210,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-[#5e6ad2]/80',
        secondary:
          'bg-white/[0.05] text-[#f7f8f8] hover:bg-white/[0.08] hover:text-white border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] active:scale-[0.98]',
        outline:
          'border border-white/[0.1] bg-transparent text-[#d0d6e0] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.18] active:scale-[0.98]',
        ghost:
          'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-white/[0.05] active:scale-[0.98]',
        destructive:
          'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98]',
        link:
          'text-[#5e6ad2] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-9 px-3.5 py-2 text-xs',
        sm: 'h-7 rounded-md px-2.5 text-[11px]',
        lg: 'h-11 rounded-lg px-6 text-sm font-medium',
        icon: 'h-8 w-8 p-0',
        'icon-sm': 'h-6 w-6 p-0 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }