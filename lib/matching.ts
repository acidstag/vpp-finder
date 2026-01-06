import { programs, type VPPProgram } from '@/data/programs'

export interface UserProfile {
  battery: string
  location: string
  solar: number | null
  retailerPreference: 'keep' | 'open' | 'advice'
}

export interface ProgramMatch {
  program: VPPProgram
  score: number
  percentage: number
  matchPercentage: number // Alias for percentage
  reasons: string[]
  estimatedEarnings: {
    min: number
    max: number
    signupBonus: number
  }
}

// Map postcode to NEM region
export function postcodeToRegion(postcode: string): string {
  const code = parseInt(postcode)

  // ACT postcodes
  if (code >= 2600 && code <= 2618) return 'ACT'
  if (code >= 2900 && code <= 2920) return 'ACT'

  // NSW postcodes
  if (code >= 2000 && code <= 2599) return 'NSW'
  if (code >= 2619 && code <= 2899) return 'NSW'
  if (code >= 2921 && code <= 2999) return 'NSW'

  // VIC postcodes
  if (code >= 3000 && code <= 3999) return 'VIC'
  if (code >= 8000 && code <= 8999) return 'VIC'

  // QLD postcodes
  if (code >= 4000 && code <= 4999) return 'QLD'
  if (code >= 9000 && code <= 9999) return 'QLD'

  // SA postcodes
  if (code >= 5000 && code <= 5999) return 'SA'

  // WA postcodes
  if (code >= 6000 && code <= 6999) return 'WA'

  // TAS postcodes
  if (code >= 7000 && code <= 7999) return 'TAS'

  // NT postcodes
  if (code >= 800 && code <= 899) return 'NT'

  return 'NSW' // Default
}

// Get region multiplier for earnings calculation
// Based on wholesale price volatility and VPP event frequency
function getRegionMultiplier(postcode: string): number {
  const region = postcodeToRegion(postcode)

  // SA has highest spot price volatility = highest VPP earnings potential
  // NSW and QLD have good volatility
  // VIC has moderate volatility
  // TAS has lowest (smaller market)
  const multipliers: Record<string, number> = {
    SA: 1.20,  // Highest - most price spikes
    NSW: 1.10,
    QLD: 1.05,
    ACT: 1.08, // Part of NSW grid
    VIC: 1.00,
    TAS: 0.85,
    WA: 0.80,  // Separate grid (SWIS), limited VPP options
    NT: 0.70,  // Very limited VPP availability
  }

  return multipliers[region] || 1.0
}

// Normalize battery name for matching
function normalizeBatteryName(battery: string): string {
  return battery.toLowerCase()
    .replace(/powerwall\s*2/i, 'powerwall 2')
    .replace(/powerwall\s*3/i, 'powerwall 3')
    .replace(/pw2/i, 'powerwall 2')
    .replace(/pw3/i, 'powerwall 3')
    .replace(/sonnenbatterie/i, 'sonnenbatterie')
    .replace(/alpha\s*ess/i, 'alphaess')
    .replace(/lg\s*chem/i, 'lg chem')
    .replace(/sun\s*grow/i, 'sungrow')
    .trim()
}

// Check if battery is compatible with program
function isBatteryCompatible(userBattery: string, programBatteries: string[]): boolean {
  const normalizedUser = normalizeBatteryName(userBattery)

  return programBatteries.some(pb => {
    const normalizedProgram = normalizeBatteryName(pb)
    // Check if user battery contains program battery name or vice versa
    return normalizedUser.includes(normalizedProgram) ||
           normalizedProgram.includes(normalizedUser) ||
           // Special handling for Tesla variants
           (normalizedUser.includes('tesla') && normalizedProgram.includes('tesla')) ||
           (normalizedUser.includes('powerwall') && normalizedProgram.includes('powerwall'))
  })
}

// Calculate estimated earnings
function calculateEarnings(
  profile: UserProfile,
  program: VPPProgram
): { min: number; max: number; signupBonus: number } {
  const baseMin = program.avgAnnualEarnings.min
  const baseMax = program.avgAnnualEarnings.max

  // Adjust for solar size (larger systems = more export potential)
  let solarMultiplier = 1.0
  if (profile.solar) {
    if (profile.solar >= 10) {
      solarMultiplier = 1.15 // Large system
    } else if (profile.solar >= 6.6) {
      solarMultiplier = 1.0 // Standard system
    } else if (profile.solar >= 5) {
      solarMultiplier = 0.9 // Smaller system
    } else {
      solarMultiplier = 0.75 // Minimum viable
    }
  } else {
    solarMultiplier = 0.85 // Unknown, assume average
  }

  // Adjust for region
  const regionMultiplier = getRegionMultiplier(profile.location)

  return {
    min: Math.round(baseMin * solarMultiplier * regionMultiplier),
    max: Math.round(baseMax * solarMultiplier * regionMultiplier),
    signupBonus: program.signupBonus,
  }
}

