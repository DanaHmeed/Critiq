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
    <div className="flex items-center gap-0">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="flex items-center">
            <div className="flex items-center gap-2">
              {/* Circle */}
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono-display border transition-all',
                  isCompleted
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : isActive
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-transparent'
                    : 'border-border text-[var(--muted)] bg-transparent'
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>
              {/* Label */}
              <span
                className={cn(
                  'text-sm font-mono-display transition-colors',
                  isActive
                    ? 'text-foreground'
                    : isCompleted
                    ? 'text-[var(--muted)]'
                    : 'text-[var(--muted)]/50'
                )}
              >
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {!isLast && (
              <div
                className={cn(
                  'h-px w-12 mx-3 transition-colors',
                  isCompleted ? 'bg-[var(--accent)]' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}