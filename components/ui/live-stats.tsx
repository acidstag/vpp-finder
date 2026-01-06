'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { transitionPresets } from '@/lib/animations'

interface LiveStatsProps {
  /**
   * Base number to start from
   */
  baseCount?: number

  /**
   * Label to show below the number
   */
  label?: string

  /**
   * How often to increment (in ms). Lower = faster growth
   * Default: 45000 (45 seconds)
   */
  incrementInterval?: number

  /**
   * CSS class name
   */
  className?: string
}

/**
 * LiveStats Component - Synthetic Social Proof Counter
 *
 * Shows a gradually increasing counter for social proof.
 * The counter persists in localStorage so it doesn't reset on page refresh.
 *
 * The number increases at a realistic pace:
 * - Base: 1,247 (a believable starting point)
 * - Increments by 1 every ~45 seconds while page is open
 * - Persists across sessions via localStorage
 *
 * Usage:
 * ```tsx
 * <LiveStats
 *   baseCount={1247}
 *   label="Australians helped find their VPP"
 * />
 * ```
 */
export function LiveStats({
  baseCount = 1247,
  label,
  incrementInterval = 45000,
  className = ''
}: LiveStatsProps) {
  const [count, setCount] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize count from localStorage or calculate based on time
  useEffect(() => {
    const storageKey = 'vpp_user_count'
    const startDateKey = 'vpp_start_date'

    // Get or set the start date (when the counter began)
    let startDate = localStorage.getItem(startDateKey)
    if (!startDate) {
      // Set start date to a past date for realistic growth
      // This means the site "launched" ~30 days ago
      const launchDate = new Date()
      launchDate.setDate(launchDate.getDate() - 30)
      startDate = launchDate.toISOString()
      localStorage.setItem(startDateKey, startDate)
    }

    // Calculate how many "users" should have accumulated since launch
    // Assuming ~40 users per day on average
    const daysSinceLaunch = Math.floor(
      (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    const calculatedCount = baseCount + (daysSinceLaunch * 40)

    // Check if we have a stored count that's higher
    const storedCount = localStorage.getItem(storageKey)
    const currentCount = storedCount
      ? Math.max(parseInt(storedCount, 10), calculatedCount)
      : calculatedCount

    setCount(currentCount)
    localStorage.setItem(storageKey, currentCount.toString())

    // Set up interval to increment while page is open
    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev === null) return prev
        const newCount = prev + 1
        localStorage.setItem(storageKey, newCount.toString())

        // Trigger animation
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)

        return newCount
      })
    }, incrementInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [baseCount, incrementInterval])

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-AU')
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Live indicator dot */}
      <div className="relative flex items-center justify-center">
        <span className="absolute w-3 h-3 bg-accent/30 rounded-full animate-ping" />
        <span className="relative w-2 h-2 bg-accent rounded-full" />
      </div>

      <div>
        <motion.div
          className="flex items-baseline gap-1"
          animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <span className="text-4xl sm:text-5xl font-mono font-black text-accent tabular-nums">
            {count === null ? (
              <span className="inline-block animate-pulse">—</span>
            ) : (
              formatNumber(count)
            )}
          </span>
          {count !== null && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent/60 text-lg font-mono"
            >
              +
            </motion.span>
          )}
        </motion.div>

        {label && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {label}
          </motion.p>
        )}
      </div>
    </div>
  )
}
