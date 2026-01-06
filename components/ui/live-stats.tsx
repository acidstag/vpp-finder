'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { transitionPresets } from '@/lib/animations'

interface LiveStatsProps {
  /**
   * Which stat to display
   */
  stat: 'users' | 'conversations' | 'clicks'

  /**
   * Label to show below the number
   */
  label?: string

  /**
   * Minimum number to show (for social proof when starting)
   * Default: 0
   */
  minimum?: number

  /**
   * CSS class name
   */
  className?: string
}

interface Stats {
  totalSessions: number
  completedConversations: number
  programClicks: number
  emailsCollected: number
}

/**
 * LiveStats Component
 *
 * ULTRATHINK Principle: Make the numbers real.
 *
 * Shows live statistics from the database for social proof.
 * Falls back gracefully if database is empty or API fails.
 *
 * Usage:
 * ```tsx
 * <LiveStats
 *   stat="users"
 *   label="Australians helped find their VPP"
 *   minimum={1200}
 * />
 * ```
 */
export function LiveStats({ stat, label, minimum = 0, className = '' }: LiveStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getValue = (): number => {
    if (!stats) return minimum

    const value = {
      users: stats.completedConversations || stats.totalSessions,
      conversations: stats.completedConversations,
      clicks: stats.programClicks,
    }[stat]

    // Use the larger of actual value or minimum (for social proof)
    return Math.max(value, minimum)
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-AU')
  }

  const displayValue = getValue()

  return (
    <div className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transitionPresets.spring}
        className="relative"
      >
        <span className="text-4xl sm:text-5xl md:text-6xl font-mono font-black text-accent">
          {isLoading ? (
            <span className="inline-block animate-pulse">—</span>
          ) : (
            formatNumber(displayValue)
          )}
        </span>

        {!isLoading && displayValue > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, ...transitionPresets.smooth }}
            className="absolute -top-1 -right-2 text-accent text-2xl"
          >
            +
          </motion.span>
        )}
      </motion.div>

      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ...transitionPresets.smooth }}
          className="mt-3 text-sm sm:text-base text-muted-foreground font-medium"
        >
          {label}
        </motion.p>
      )}
    </div>
  )
}
