'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { GeometricPatternAdvanced } from './geometric-pattern-advanced'

interface HybridBackgroundProps {
  variant?: 'hero' | 'section' | 'cta'
  className?: string
  useCodePattern?: boolean
  imagePattern?: 1 | 2 | 3
}

export function HybridBackground({
  variant = 'hero',
  className = '',
  useCodePattern = false,
  imagePattern = 1
}: HybridBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Pattern selection based on variant
  const getPatternImage = () => {
    switch (imagePattern) {
      case 1:
        return '/pattern-hero-1.png' // Battery network visualization
      case 2:
        return '/pattern-hero-2.png' // Technical blueprint
      case 3:
        return '/pattern-hero-3.png' // VPP network
      default:
        return '/pattern-hero-1.png'
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Midjourney Image Background */}
      {!useCodePattern && (
        <div className="absolute inset-0">
          <Image
            src={getPatternImage()}
            alt=""
            fill
            className="object-cover opacity-30 dark:opacity-20"
            priority={variant === 'hero'}
            quality={90}
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        </div>
      )}

      {/* Code-based Geometric Pattern Overlay */}
      {useCodePattern && (
        <GeometricPatternAdvanced className="opacity-40" />
      )}

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/40" />
    </div>
  )
}
