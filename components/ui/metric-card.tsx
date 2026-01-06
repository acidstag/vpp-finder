'use client'

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { motionPresets, transitionPresets } from "@/lib/animations"

interface MetricCardProps {
  label: string
  value: string | number
  sublabel?: string
  trend?: {
    value: string
    positive?: boolean
  }
  icon?: React.ReactNode
  className?: string
  delay?: number
}

export function MetricCard({
  label,
  value,
  sublabel,
  trend,
  icon,
  className,
  delay = 0
}: MetricCardProps) {
  return (
    <motion.div
      className={cn("space-y-2", className)}
      {...motionPresets.fadeInUp}
      transition={{ ...transitionPresets.smooth, delay }}
    >
      <div className="flex items-center gap-2">
        <div className="metric-label">{label}</div>
        {icon && <span className="text-accent">{icon}</span>}
      </div>
      <div className="metric-number">{value}</div>
      {sublabel && (
        <div className="text-sm text-muted-foreground">{sublabel}</div>
      )}
      {trend && (
        <div
          className={cn(
            "text-sm font-medium",
            trend.positive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
          )}
        >
          {trend.value}
        </div>
      )}
    </motion.div>
  )
}
