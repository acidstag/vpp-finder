'use client'

import { Card } from './card'
import { ArrowRight, TrendingUp } from 'lucide-react'

interface EarningsComparisonProps {
  /**
   * VPP annual earnings
   */
  vppEarnings: number

  /**
   * Feed-in tariff annual earnings (typically much lower)
   * Default: $400 (typical feed-in tariff for 6.6kW solar, 13.5kWh battery)
   */
  feedInEarnings?: number

  /**
   * Battery size in kWh
   */
  batterySize?: number

  /**
   * Additional context to show
   */
  context?: string

  className?: string
}

/**
 * Earnings Comparison Widget
 *
 * ULTRATHINK Principle: Show the value gap clearly.
 *
 * Displays side-by-side comparison of VPP earnings vs feed-in tariff,
 * highlighting the substantial difference to drive conversion.
 *
 * Usage:
 * ```tsx
 * <EarningsComparison
 *   vppEarnings={1047}
 *   feedInEarnings={407}
 *   context="with Tesla Powerwall 2"
 * />
 * ```
 */
export function EarningsComparison({
  vppEarnings,
  feedInEarnings = 400,
  batterySize,
  context,
  className = ''
}: EarningsComparisonProps) {
  const difference = vppEarnings - feedInEarnings
  const percentageIncrease = Math.round((difference / feedInEarnings) * 100)

  return (
    <Card className={`p-6 sm:p-8 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
          Earnings Comparison
        </p>
        <h3 className="text-2xl font-display font-bold">
          VPP vs Feed-in Tariff Only
        </h3>
        {context && (
          <p className="text-sm text-muted-foreground mt-2">
            {context}
          </p>
        )}
      </div>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Feed-in Tariff Only */}
        <div className="relative">
          <div className="absolute inset-0 bg-muted/30 rounded-lg" />
          <div className="relative p-6 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Feed-in Tariff Only
            </p>
            <div className="space-y-1">
              <div className="text-4xl font-mono font-bold">
                ${feedInEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">per year</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Basic solar export credits
            </p>
          </div>
        </div>

        {/* VPP Program */}
        <div className="relative">
          <div className="absolute inset-0 bg-accent/10 rounded-lg" />
          <div className="relative p-6 space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-accent">
                With VPP Program
              </p>
              <div className="flex items-center gap-1 text-xs bg-accent/20 text-accent px-2 py-1 rounded font-mono">
                <TrendingUp className="w-3 h-3" />
                {percentageIncrease}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-mono font-bold text-accent">
                ${vppEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">per year</p>
            </div>
            <p className="text-xs text-muted-foreground">
              VPP payments + better rates
            </p>
          </div>
        </div>
      </div>

      {/* Difference Highlight */}
      <div className="relative">
        <div className="absolute inset-0 bg-accent/5 rounded-lg" />
        <div className="relative p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-accent">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                You earn{' '}
                <span className="text-accent font-bold">
                  ${difference.toLocaleString()} more
                </span>{' '}
                per year
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                That's <span className="font-semibold">${Math.round(difference / 12)}/month</span> extra in your pocket
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Context */}
      {batterySize && (
        <p className="text-xs text-center text-muted-foreground mt-6">
          Based on typical usage for a {batterySize}kWh battery system
        </p>
      )}
    </Card>
  )
}
