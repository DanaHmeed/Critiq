import { Check } from 'lucide-react'
import { cn } from '../ui/utils'

interface Step {
  label: string
  completed: boolean
}

interface StepTrackerProps {
  steps: Step[]
  currentStep: number
}

export function StepTracker({ steps, currentStep }: StepTrackerProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all select-none',
                isActive
                  ? 'bg-white/[0.08] border-[#5e6ad2] text-white shadow-[0_0_12px_rgba(94,106,210,0.25)]'
                  : isCompleted
                  ? 'bg-white/[0.04] border-white/[0.08] text-[#8a8f98]'
                  : 'bg-transparent border-transparent text-[#525660]'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border transition-all',
                  isCompleted
                    ? 'bg-[#5e6ad2] border-[#5e6ad2] text-white'
                    : isActive
                    ? 'border-[#5e6ad2] text-[#8b95ea] bg-[#5e6ad2]/10'
                    : 'border-white/[0.1] text-[#525660]'
                )}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
              </div>
              <span className="text-xs font-medium tracking-tight font-mono">
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  'h-px w-6 sm:w-10 mx-1.5 transition-colors',
                  isCompleted ? 'bg-[#5e6ad2]' : 'bg-white/[0.08]'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}