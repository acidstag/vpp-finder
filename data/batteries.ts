export interface Battery {
  brand: string
  model: string
  capacity: number // kWh
  priceRange: { min: number; max: number }
  popular: boolean
  vppCompatible: boolean
}

export const batteries: Battery[] = [
  {
    brand: 'Tesla',
    model: 'Powerwall 2',
    capacity: 13.5,
    priceRange: { min: 12000, max: 15000 },
    popular: true,
    vppCompatible: true,
  },
  {
    brand: 'Tesla',
    model: 'Powerwall 3',
    capacity: 13.5,
    priceRange: { min: 15000, max: 17000 },
    popular: true,
    vppCompatible: true,
  },
  {
    brand: 'Sungrow',
    model: 'SBR096',
    capacity: 9.6,
    priceRange: { min: 10000, max: 13000 },
    popular: true,
    vppCompatible: true,
  },
  {
    brand: 'Sungrow',
    model: 'SBH',
    capacity: 20,
    priceRange: { min: 18000, max: 22000 },
    popular: false,
    vppCompatible: true,
  },
  {
    brand: 'Sonnen',
    model: 'eco 10',
    capacity: 10,
    priceRange: { min: 14000, max: 17000 },
    popular: false,
    vppCompatible: true,
  },
  {
    brand: 'LG Energy Solution',
    model: 'RESU10H',
    capacity: 9.8,
    priceRange: { min: 10000, max: 13000 },
    popular: true,
    vppCompatible: true,
  },
  {
    brand: 'BYD',
    model: 'Battery-Box Premium HVS',
    capacity: 10.2,
    priceRange: { min: 9000, max: 12000 },
    popular: true,
    vppCompatible: true,
  },
  {
    brand: 'AlphaESS',
    model: 'SMILE5',
    capacity: 10,
    priceRange: { min: 9000, max: 12000 },
    popular: true,
    vppCompatible: true,
  },
  {
    brand: 'Enphase',
    model: 'IQ Battery 5P',
    capacity: 5,
    priceRange: { min: 7000, max: 9000 },
    popular: false,
    vppCompatible: true,
  },
  {
    brand: 'GivEnergy',
    model: 'All-in-One',
    capacity: 9.5,
    priceRange: { min: 9000, max: 12000 },
    popular: false,
    vppCompatible: true,
  },
  {
    brand: 'Sigenergy',
    model: 'SigenStor',
    capacity: 10,
    priceRange: { min: 10000, max: 13000 },
    popular: false,
    vppCompatible: true,
  },
]

// Helper to normalize battery names for fuzzy matching
export function normalizeBatteryName(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Fuzzy match battery from user input
export function matchBattery(input: string): Battery | null {
  const normalized = normalizeBatteryName(input)

  for (const battery of batteries) {
    const brandModel = normalizeBatteryName(`${battery.brand} ${battery.model}`)
    const brand = normalizeBatteryName(battery.brand)

    if (brandModel.includes(normalized) || normalized.includes(brandModel)) {
      return battery
    }

    if (normalized.includes(brand)) {
      return battery
    }
  }

  return null
}
