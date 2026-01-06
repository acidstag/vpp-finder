/**
 * Australian VPP Programs Database
 * Last verified: January 2025
 *
 * Data sources:
 * - SolarQuotes VPP Comparison: https://www.solarquotes.com.au/battery-storage/vpp-comparison/
 * - Solar Choice VPP Providers: https://www.solarchoice.net.au/solar-batteries/compare-vpp-providers/
 * - Individual provider websites (verified)
 *
 * Note: Tesla Energy Plan closed September 30, 2025
 */

export interface VPPProgram {
  id: string
  name: string
  provider: string
  regions: string[]
  minBatterySize: number // kWh
  compatibleBatteries: string[]
  retailerLockin: boolean
  avgAnnualEarnings: { min: number; max: number }
  signupBonus: number
  vppRate: number | string // per kWh or 'variable'
  controlLevel: 'full' | 'semi' | 'automated'
  signupUrl: string
  pros: string[]
  cons: string[]
  paymentModel: 'wholesale' | 'fixed' | 'event' | 'hybrid'
  updatedAt: string
}

export const programs: VPPProgram[] = [
  {
    id: 'amber-smartshift',
    name: 'SmartShift',
    provider: 'Amber Electric',
    regions: ['NSW', 'VIC', 'QLD', 'SA', 'ACT'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'Tesla Powerwall 3',
      'Sungrow SBR',
      'AlphaESS',
      'Sigenergy',
      'GoodWe',
      'SolaX',
      'LG Chem',
      'GivEnergy',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 600, max: 1500 },
    signupBonus: 0,
    vppRate: 'variable',
    controlLevel: 'full',
    signupUrl: 'https://www.amber.com.au/solar-and-battery',
    pros: [
      'Wholesale price pass-through - earn up to $19/kWh during spikes',
      'Full battery control - you decide when to charge/discharge',
      'No lock-in contract - cancel anytime with 14 days notice',
      'Government rebates available in NSW and SA',
    ],
    cons: [
      'Earnings vary with market conditions',
      'Monthly subscription fee applies',
      'Requires active monitoring for best results',
    ],
    paymentModel: 'wholesale',
    updatedAt: '2025-01-05',
  },
  {
    id: 'agl-byob',
    name: 'Bring Your Own Battery VPP',
    provider: 'AGL',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'Tesla Powerwall 3',
      'AlphaESS',
      'Sungrow',
      'Sigenergy',
      'LG Chem',
      'SolarEdge',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 330, max: 530 },
    signupBonus: 0,
    vppRate: 1.0,
    controlLevel: 'semi',
    signupUrl: 'https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant',
    pros: [
      'Trusted major retailer brand',
      'Quarterly bill credits ($20-$45 depending on state)',
      '$1/kWh for VPP event exports',
      'Battery backup guarantee - 250kWh annual cap',
    ],
    cons: [
      'Must be AGL electricity customer',
      'Lower earning potential vs wholesale VPPs',
      '250kWh annual cap on VPP exports',
    ],
    paymentModel: 'event',
    updatedAt: '2025-01-05',
  },
  {
    id: 'origin-loop',
    name: 'Origin Loop / Battery Lite',
    provider: 'Origin Energy',
    regions: ['NSW', 'VIC', 'QLD', 'SA', 'ACT'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'Tesla Powerwall 3',
      'LG Chem',
      'SolarEdge',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 200, max: 400 },
    signupBonus: 200,
    vppRate: 1.0,
    controlLevel: 'semi',
    signupUrl: 'https://www.originenergy.com.au/solar/panels-batteries/virtual-power-plant/',
    pros: [
      '$200 sign-up bonus credit',
      '$1/kWh for VPP event exports',
      'No lock-in contract - 20 days notice to leave',
      'NSW/SA government rebates available',
    ],
    cons: [
      '200kWh annual cap on exports',
      'Must be Origin electricity customer',
      'Lower earning potential than wholesale VPPs',
    ],
    paymentModel: 'event',
    updatedAt: '2025-01-05',
  },
  {
    id: 'energyaustralia-battery-ease',
    name: 'Battery Ease',
    provider: 'EnergyAustralia',
    regions: ['NSW', 'VIC', 'QLD', 'SA', 'ACT'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'AlphaESS',
      'Redback Smart Hybrid',
      'LG Chem',
      'SolarEdge',
      'Sungrow',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 180, max: 450 },
    signupBonus: 0,
    vppRate: 0.12,
    controlLevel: 'automated',
    signupUrl: 'https://www.energyaustralia.com.au/home/electricity-and-gas/solar-power/virtual-power-plant',
    pros: [
      '$15/month in bill credits ($180/year guaranteed)',
      '12c/kWh feed-in for first 15kWh daily',
      'No lock-in contract',
      'NSW PDRS rebate eligible',
    ],
    cons: [
      'Must be EnergyAustralia customer',
      'Lower earnings than wholesale VPPs',
      '20% minimum battery reserve',
    ],
    paymentModel: 'fixed',
    updatedAt: '2025-01-05',
  },
  {
    id: 'discover-energy',
    name: 'VPP Program',
    provider: 'Discover Energy',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'Tesla Powerwall 3',
      'Sungrow SBR',
      'AlphaESS',
      'GoodWe',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 400, max: 800 },
    signupBonus: 0,
    vppRate: 'variable',
    controlLevel: 'automated',
    signupUrl: 'https://www.discoverenergy.com.au/vpp',
    pros: [
      'Smart Feed-in Algorithm maximises export value',
      'Higher event export credits + profit share',
      'Machine learning optimisation',
      'Cash out credits above $100',
    ],
    cons: [
      'Must switch to Discover Energy',
      'Limited opt-out allowed',
      'Inverter size capped at 10kW',
    ],
    paymentModel: 'hybrid',
    updatedAt: '2025-01-05',
  },
  {
    id: 'shinehub-vpp',
    name: 'Community VPP',
    provider: 'ShineHub',
    regions: ['NSW', 'VIC', 'QLD', 'SA', 'ACT', 'TAS'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Hinen',
      'AlphaESS',
      'GoodWe',
      'Sungrow',
      'Growatt',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 300, max: 700 },
    signupBonus: 0,
    vppRate: 0.55,
    controlLevel: 'full',
    signupUrl: 'https://shinehub.com.au/virtual-power-plant/',
    pros: [
      'Retailer independent - keep your current provider',
      '55c/kWh for VPP exports ($1/kWh for Hinen batteries)',
      'No lock-in contract or exit fees',
      'Free to join',
    ],
    cons: [
      'Battery must be installed by ShineHub',
      'Limited battery brand compatibility',
      'Earnings on top of existing feed-in tariff',
    ],
    paymentModel: 'event',
    updatedAt: '2025-01-05',
  },
  {
    id: 'diamond-wattbank',
    name: 'WATTBANK VPP',
    provider: 'Diamond Energy',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Sungrow',
      'AlphaESS',
      'LG Chem RESU HV',
      'Tesla Powerwall',
      'SolarEdge',
      'SolaX',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 250, max: 550 },
    signupBonus: 0,
    vppRate: 0.30,
    controlLevel: 'full',
    signupUrl: 'https://diamondenergy.com.au/join-diamond-energy-vpp/',
    pros: [
      '$250-$450/year guaranteed access credit',
      '30c/kWh for night exports (6pm-8am)',
      'No lock-in contract or exit fees',
      'Retailer-independent option available',
    ],
    cons: [
      '$68 establishment fee',
      'QLD limited to Energex region only',
      'Requires switching to Diamond Energy',
    ],
    paymentModel: 'fixed',
    updatedAt: '2025-01-05',
  },
  {
    id: 'engie-vpp',
    name: 'BYO Battery VPP',
    provider: 'ENGIE',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'Tesla Powerwall 3',
      'AlphaESS',
      'Sungrow',
      'Sigenergy',
      'Empower',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 280, max: 440 },
    signupBonus: 200,
    vppRate: 0,
    controlLevel: 'semi',
    signupUrl: 'https://engie.com.au/residential/energy-efficiency/engie-vpp',
    pros: [
      '$200 sign-up credit (NSW/QLD/SA) or $100 (VIC)',
      '$20/month bill credits ($15/month VIC)',
      'No lock-in contract',
      'Simple setup process',
    ],
    cons: [
      'Must switch to ENGIE retailer',
      'VIC gets lower bonuses',
      'No per-kWh event payments',
    ],
    paymentModel: 'fixed',
    updatedAt: '2025-01-05',
  },
  {
    id: 'globird-zerohero',
    name: 'ZeroHero',
    provider: 'GloBird Energy',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 5,
    compatibleBatteries: [
      'AlphaESS',
      'Redback',
      'Sungrow',
      'SolaX',
      'Sigenergy',
      'SAJ',
      'Neovolt',
      'eCactus',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 200, max: 500 },
    signupBonus: 0,
    vppRate: 1.0,
    controlLevel: 'full',
    signupUrl: 'https://www.globirdenergy.com.au/energy-saver/zerohero/',
    pros: [
      '$0 energy rate 11am-2pm daily (free charging)',
      '$1/day when drawing zero grid power at peak',
      'Up to $312/year in ZeroHero credits',
      'You stay in control - battery never drained without permission',
    ],
    cons: [
      'Must switch to GloBird Energy',
      'Credits based on achieving zero-grid goals',
      'Newer program (launched 2024)',
    ],
    paymentModel: 'hybrid',
    updatedAt: '2025-01-05',
  },
  {
    id: 'sonnen-connect',
    name: 'sonnenConnect',
    provider: 'Sonnen',
    regions: ['NSW', 'VIC', 'QLD', 'SA', 'TAS'],
    minBatterySize: 4,
    compatibleBatteries: [
      'sonnenBatterie eco',
      'sonnenBatterie evo',
      'sonnenBatterie hybrid',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 600, max: 1200 },
    signupBonus: 0,
    vppRate: 'variable',
    controlLevel: 'semi',
    signupUrl: 'https://sonnen.com.au/virtual-power-plant-vpp-works/',
    pros: [
      'Retailer independent - keep your current provider',
      'High earning potential ($600-$1200/year)',
      'Daily credits + VPP event payments',
      'Premium German-engineered battery integration',
    ],
    cons: [
      'Sonnen batteries only',
      'Must own battery outright (no finance)',
      'Cannot be in another VPP simultaneously',
    ],
    paymentModel: 'hybrid',
    updatedAt: '2025-01-05',
  },
  {
    id: 'redback-smart',
    name: 'Smart VPP',
    provider: 'Redback Technologies',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 4,
    compatibleBatteries: [
      'Redback Smart Battery',
      'Redback Smart Hybrid',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 300, max: 600 },
    signupBonus: 0,
    vppRate: 'variable',
    controlLevel: 'full',
    signupUrl: 'https://redbacktech.com/au/virtual-power-plant/',
    pros: [
      'Australian-made batteries',
      'Retailer independent',
      'Smart inverter integration',
      'EV charger compatible',
    ],
    cons: [
      'Redback systems only',
      'Smaller market presence',
      'Regional availability varies',
    ],
    paymentModel: 'event',
    updatedAt: '2025-01-05',
  },
]

// Helper function to get program by ID
export function getProgramById(id: string): VPPProgram | undefined {
  return programs.find(p => p.id === id)
}

// Helper function to get programs by region
export function getProgramsByRegion(region: string): VPPProgram[] {
  return programs.filter(p => p.regions.includes(region))
}

// Helper function to get retailer-independent programs
export function getRetailerIndependentPrograms(): VPPProgram[] {
  return programs.filter(p => !p.retailerLockin)
}
