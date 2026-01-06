/**
 * Chat Utility Tests
 *
 * These tests verify the detection logic for the chat qualification flow.
 * Run with: npx jest lib/chat-utils.test.ts
 */

// Detection patterns extracted for testing
const batteryBrands = [
  'tesla', 'powerwall', 'power wall',
  'lg', 'lg chem', 'lgchem', 'lg-chem',
  'sonnen', 'sonen', 'sonnon',
  'sungrow', 'sun grow', 'sungrouw',
  'enphase', 'enphaze',
  'alpha', 'alphaess', 'alpha ess', 'alpha-ess',
  'byd', 'b.y.d',
  'redback', 'red back',
  'growatt', 'growat',
  'goodwe', 'good we',
  'solax', 'sola x',
  'fronius', 'huawei', 'pylontech', 'pylon',
  'simpliphi', 'eguana', 'senec', 'varta'
]

function detectBattery(text: string): boolean {
  const lower = text.toLowerCase()
  return batteryBrands.some(b => lower.includes(b))
}

function detectPostcode(text: string): string | null {
  const match = text.match(/\b([0-9]{4})\b/)
  if (match && parseInt(match[1]) >= 200 && parseInt(match[1]) <= 9999) {
    return match[1]
  }
  return null
}

function detectSolar(text: string): boolean {
  const patterns = [
    /\d+(\.\d+)?\s*kw/i,
    /\d+(\.\d+)?\s*kilowatt/i,
    /no\s*solar/i,
    /don'?t\s*have\s*(solar|panels)/i,
    /no\s*panels/i,
    /without\s*solar/i,
  ]
  return patterns.some(p => p.test(text))
}

function detectRetailerPref(text: string): 'open' | 'keep' | 'advice' | null {
  const lower = text.toLowerCase()

  // Open to switching
  if (/switch|open to|happy to|willing|don'?t (mind|care)|whatever/i.test(lower)) {
    return 'open'
  }

  // Keep current
  if (/keep|stay|current retailer|like my/i.test(lower)) {
    return 'keep'
  }

  // Need advice
  if (/advice|recommend|not sure|help me/i.test(lower)) {
    return 'advice'
  }

  return null
}

function parseQualified(text: string): Record<string, string> | null {
  const pipeMatch = text.match(/QUALIFIED:\s*battery=([^|]+)\|location=([^|]+)\|solar=([^|]+)\|preference=(\w+)/)
  if (pipeMatch) {
    return {
      battery: pipeMatch[1].trim(),
      location: pipeMatch[2].trim(),
      solar: pipeMatch[3].trim(),
      preference: pipeMatch[4].trim()
    }
  }
  return null
}

// ============ TESTS ============

describe('Battery Detection', () => {
  test('detects "tesla powerwall"', () => {
    expect(detectBattery('I have a Tesla Powerwall')).toBe(true)
  })

  test('detects "lg chem"', () => {
    expect(detectBattery('LG Chem battery')).toBe(true)
  })

  test('detects common misspelling "sungrouw"', () => {
    expect(detectBattery('I have a sungrouw battery')).toBe(true)
  })

  test('detects "byd"', () => {
    expect(detectBattery('My BYD battery')).toBe(true)
  })

  test('does not detect random text', () => {
    expect(detectBattery('I have solar panels on my roof')).toBe(false)
  })

  test('detects brand in longer sentence', () => {
    expect(detectBattery('We installed a Tesla Powerwall 2 last year and love it')).toBe(true)
  })
})

describe('Postcode Detection', () => {
  test('detects valid postcode "2000"', () => {
    expect(detectPostcode('My postcode is 2000')).toBe('2000')
  })

  test('detects postcode in sentence', () => {
    expect(detectPostcode('I live in Sydney 2000 NSW')).toBe('2000')
  })

  test('rejects invalid postcode "0100"', () => {
    expect(detectPostcode('0100')).toBe(null)
  })

  test('accepts edge case postcode "0200"', () => {
    expect(detectPostcode('0200')).toBe('0200')
  })

  test('rejects non-postcode numbers', () => {
    expect(detectPostcode('I have 6.6kW solar')).toBe(null) // .6 breaks the pattern
  })

  test('detects first valid postcode', () => {
    expect(detectPostcode('2482 is my postcode')).toBe('2482')
  })
})

