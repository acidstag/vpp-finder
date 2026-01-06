# Chat Edge Cases & Production Readiness Audit

## Current Flow Analysis

**Happy Path:**
1. User says they have a battery → AI asks for brand
2. User provides brand → AI asks for postcode
3. User provides postcode → AI asks for solar size
4. User provides kW → AI asks retailer preference
5. User answers preference → QUALIFIED trigger → Redirect to results

**Time to qualification:** 5 exchanges (too fast? or appropriate?)

---

## Edge Cases to Handle

### 1. Battery Information
| Scenario | Current Behavior | Expected Behavior |
|----------|-----------------|-------------------|
| "I have a tesla" | ✅ Detected | Works |
| "powerwall 2" | ✅ Detected | Works |
| "I have a 13.5kwh battery" | ❌ Not detected | Should ask for brand |
| "My battery is from BYD" | ⚠️ May not detect | Should work |
| "I don't know the brand" | ❌ Unknown | Should offer help/skip |
| "I'm researching" (no battery yet) | ⚠️ Unclear flow | Should still help |
| Misspellings: "teslar", "sungrouw" | ❌ Not detected | Should fuzzy match |

### 2. Location/Postcode
| Scenario | Current Behavior | Expected Behavior |
|----------|-----------------|-------------------|
| "2000" | ✅ Detected | Works |
| "Sydney" | ❌ Not detected | Should ask for postcode |
| "NSW" | ❌ Not detected | Should ask for postcode |
| "I'm in Melbourne" | ❌ Not detected | Should ask for postcode |
| "2000 NSW" | ✅ Detected | Works |
| Invalid postcode "9999" | ✅ Accepted | Should validate AU postcodes |
| "I'd rather not say" | ❌ Unknown | Should explain why needed |

### 3. Solar System
| Scenario | Current Behavior | Expected Behavior |
|----------|-----------------|-------------------|
| "6.6kw" | ✅ Detected | Works |
| "6.6 kW" | ✅ Detected | Works |
| "about 7 kilowatts" | ⚠️ May detect | Should work |
| "no solar" | ✅ Detected | Works |
| "I don't have panels" | ⚠️ May not detect | Should work |
| "not sure, maybe 5?" | ⚠️ Unclear | Should accept approximate |
| "20 panels" | ❌ Not detected | Should convert or ask kW |
| "big system" / "small system" | ❌ Not detected | Should ask for kW |

### 4. Retailer Preference
| Scenario | Current Behavior | Expected Behavior |
|----------|-----------------|-------------------|
| "happy to switch" | ✅ Detected | Works |
| "I want to keep AGL" | ⚠️ May detect | Should work |
| "whatever earns more" | ❌ Not detected | Should interpret as "open" |
| "I don't care" | ❌ Not detected | Should interpret as "open" |
| "what do you recommend?" | ⚠️ May detect | Should give advice then ask |

### 5. Conversation Flow Issues
| Scenario | Current Behavior | Expected Behavior |
|----------|-----------------|-------------------|
| User provides multiple info at once | ⚠️ Partial | Should handle gracefully |
| User goes back to change answer | ❌ Not handled | Should allow corrections |
| User asks question mid-flow | ⚠️ May break flow | Should answer then continue |
| User says "start over" | ❌ Not handled | Should reset conversation |
| User is confused/frustrated | ❌ Not detected | Should offer help |
| Very short responses ("yes", "no") | ⚠️ May not extract info | Should ask follow-up |

### 6. Error States
| Scenario | Current Behavior | Expected Behavior |
|----------|-----------------|-------------------|
| API timeout | Shows error | Should retry or offer alternative |
| Rate limited | Shows error | Should queue or inform user |
| Invalid QUALIFIED format | Silent fail | Should log and continue chat |
| Empty AI response | Unknown | Should handle gracefully |

---

## UX Concerns

### Qualification Timing
**Current:** 5 exchanges to qualify
**Concern:** May feel rushed, not building enough trust

**Options:**
1. **Keep current** - Fast is good for conversions
2. **Add optional context** - "Would you like to know more about how VPPs work before we continue?"
3. **Show value earlier** - After battery: "Great! Tesla Powerwalls can earn $600-1,500/year in a VPP"

### Missing Trust Builders
- No explanation of what happens with their info
- No "why do you need my postcode?" handling
- No privacy reassurance

### Retention Issues
- If user doesn't qualify (no battery), what happens?
- If user abandons mid-flow, no follow-up
- No way to save progress and return later

---

## Recommended Fixes

### Priority 1: Critical Bugs
1. [ ] Add more battery brand detection (BYD, GoodWe, Fronius, etc.)
2. [ ] Handle "I don't know my brand" gracefully
3. [ ] Validate Australian postcodes (1000-9999, certain ranges)
4. [ ] Handle city/state names → ask for postcode
5. [ ] Better solar detection ("no panels", "don't have solar", panel count)

### Priority 2: UX Improvements
1. [ ] Add value messaging after each step
2. [ ] Handle "why do you need this?" questions
3. [ ] Allow corrections ("actually my battery is...")
4. [ ] Handle multi-info responses ("Tesla, Sydney, 6.6kW, happy to switch")
5. [ ] Add "start over" command

### Priority 3: Edge Case Handling
1. [ ] Fuzzy matching for misspellings
2. [ ] Handle frustrated users
3. [ ] Handle "I'm just browsing" users
4. [ ] Panel count to kW conversion hint
5. [ ] Better handling of approximate values

### Priority 4: Error Resilience
1. [ ] Retry logic for API failures
2. [ ] Graceful degradation
3. [ ] Logging for debugging
4. [ ] Analytics for drop-off points

---

## Test Scenarios to Write

```typescript
// test/chat.test.ts

describe('Chat Qualification Flow', () => {
  describe('Battery Detection', () => {
    test('detects "tesla powerwall"')
    test('detects "lg chem"')
    test('detects "sonnen" with various spellings')
    test('detects battery mentioned with size "13.5kwh tesla"')
    test('handles "I dont know my battery brand"')
    test('handles "researching, considering tesla"')
  })

  describe('Postcode Detection', () => {
    test('detects 4-digit postcode "2000"')
    test('extracts postcode from "Sydney 2000"')
    test('asks for postcode when given city name')
    test('validates postcode is in valid AU range')
  })

  describe('Solar Detection', () => {
    test('detects "6.6kw"')
    test('detects "6.6 kW" with space')
    test('detects "no solar"')
    test('detects "dont have panels"')
    test('handles "about 7kw" approximate')
    test('handles "20 panels" and asks for kW')
  })

  describe('Retailer Preference', () => {
    test('detects "happy to switch"')
    test('detects "keep current"')
    test('detects "dont care" as open')
    test('detects "need advice"')
  })

  describe('QUALIFIED Output', () => {
    test('triggers after all 4 pieces collected')
    test('correct format: battery=X|location=Y|solar=Z|preference=W')
    test('handles "none" for solar correctly')
    test('redirects to results page')
  })

  describe('Edge Cases', () => {
    test('handles all info in one message')
    test('handles corrections mid-flow')
    test('handles "start over" command')
    test('handles off-topic questions')
    test('handles frustrated user language')
  })

  describe('Error Handling', () => {
    test('retries on API timeout')
    test('shows friendly error on failure')
    test('logs errors for debugging')
  })
})
```

---

## Implementation Plan

1. **Phase 1:** Fix critical detection bugs (30 min)
2. **Phase 2:** Add UX improvements to prompt (20 min)
3. **Phase 3:** Write test file with key scenarios (30 min)
4. **Phase 4:** Manual testing of all edge cases (20 min)