// Match programs to user profile
export function matchPrograms(profile: UserProfile): ProgramMatch[] {
  const region = postcodeToRegion(profile.location)

  const matches = programs.map((program) => {
    let score = 0
    const reasons: string[] = []

    // 1. Location availability (CRITICAL - 30 points)
    // If not available in region, significantly penalize
    if (program.regions.includes(region) || program.regions.includes('ACT') && region === 'NSW') {
      score += 30
      reasons.push(`Available in ${region}`)
    } else {
      // Not available - major penalty but still show for awareness
      score -= 20
      reasons.push(`Limited availability in ${region}`)
    }

    // 2. Battery compatibility (CRITICAL - 25 points)
    const batteryMatch = isBatteryCompatible(profile.battery, program.compatibleBatteries)
    if (batteryMatch) {
      score += 25
      reasons.push('Compatible with your battery')
    } else {
      // Check for partial match (same brand family)
      const userBrand = profile.battery.toLowerCase().split(' ')[0]
      const partialMatch = program.compatibleBatteries.some(b =>
        b.toLowerCase().includes(userBrand)
      )
      if (partialMatch) {
        score += 10
        reasons.push('May be compatible - check with provider')
      }
    }

    // 3. Retailer preference (20 points)
    if (profile.retailerPreference === 'keep') {
      // User wants to keep current retailer
      if (!program.retailerLockin) {
        score += 20
        reasons.push('No retailer switching required')
      } else {
        score += 5
        reasons.push('Requires retailer switch')
      }
    } else if (profile.retailerPreference === 'open') {
      // User is open to switching
      score += 15
      if (program.retailerLockin) {
        reasons.push('Bundled with electricity plan')
      } else {
        reasons.push('Flexible - works with any retailer')
      }
    } else {
      // Needs advice - neutral
      score += 10
    }

    // 4. Earnings potential (15 points - tiered)
    const maxEarnings = program.avgAnnualEarnings.max
    if (maxEarnings >= 1000) {
      score += 15
      reasons.push('High earning potential (wholesale market)')
    } else if (maxEarnings >= 500) {
      score += 10
      reasons.push('Good earning potential')
    } else if (maxEarnings >= 300) {
      score += 5
      reasons.push('Moderate, predictable earnings')
    }

    // 5. Control level preference (5 points)
    if (program.controlLevel === 'full') {
      score += 5
      reasons.push('You maintain full battery control')
    } else if (program.controlLevel === 'semi') {
      score += 3
      reasons.push('Shared control with provider')
    } else {
      score += 2
      reasons.push('Automated - set and forget')
    }

    // 6. Signup bonus (5 points)
    if (program.signupBonus >= 200) {
      score += 5
      reasons.push(`$${program.signupBonus} sign-up bonus`)
    } else if (program.signupBonus >= 100) {
      score += 3
      reasons.push(`$${program.signupBonus} sign-up bonus`)
    }

    // Calculate final percentage (cap at 100)
    const rawPercentage = Math.round((score / 100) * 100)
    const percentage = Math.min(Math.max(rawPercentage, 0), 100)

    return {
      program,
      score,
      percentage,
      matchPercentage: percentage,
      reasons: reasons.filter(r => r), // Remove empty reasons
      estimatedEarnings: calculateEarnings(profile, program),
    }
  })

  // Sort by score (highest first), filter out very poor matches
  return matches
    .filter(m => m.score > 0) // Only show positive matches
    .sort((a, b) => b.score - a.score)
}

// Get top N matches
export function getTopMatches(profile: UserProfile, count: number = 4): ProgramMatch[] {
  return matchPrograms(profile).slice(0, count)
}

// Get matches by payment model
export function getMatchesByPaymentModel(
  profile: UserProfile,
  model: 'wholesale' | 'fixed' | 'event' | 'hybrid'
): ProgramMatch[] {
  return matchPrograms(profile).filter(m => m.program.paymentModel === model)
}
