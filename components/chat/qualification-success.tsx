'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { transitionPresets } from '@/lib/animations'

interface QualificationSuccessProps {
  isVisible: boolean
}

/**
 * QualificationSuccess
 *
 * Brief celebration animation shown when user successfully qualifies.
 * Provides positive feedback before transitioning to email capture or results.
 *
 * Duration: 1.5 seconds (enough to register success, not too long to feel slow)
 */
export function QualificationSuccess({ isVisible }: QualificationSuccessProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          ...transitionPresets.spring,
          delay: 0.1,
        }}
        className="bg-card rounded-2xl p-8 shadow-2xl border border-border max-w-sm mx-4"
      >
        {/* Animated check icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 10,
                delay: 0.4,
              }}
            >
              <Check className="w-10 h-10 text-accent" strokeWidth={3} />
            </motion.div>
          </motion.div>
        </div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, ...transitionPresets.smooth }}
          className="text-center space-y-2"
        >
          <h3 className="font-display font-bold text-2xl">
            Perfect Match Found!
          </h3>
          <p className="text-muted-foreground">
            Analyzing your results...
          </p>
        </motion.div>

        {/* Animated progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-2 mt-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-accent"
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
