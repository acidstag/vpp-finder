'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Mail, ArrowRight, Sparkles } from 'lucide-react'
import { transitionPresets } from '@/lib/animations'

interface EmailCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  onSkip: () => void
}

/**
 * EmailCaptureModal
 *
 * Appears after chat qualification to capture email before showing results.
 * Strategy: Offer to email the comparison (value add) while building email list.
 *
 * Expected capture rate: 30-50% (if presented as value, not interruption)
 */
export function EmailCaptureModal({ isOpen, onClose, onSubmit, onSkip }: EmailCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(email)
      // Modal will close after successful submission
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    onSkip()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitionPresets.smooth}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={transitionPresets.smooth}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 relative">
                {/* Close button */}
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Success icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-accent" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4 mb-8">
                  <h2 className="font-display font-bold text-2xl">
                    Perfect! I've Found Your Matches
                  </h2>
                  <p className="text-muted-foreground">
                    Want me to email you the full comparison? You'll get a detailed breakdown of all programs, earnings estimates, and next steps.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setError('')
                        }}
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                        className="w-full pl-11 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-all"
                        autoFocus
                      />
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full font-display font-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Email Me Results
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      className="w-full"
                      onClick={handleSkip}
                      disabled={isSubmitting}
                    >
                      Skip, Show Me Now
                    </Button>
                  </div>
                </form>

                {/* Trust signal */}
                <p className="text-xs text-center text-muted-foreground mt-6">
                  We respect your privacy. No spam, unsubscribe anytime.
                </p>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
