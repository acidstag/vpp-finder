'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface ConversationProgressProps {
  currentStep: number
}

const STEPS = [
  { id: 1, label: 'Battery', short: 'Battery' },
  { id: 2, label: 'Location', short: 'Location' },
  { id: 3, label: 'Solar', short: 'Solar' },
  { id: 4, label: 'Preferences', short: 'Prefs' },
  { id: 5, label: 'Results', short: 'Results' },
]

/**
 * Conversation Progress Indicator
 *
 * Shows where the user is in the qualification flow
 * Provides context and reduces uncertainty
 */
export function ConversationProgress({ currentStep }: ConversationProgressProps) {
  return (
    <div className="mb-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isComplete = step.id < currentStep
            const isCurrent = step.id === currentStep
            const isUpcoming = step.id > currentStep

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isComplete
                        ? 'rgb(var(--accent))'
                        : isCurrent
                        ? 'rgb(var(--accent))'
                        : 'transparent',
                    }}
                    transition={{ duration: 0.3 }}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      border-2 transition-colors
                      ${
                        isComplete || isCurrent
                          ? 'border-accent text-accent-foreground'
                          : 'border-muted-foreground/30 text-muted-foreground'
                      }
                      ${isComplete ? 'bg-accent' : ''}
                      ${isCurrent ? 'bg-accent shadow-lg' : ''}
                    `}
                  >
                    {isComplete ? (
                      <Check className="w-4 h-4 text-background" />
                    ) : (
                      <span className="text-xs font-bold">{step.id}</span>
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <span
                    className={`
                      mt-2 text-xs font-medium text-center
                      ${isCurrent ? 'text-accent' : 'text-muted-foreground'}
                      hidden sm:block
                    `}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`
                      mt-2 text-xs font-medium text-center
                      ${isCurrent ? 'text-accent' : 'text-muted-foreground'}
                      sm:hidden
                    `}
                  >
                    {step.short}
                  </span>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isComplete
                        ? 'rgb(var(--accent))'
                        : 'rgb(var(--muted-foreground) / 0.2)',
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-0.5 flex-1 mx-2"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
