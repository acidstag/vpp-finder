# Affiliate Links & Partnerships - Action Items

## Current Status

The VPP Finder currently has **placeholder affiliate links** in `data/programs.ts`. These links are structured correctly but need to be replaced with real signup URLs once partnerships are established.

## What's In Place

✅ **Data Structure**
- Each program has `affiliateLink` field
- Format: `https://provider.com/vpp?ref=vppfinder`
- `commissionRate` field for tracking potential earnings

✅ **Click Tracking**
- `lib/supabase.ts` has `trackProgramClick()` function
- Records: program_id, session_id, timestamp
- Supabase table: `program_clicks`

✅ **UI Implementation**
- "Apply Now" buttons link to affiliate URLs
- External link icon indicates opening in new tab
- `target="_blank" rel="noopener noreferrer"` for security

## What Needs to Be Done

### Phase 1: Verify Real Signup URLs ⚠️

Before reaching out to partners, verify the actual signup pages exist:

| Provider | Current Placeholder | Action Required |
|----------|-------------------|-----------------|
| Amber Electric | `https://amber.com.au/smartshift?ref=vppfinder` | ✓ Verify SmartShift signup page exists |
| Discover Energy | `https://discoverenergy.com.au/vpp?ref=vppfinder` | ✓ Check if they have public VPP page |
| AGL | `https://www.agl.com.au/residential/vpp?ref=vppfinder` | ✓ Confirm VPP program URL |
| Origin Energy | `https://www.originenergy.com.au/vpp?ref=vppfinder` | ✓ Verify Spike VPP signup |
| Energy Australia | `https://www.energyaustralia.com.au/vpp?ref=vppfinder` | ✓ Check PowerResponse page |
| ShineHub | `https://shinehub.com.au/vpp?ref=vppfinder` | ✓ Confirm community VPP signup |
| Reposit Power | `https://repositpower.com/gridcredits?ref=vppfinder` | ✓ Verify GridCredits page |
| Tesla Energy | `https://www.tesla.com/en_AU/energy/vpp?ref=vppfinder` | ✓ Check Tesla VPP signup |
| Simply Energy | `https://www.simplyenergy.com.au/vpp?ref=vppfinder` | ✓ Confirm VPP program page |
| Sonnen | `https://sonnen.com.au/vpp?ref=vppfinder` | ✓ Verify sonnenCommunity signup |
| Power Ledger | `https://powerledger.io/vpp?ref=vppfinder` | ✓ Check TraceX VPP page |
| AGL Solar | `https://www.agl.com.au/solar-vpp?ref=vppfinder` | ✓ Confirm Solar VPP exists |

**Action:**
1. Visit each URL (remove `?ref=vppfinder`)
2. Find correct signup/information page
3. Update `data/programs.ts` with real URLs
4. Test each link manually

### Phase 2: Partnership Outreach 🤝

Once the site is live with traffic and data:

**Email Template for VPP Providers:**

```
Subject: Partnership Opportunity - VPP Finder Referrals

Hi [Provider Name] Team,

I'm reaching out from VPP Finder (vppfinder.com.au), a comparison platform helping Australian households find the right Virtual Power Plant program for their battery.

We've built an AI-powered tool that matches users with VPP programs based on their battery type, location, and preferences. We're currently seeing [X] monthly visitors and have helped [X] Australians compare programs.

We'd love to establish an affiliate partnership to refer qualified leads to [Provider Name]. Our platform includes:
- Detailed program information and comparisons
- Personalized recommendations
- Direct signup links with tracking
- Qualified leads (users already have batteries + solar)

Would you be interested in discussing:
1. Affiliate commission structure
2. Custom referral parameters
3. Co-marketing opportunities
4. Performance tracking and reporting

We believe this could be mutually beneficial - we provide value to our users while driving quality leads to your VPP program.

Looking forward to hearing from you.

Best regards,
[Your Name]
VPP Finder
```

**Required From Each Partner:**
- Affiliate/referral program terms
- Custom tracking parameter (e.g., `?ref=vppfinder` or `?partner=vppfinder`)
- Commission rate or per-lead payment
- Conversion tracking method
- Signup confirmation webhooks (if available)

### Phase 3: Implementation Checklist 📋

Once partnerships are established:

- [ ] Update `affiliateLink` in `data/programs.ts` with real partner URLs
- [ ] Update `commissionRate` with actual agreed rates
- [ ] Add partner-specific tracking parameters
- [ ] Test all affiliate links in production
- [ ] Set up conversion tracking (if provided by partners)
- [ ] Create admin dashboard to monitor:
  - Clicks per program
  - Estimated commission earnings
  - Conversion rates (if available)
- [ ] Add disclaimer: "VPP Finder may earn a commission when you sign up through our links"
- [ ] Update Privacy Policy with affiliate disclosure
- [ ] Add "Partnerships" page explaining affiliate relationships

### Phase 4: Optimization 📊

After links are live:

- [ ] Track click-through rates per program
- [ ] Monitor which programs convert best
- [ ] A/B test CTA button text ("Apply Now" vs "Get Started" vs "Join Program")
- [ ] Test button placement (card only vs card + comparison table)
- [ ] Add "Why We Recommend This" section for top match
- [ ] Implement exit-intent popup for users leaving without clicking
- [ ] Add email capture for users who want to "save results"

## Technical Notes

### Current Implementation

**Program Card Component** (`components/comparison/program-card.tsx`):
```tsx
<Button asChild className="w-full">
  <Link
    href={match.program.affiliateLink}
    target="_blank"
    rel="noopener noreferrer"
  >
    Apply Now
    <ExternalLink className="w-4 h-4 ml-2" />
  </Link>
</Button>
```

**Click Tracking** (`lib/supabase.ts`):
```typescript
export async function trackProgramClick(
  programId: string,
  sessionId: string | null
): Promise<void> {
  try {
    await supabase.from('program_clicks').insert({
      program_id: programId,
      session_id: sessionId,
    })
  } catch (error) {
    console.error('Error tracking program click:', error)
  }
}
```

### Enhancement Opportunities

1. **Add onClick Tracking:**
```tsx
<Button
  asChild
  className="w-full"
  onClick={() => trackProgramClick(match.program.id, sessionId)}
>
```

2. **Add Loading State:**
```tsx
const [isNavigating, setIsNavigating] = useState(false)

<Button
  disabled={isNavigating}
  onClick={() => {
    setIsNavigating(true)
    trackProgramClick(match.program.id, sessionId)
  }}
>
  {isNavigating ? 'Opening...' : 'Apply Now'}
</Button>
```

3. **Add Confirmation Modal:**
```tsx
// Before navigating to partner site:
"You're about to visit [Provider]. You'll be redirected to their website to complete signup."
```

## Legal Requirements ⚖️

Before activating affiliate links:

- [ ] Add affiliate disclosure to footer
- [ ] Update Terms of Service with affiliate policy
- [ ] Update Privacy Policy with:
  - Click tracking disclosure
  - Commission relationship disclosure
  - No impact on recommendations statement
- [ ] Add clear disclosure on results page:
  "We may earn a commission if you sign up through our links. This does not affect our recommendations, which are based solely on your profile and program features."

## Monitoring & Reporting 📈

Set up weekly/monthly reports tracking:
- Total clicks per program
- Click-through rate (views → clicks)
- Estimated commission earnings
- Most clicked programs vs highest rated programs
- Geographic distribution of clicks
- Time to click (how long users research before clicking)

## Questions to Ask Partners

1. Do you have an existing affiliate program?
2. What's the commission structure? (per signup, per kWh exported, lifetime value share?)
3. What's the cookie duration? (how long after click do you track conversions?)
4. Do you provide conversion tracking APIs or webhooks?
5. How do you handle attribution if a user clicks multiple times?
6. What's the average approval time for new signups?
7. Can you provide monthly performance reports?
8. Are there any prohibited marketing practices?
9. Do you offer increased commissions for volume?
10. Can we use your logo and brand assets?

---

## Summary

**Before Partnership Outreach:**
1. Build traffic (aim for 1,000+ monthly users)
2. Gather data on which programs are most popular
3. Verify all signup URLs are correct
4. Add legal disclosures
5. Set up proper click tracking

**Current Placeholder Links:**
- All links use `?ref=vppfinder` parameter
- This will likely need to change based on each partner's tracking system
- Some may use `?source=`, `?partner=`, or `?campaign=`
- Others may require unique tracking IDs per account

**Next Immediate Action:**
Manually verify each provider's signup page exists and update URLs in `data/programs.ts` with the correct paths (even without ref parameters yet).