describe('Solar Detection', () => {
  test('detects "6.6kw"', () => {
    expect(detectSolar('6.6kw')).toBe(true)
  })

  test('detects "6.6 kW" with space', () => {
    expect(detectSolar('I have 6.6 kW')).toBe(true)
  })

  test('detects "10 kilowatts"', () => {
    expect(detectSolar('about 10 kilowatts')).toBe(true)
  })

  test('detects "no solar"', () => {
    expect(detectSolar('no solar panels')).toBe(true)
  })

  test('detects "don\'t have solar"', () => {
    expect(detectSolar("I don't have solar yet")).toBe(true)
  })

  test('detects "dont have panels"', () => {
    expect(detectSolar('I dont have panels')).toBe(true)
  })

  test('does not detect random text', () => {
    expect(detectSolar('I have a battery')).toBe(false)
  })
})

describe('Retailer Preference Detection', () => {
  test('detects "happy to switch" as open', () => {
    expect(detectRetailerPref("I'm happy to switch")).toBe('open')
  })

  test('detects "don\'t mind" as open', () => {
    expect(detectRetailerPref("I don't mind switching")).toBe('open')
  })

  test('detects "whatever earns more" as open', () => {
    expect(detectRetailerPref('whatever earns more money')).toBe('open')
  })

  test('detects "keep current" as keep', () => {
    expect(detectRetailerPref('I want to keep my current retailer')).toBe('keep')
  })

  test('detects "stay with" as keep', () => {
    expect(detectRetailerPref('I want to stay with AGL')).toBe('keep')
  })

  test('detects "need advice" as advice', () => {
    expect(detectRetailerPref('I need advice on this')).toBe('advice')
  })

  test('detects "what do you recommend" as advice', () => {
    expect(detectRetailerPref('what do you recommend?')).toBe('advice')
  })

  test('returns null for unclear text', () => {
    expect(detectRetailerPref('I have a tesla')).toBe(null)
  })
})

describe('QUALIFIED Parsing', () => {
  test('parses valid QUALIFIED string', () => {
    const result = parseQualified('QUALIFIED: battery=Tesla Powerwall|location=2000|solar=6.6|preference=open')
    expect(result).toEqual({
      battery: 'Tesla Powerwall',
      location: '2000',
      solar: '6.6',
      preference: 'open'
    })
  })

  test('parses QUALIFIED with "none" solar', () => {
    const result = parseQualified('QUALIFIED: battery=Sonnen|location=3000|solar=none|preference=keep')
    expect(result).toEqual({
      battery: 'Sonnen',
      location: '3000',
      solar: 'none',
      preference: 'keep'
    })
  })

  test('parses QUALIFIED in longer message', () => {
    const result = parseQualified('Great! Let me find the best programs.\nQUALIFIED: battery=LG Chem|location=2482|solar=10|preference=advice')
    expect(result).toEqual({
      battery: 'LG Chem',
      location: '2482',
      solar: '10',
      preference: 'advice'
    })
  })

  test('returns null for invalid format', () => {
    expect(parseQualified('QUALIFIED: {"battery": "Tesla"}')).toBe(null)
  })

  test('returns null for missing fields', () => {
    expect(parseQualified('QUALIFIED: battery=Tesla|location=2000')).toBe(null)
  })
})

describe('Edge Cases', () => {
  test('handles mixed case input', () => {
    expect(detectBattery('TESLA POWERWALL')).toBe(true)
    expect(detectSolar('6.6KW')).toBe(true)
  })

  test('handles extra whitespace', () => {
    expect(detectBattery('  tesla  powerwall  ')).toBe(true)
    expect(detectPostcode('  2000  ')).toBe('2000')
  })

  test('detects multiple pieces of info in one message', () => {
    const text = 'I have a Tesla Powerwall 2, postcode 2000, 6.6kW solar, and happy to switch'
    expect(detectBattery(text)).toBe(true)
    expect(detectPostcode(text)).toBe('2000')
    expect(detectSolar(text)).toBe(true)
    expect(detectRetailerPref(text)).toBe('open')
  })
})
