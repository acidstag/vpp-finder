'use client'

import { useEffect, useRef } from 'react'

interface GeometricPatternAdvancedProps {
  className?: string
}

export function GeometricPatternAdvanced({ className = '' }: GeometricPatternAdvancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check if dark mode
    const isDark = document.documentElement.classList.contains('dark')

    // Helper function to draw diamond shapes
    function drawDiamond(
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      width: number,
      height: number
    ) {
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - height / 2) // Top
      ctx.lineTo(centerX + width / 2, centerY) // Right
      ctx.lineTo(centerX, centerY + height / 2) // Bottom
      ctx.lineTo(centerX - width / 2, centerY) // Left
      ctx.closePath()
      ctx.stroke()
    }

    function draw() {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)

      // Colors based on theme
      const dotColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
      const lineColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'
      const accentColor = '#00D9FF'

      // Draw dense dot matrix
      const dotSize = 1
      const dotSpacing = 15

      ctx.fillStyle = dotColor
      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          // Vary opacity slightly for depth
          const opacity = 0.1 + Math.sin((x + y) * 0.01) * 0.05
          ctx.globalAlpha = opacity

          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1

      // Draw large geometric shapes (diamonds/rhombus)
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2

      // Large diamond 1 (top right)
      drawDiamond(ctx, width * 0.7, height * 0.3, 200, 300)

      // Large diamond 2 (center)
      drawDiamond(ctx, width * 0.5, height * 0.5, 150, 250)

      // Large diamond 3 (bottom left)
      drawDiamond(ctx, width * 0.3, height * 0.7, 180, 280)

      // Draw connecting lines
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1
      ctx.setLineDash([5, 10])

      // Connect shapes
      ctx.beginPath()
      ctx.moveTo(width * 0.5, height * 0.3)
      ctx.lineTo(width * 0.7, height * 0.5)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(width * 0.3, height * 0.5)
      ctx.lineTo(width * 0.5, height * 0.7)
      ctx.stroke()

      ctx.setLineDash([])

      // Add some accent dots (battery nodes)
      ctx.fillStyle = accentColor
      const nodes = [
        { x: width * 0.7, y: height * 0.3 },
        { x: width * 0.5, y: height * 0.5 },
        { x: width * 0.3, y: height * 0.7 },
      ]

      nodes.forEach(node => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.beginPath()
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2)
        ctx.strokeStyle = accentColor
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.3
        ctx.stroke()
        ctx.globalAlpha = 1
      })
    }

    // Set canvas size
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      draw()
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.4 }}
    />
  )
}
