import { programs } from '@/data/programs'

/**
 * Derived statistics from VPP program data.
 * All values are computed from the programs array so they stay
 * in sync automatically when program data is updated.
 */

export const programCount = programs.length

// Earnings range across all programs
const allMinEarnings = programs.map(p => p.avgAnnualEarnings.min)
const allMaxEarnings = programs.map(p => p.avgAnnualEarnings.max)
export const earningsRangeMin = Math.min(...allMinEarnings)
export const earningsRangeMax = Math.max(...allMaxEarnings)

// Average of the midpoint earnings across programs
const midpoints = programs.map(p => (p.avgAnnualEarnings.min + p.avgAnnualEarnings.max) / 2)
export const avgAnnualEarnings = Math.round(midpoints.reduce((a, b) => a + b, 0) / midpoints.length)

// Signup bonus stats (only programs that offer one)
const bonusPrograms = programs.filter(p => p.signupBonus > 0)
export const avgSignupBonus = bonusPrograms.length > 0
  ? Math.round(bonusPrograms.reduce((sum, p) => sum + p.signupBonus, 0) / bonusPrograms.length)
  : 0
export const maxSignupBonus = Math.max(...programs.map(p => p.signupBonus))

// Formatted strings for use in copy
export const earningsRangeFormatted = `$${earningsRangeMin.toLocaleString()}-${earningsRangeMax.toLocaleString()}`
export const topEarningsFormatted = `$${Math.min(...programs.map(p => p.avgAnnualEarnings.max).sort((a, b) => b - a).slice(0, 3))}-${earningsRangeMax.toLocaleString()}`

// Retailer-independent count
export const noLockinCount = programs.filter(p => !p.retailerLockin).length
