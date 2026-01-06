'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { VPPProgram } from '@/data/programs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { transitionPresets } from '@/lib/animations'

interface ComparisonTableProps {
  title?: string
  subtitle?: string
  programs: VPPProgram[]
  variant?: 'minimal' | 'card' | 'bordered'
  showMobileCards?: boolean
  stickyHeader?: boolean
  animateOnScroll?: boolean
  className?: string
}

interface ComparisonMetric {
  id: string
  name: string
  type: 'boolean' | 'text' | 'custom' | 'currency' | 'percentage'
  tooltip?: string
  getValue: (program: VPPProgram) => any
  render?: (value: any, program: VPPProgram) => React.ReactNode
}

/**
 * ComparisonTable - Enterprise VPP Program Comparison
 *
 * Responsive comparison table for VPP programs with:
 * - Desktop: Full table with sticky header
 * - Mobile: Card-based layout
 * - Enterprise minimal styling
 * - Monospace metrics
 * - Visual indicators
 */
export function ComparisonTable({
  title = 'Compare VPP Programs',
  subtitle,
  programs,
  variant = 'minimal',
  showMobileCards = true,
  stickyHeader = true,
  animateOnScroll = true,
  className = '',
}: ComparisonTableProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Intersection observer for scroll animation
  useEffect(() => {
    if (typeof window === 'undefined' || !animateOnScroll) {
      setIsVisible(true)
      return
    }
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [animateOnScroll])

  // Define comparison metrics
  const metrics: ComparisonMetric[] = [
    {
      id: 'earnings',
      name: 'Annual Earnings Range',
      type: 'custom',
      tooltip: 'Estimated yearly earnings based on typical usage',
      getValue: (program) => program.avgAnnualEarnings,
      render: (value) => (
        <span className="font-mono font-bold text-accent">
          ${value.min} - ${value.max}
        </span>
      ),
    },
    {
      id: 'signupBonus',
      name: 'Sign-up Bonus',
      type: 'currency',
      getValue: (program) => program.signupBonus,
      render: (value) => value > 0 ? (
        <span className="font-mono font-semibold">${value}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    },
    {
      id: 'retailerLockin',
      name: 'Retailer Lock-in',
      type: 'boolean',
      tooltip: 'Do you need to be with a specific retailer?',
      getValue: (program) => !program.retailerLockin,
      render: (value) => value ? (
        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ),
    },
    {
      id: 'controlLevel',
      name: 'Control Level',
      type: 'text',
      tooltip: 'How much control you have over your battery',
      getValue: (program) => program.controlLevel,
      render: (value) => (
        <span className="text-sm font-mono capitalize">{value}</span>
      ),
    },
    {
      id: 'regions',
      name: 'Available Regions',
      type: 'custom',
      getValue: (program) => program.regions,
      render: (value: string[]) => (
        <span className="text-sm font-mono">{value.join(', ')}</span>
      ),
    },
    {
      id: 'compatibleBatteries',
      name: 'Compatible Batteries',
      type: 'custom',
      getValue: (program) => program.compatibleBatteries,
      render: (value: string[]) => (
        <span className="text-sm">{value.length} brands</span>
      ),
    },
    {
      id: 'minBatterySize',
      name: 'Min. Battery Size',
      type: 'text',
      getValue: (program) => program.minBatterySize,
      render: (value) => (
        <span className="font-mono text-sm">{value} kWh</span>
      ),
    },
  ]

  // Render cell value
  const renderCellValue = (program: VPPProgram, metric: ComparisonMetric) => {
    const value = metric.getValue(program)

    if (metric.render) {
      return metric.render(value, program)
    }

    return value || <span className="text-muted-foreground">—</span>
  }

  const variantClasses = {
    minimal: 'bg-transparent',
    card: 'bg-card rounded-2xl border border-border p-6 sm:p-8',
    bordered: 'bg-card rounded-2xl border-2 border-border p-6 sm:p-8',
  }

  const containerClass = variantClasses[variant]
  const animationDuration = prefersReducedMotion ? 0.01 : 0.6

  return (
    <motion.div
      ref={containerRef}
      initial={animateOnScroll ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
      animate={isVisible ? { opacity: 1, y: 0 } : undefined}
      transition={{ ...transitionPresets.smooth, duration: animationDuration }}
      className={`${containerClass} ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-12">
          {title && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                Comparison
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl">
                {title}
              </h2>
            </div>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Desktop Table */}
      <div className={`${showMobileCards ? 'hidden lg:block' : 'block'} overflow-x-auto`}>
        <table
          className="w-full"
          role="table"
          aria-label={title || 'VPP program comparison table'}
        >
          <thead className={stickyHeader ? 'sticky top-16 bg-background z-10' : ''}>
            <tr className="border-b-2 border-border">
              <th className="text-left py-6 px-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Feature
              </th>
              {programs.map((program) => (
                <th
                  key={program.id}
                  className="py-6 px-4 text-center min-w-[200px]"
                >
                  <div className="space-y-2">
                    <div className="font-display font-bold text-lg">
                      {program.provider}
                    </div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {program.name}
                    </div>
                    {!program.retailerLockin && (
                      <div className="inline-block text-xs bg-accent/10 text-accent px-2 py-1 rounded font-mono">
                        No Lock-in
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr
                key={metric.id}
                className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {metric.name}
                    </span>
                    {metric.tooltip && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
                        title={metric.tooltip}
                        aria-label={`More information: ${metric.tooltip}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
                {programs.map((program) => (
                  <td
                    key={`${program.id}-${metric.id}`}
                    className="py-4 px-4 text-center"
                  >
                    {renderCellValue(program, metric)}
                  </td>
                ))}
              </tr>
            ))}
            {/* Action row */}
            <tr className="border-t-2 border-border">
              <td className="py-6 px-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Apply
              </td>
              {programs.map((program) => (
                <td key={`action-${program.id}`} className="py-6 px-4 text-center">
                  <Button size="sm" className="w-full" asChild>
                    <a
                      href={program.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply →
                    </a>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      {showMobileCards && (
        <div className="lg:hidden space-y-6">
          {programs.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: idx * 0.1, ...transitionPresets.smooth }}
            >
              <Card className="p-6">
                {/* Header */}
                <div className="mb-6 pb-6 border-b border-border">
                  {!program.retailerLockin && (
                    <div className="inline-block text-xs bg-accent/10 text-accent px-2 py-1 rounded font-mono mb-3">
                      No Lock-in
                    </div>
                  )}
                  <h3 className="font-display font-bold text-2xl mb-1">
                    {program.provider}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {program.name}
                  </p>
                </div>

                {/* Metrics */}
                <div className="space-y-4 mb-6">
                  {metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="flex items-center justify-between py-2 border-b border-border/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {metric.name}
                        </span>
                        {metric.tooltip && (
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground cursor-help"
                            title={metric.tooltip}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div>
                        {renderCellValue(program, metric)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <Button className="w-full" asChild>
                  <a
                    href={program.signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply to {program.provider} →
                  </a>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
