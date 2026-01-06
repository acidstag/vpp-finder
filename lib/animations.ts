/**
 * Animation Utilities for VPP Finder
 * Streamlined collection adapted from Loveridge Labs library
 */

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeOutBack: (t: number) => {
    const c1 = 1.70158
    return 1 + (--t) * t * ((c1 + 1) * t + c1)
  },
}

// ============================================================================
// GEOMETRY & DISTANCE
// ============================================================================

export const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  const deltaX = x2 - x1
  const deltaY = y2 - y1
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t
}

// ============================================================================
// SCROLL UTILITIES
// ============================================================================

export const getScrollProgress = (element: HTMLElement): number => {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const elementHeight = rect.height
  const scrolled = windowHeight - rect.top
  const total = windowHeight + elementHeight
  return clamp(scrolled / total, 0, 1)
}

export const isInViewport = (element: HTMLElement, threshold = 0): boolean => {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return (
    rect.top <= window.innerHeight - threshold &&
    rect.bottom >= threshold &&
    rect.left <= window.innerWidth &&
    rect.right >= 0
  )
}

export const getPageScrollPercentage = (): number => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  return (scrollTop / scrollHeight) * 100
}

// ============================================================================
// FRAMER MOTION PRESETS
// ============================================================================

export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
}

export const transitionPresets = {
  smooth: {
    duration: 0.3,
    ease: [0.4, 0.0, 0.2, 1], // cubic-bezier for smooth motion
  },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  snappy: {
    duration: 0.2,
    ease: [0.4, 0.0, 0.2, 1],
  },
  slow: {
    duration: 0.6,
    ease: [0.4, 0.0, 0.2, 1],
  },
}

export const createStagger = (delay = 0.1) => ({
  staggerChildren: delay,
  delayChildren: 0.2,
})

// ============================================================================
// VIEWPORT UTILITIES
// ============================================================================

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}

// ============================================================================
// REDUCED MOTION
// ============================================================================

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-AU').format(num)
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`
}
