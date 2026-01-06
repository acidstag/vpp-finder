'use client'

import { useEffect, useRef } from 'react'

interface GeometricPatternProps {
  className?: string
  density?: number
  animated?: boolean
}

export function GeometricPattern({
  className = '',
  density = 20,
  animated = true
}: GeometricPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    // Check if dark mode
    const isDark = document.documentElement.classList.contains('dark')

    // Draw dot grid pattern
    const drawPattern = (offset = 0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dotSize = 1.5
      const spacing = density
      const rows = Math.ceil(canvas.height / spacing) + 2
      const cols = Math.ceil(canvas.width / spacing) + 2

      // Dot color based on theme
      ctx.fillStyle = isDark
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.08)'

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * spacing
          const y = i * spacing + (animated ? Math.sin(offset + i * 0.1) * 2 : 0)

          // Vary opacity slightly for depth
          const opacity = 0.3 + Math.sin((i + j) * 0.5) * 0.2
          ctx.globalAlpha = opacity

          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
    }

    // Animation loop
    let animationId: number
    let offset = 0

    const animate = () => {
      if (animated) {
        offset += 0.01
        drawPattern(offset)
        animationId = requestAnimationFrame(animate)
      } else {
        drawPattern()
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateSize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [density, animated])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.6 }}
    />
  )
}

// Simpler CSS-based geometric pattern (fallback)
export function GeometricPatternCSS({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.1,
      }}
    />
  )
}
