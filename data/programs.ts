/**
 * Australian VPP Programs Database
 * Last verified: March 2026
 *
 * Data sources:
 * - SolarQuotes VPP Comparison (Feb 2026): https://www.solarquotes.com.au/battery-storage/vpp-comparison/
 * - Solar Choice VPP Providers (2026): https://www.solarchoice.net.au/solar-batteries/compare-vpp-providers/
 * - Individual provider websites (verified)
 *
 * Note: Tesla Energy Plan now operated by Energy Locals (not Tesla directly)
 * Note: Redback Technologies removed — entered administration 2024, VPP status uncertain
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
    name: 'Amber for Batteries (SmartShift)',
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
      'BYD',
      'Redback',
      'Neovolt',
      'Enphase',
      'SolarEdge',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 600, max: 1500 },
    signupBonus: 0,
    vppRate: 'variable',
    controlLevel: 'full',
    signupUrl: 'https://www.amber.com.au/solar-and-battery',
    pros: [
      'Wholesale price pass-through - earn up to $21/kWh during spikes',
      'Full battery control - you decide when to charge/discharge',
      'No lock-in contract - cancel anytime with 14 days notice',
      'Government rebates available in NSW and SA',
    ],
    cons: [
      'Earnings vary with market conditions',
      '$25/month subscription fee',
      'Requires active monitoring for best results',
    ],
    paymentModel: 'wholesale',
    updatedAt: '2026-03-26',
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
    avgAnnualEarnings: { min: 280, max: 530 },
    signupBonus: 100,
    vppRate: 1.0,
    controlLevel: 'semi',
    signupUrl: 'https://www.agl.com.au/residential/solar-and-batteries/virtual-power-plant',
    pros: [
      'Trusted major retailer brand',
      '$100 sign-up credit',
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
    updatedAt: '2026-03-26',
  },
  {
    id: 'origin-loop',
    name: 'Origin Loop / Battery Lite',
    provider: 'Origin Energy',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'Tesla Powerwall 3',
      'Sungrow SBR',
      'AlphaESS',
      'BYD Battery-Box',
      'LG RESU',
      'Enphase IQ',
      'GivEnergy',
      'GoodWe',
      'Sigenergy',
      'SolaX',
      'Fox ESS',
      'FranklinWH',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 200, max: 400 },
    signupBonus: 200,
    vppRate: 1.0,
    controlLevel: 'semi',
    signupUrl: 'https://www.originenergy.com.au/solar/panels-batteries/virtual-power-plant/',
    pros: [
      '$200 sign-up bonus credit',
      '$1/kWh for VPP event exports',
      'No lock-in contract (BYO battery) - 20 days notice to leave',
      'Widest battery compatibility of any major retailer VPP',
      'NSW/SA government rebates available',
    ],
    cons: [
      '200kWh annual cap on exports',
      'Must be Origin electricity customer',
      'Lower earning potential than wholesale VPPs',
      '5-year lock-in if you buy battery through Origin',
    ],
    paymentModel: 'event',
    updatedAt: '2026-03-26',
  },
  {
    id: 'energyaustralia-battery-ease',
    name: 'Battery Ease',
    provider: 'EnergyAustralia',
    regions: ['NSW'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'AlphaESS',
      'Redback Smart Hybrid',
      'LG Chem',
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
      '10% discount on grid usage',
      'No lock-in contract',
      'NSW PDRS rebate eligible',
    ],
    cons: [
      'NSW only',
      'Must be EnergyAustralia customer',
      'Lower earnings than wholesale VPPs',
      '10% minimum battery reserve',
      'Limited to 8,000 participants',
    ],
    paymentModel: 'fixed',
    updatedAt: '2026-03-26',
  },
  {
    id: 'discover-energy',
    name: 'VPP Program',
    provider: 'Discover Energy',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 5,
    compatibleBatteries: [
      'GoodWe',
      'Sungrow',
      'SolarEdge',
      'AlphaESS',
      'Growatt',
      'QCELLS',
      'Huawei',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 600, max: 1000 },
    signupBonus: 0,
    vppRate: 'variable',
    controlLevel: 'automated',
    signupUrl: 'https://www.discoverenergy.com.au/vpp',
    pros: [
      'Smart Feed-in Algorithm maximises export value',
      'Average $85/month in credits for VPP customers',
      'Free battery recharging during VPP events',
      'Cash out credits above $100',
      'No exit fees - leave with 10 business days notice',
    ],
    cons: [
      'Must switch to Discover Energy',
      'Can only opt out of 1 VPP event per month',
      'Inverter size capped at 10kW',
      'Discover Energy controls battery during events',
    ],
    paymentModel: 'hybrid',
    updatedAt: '2026-03-26',
  },
  {
    id: 'shinehub-vpp',
    name: 'Community VPP',
    provider: 'ShineHub',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Hinen',
      'AlphaESS',
      'GoodWe',
      'Sungrow',
      'Growatt',
      'LG Chem',
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
      '$2,000 VPP incentive for new system purchases',
      'No lock-in contract - 30 days notice to leave',
    ],
    cons: [
      'Battery must be installed by ShineHub',
      'Limited battery brand compatibility',
      'Earnings on top of existing feed-in tariff',
    ],
    paymentModel: 'event',
    updatedAt: '2026-03-26',
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
      'Redback',
      'SolaX',
      'Sigenergy',
      'SAJ',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 250, max: 550 },
    signupBonus: 0,
    vppRate: 0.30,
    controlLevel: 'full',
    signupUrl: 'https://diamondenergy.com.au/join-diamond-energy-vpp/',
    pros: [
      '$250-$450/year guaranteed access credit',
      '30c/kWh for night exports (6pm-8am)',
      'No lock-in contract or exit fees',
      'You stay in control of your battery',
    ],
    cons: [
      'Must switch to Diamond Energy',
      '$68 establishment fee',
      'QLD limited to Energex region only',
    ],
    paymentModel: 'fixed',
    updatedAt: '2026-03-26',
  },
  {
    id: 'engie-vpp',
    name: 'VPP Advantage',
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
    avgAnnualEarnings: { min: 280, max: 540 },
    signupBonus: 300,
    vppRate: 0,
    controlLevel: 'semi',
    signupUrl: 'https://engie.com.au/residential/energy-efficiency/engie-vpp',
    pros: [
      '$300 sign-up credit (NSW/QLD/SA) or $100 (VIC)',
      '$20/month VPP community credits ($15/month VIC)',
      'No lock-in contract',
      'Simple setup process',
    ],
    cons: [
      'Must switch to ENGIE retailer',
      'VIC gets lower bonuses',
      'No per-kWh event payments',
      '400kWh usage cap for 5-10kW systems (800kWh for 10-15kW)',
    ],
    paymentModel: 'fixed',
    updatedAt: '2026-03-26',
  },
  {
    id: 'globird-zerohero',
    name: 'ZeroHero',
    provider: 'GloBird Energy',
    regions: ['NSW', 'VIC', 'QLD', 'SA'],
    minBatterySize: 3,
    compatibleBatteries: [
      'AlphaESS',
      'Redback',
      'Sungrow',
      'SolaX',
      'Sigenergy',
      'SAJ',
      'Neovolt',
      'eCactus',
      'Solis + Dyness',
      'Tesla',
      'Anker SOLIX',
    ],
    retailerLockin: true,
    avgAnnualEarnings: { min: 200, max: 500 },
    signupBonus: 0,
    vppRate: 1.0,
    controlLevel: 'full',
    signupUrl: 'https://www.globirdenergy.com.au/energy-saver/zerohero/',
    pros: [
      '3 hours free daily grid charging (11am-2pm)',
      '$1/day credit when drawing zero grid power at peak',
      '15c/kWh feed-in tariff',
      'You stay in control - battery never drained without permission',
      'Basic plan works with any battery brand',
    ],
    cons: [
      'Must switch to GloBird Energy',
      'Credits based on achieving zero-grid goals',
      'ZeroLimits add-on requires specific battery brands',
    ],
    paymentModel: 'hybrid',
    updatedAt: '2026-03-26',
  },
  {
    id: 'sonnen-connect',
    name: 'sonnenConnect',
    provider: 'Sonnen',
    regions: ['NSW', 'VIC', 'QLD', 'SA', 'TAS', 'ACT'],
    minBatterySize: 4,
    compatibleBatteries: [
      'sonnenBatterie eco',
      'sonnenBatterie evo',
      'sonnenBatterie hybrid',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 600, max: 1200 },
    signupBonus: 100,
    vppRate: 'variable',
    controlLevel: 'semi',
    signupUrl: 'https://sonnen.com.au/virtual-power-plant-vpp-works/',
    pros: [
      'Retailer independent - keep your current provider',
      'High earning potential ($600-$1200/year)',
      '$100 sign-up bonus + daily credits',
      'Daily credits + VPP event payments',
      'Premium German-engineered battery integration',
    ],
    cons: [
      'Sonnen batteries only',
      'Must own battery outright (no finance)',
      'Cannot be in another VPP simultaneously',
    ],
    paymentModel: 'hybrid',
    updatedAt: '2026-03-26',
  },
  {
    id: 'tesla-energy-locals',
    name: 'Tesla Energy Plan',
    provider: 'Energy Locals',
    regions: ['NSW', 'VIC', 'QLD', 'SA', 'ACT'],
    minBatterySize: 5,
    compatibleBatteries: [
      'Tesla Powerwall 2',
      'Tesla Powerwall 3',
    ],
    retailerLockin: false,
    avgAnnualEarnings: { min: 200, max: 400 },
    signupBonus: 0,
    vppRate: 'variable',
    controlLevel: 'semi',
    signupUrl: 'https://www.energylocals.com.au/tesla-energy-plan/',
    pros: [
      'Retailer independent - keep your current provider',
      '$220/year in grid support credits',
      'No lock-in contract',
      'Seamless Tesla app integration',
    ],
    cons: [
      'Tesla Powerwall only',
      'Max 50 discharge cycles per year',
      'Lower feed-in tariff (4.9-5c/kWh)',
      '20% battery reserve',
    ],
    paymentModel: 'event',
    updatedAt: '2026-03-26',
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
