# VPP Finder Email Strategy

## Overview

Email is the highest-ROI marketing channel for affiliate businesses. A qualified lead who gives their email is worth 10x more than one who doesn't - they can be nurtured, remarketed to, and converted over time.

---

## Part 1: Email Capture Flow

### Current Flow
```
Chat → Qualify → [Optional Email Modal] → Results
```

### Proposed Flow (Mandatory Email)
```
Chat → Qualify → Email Gate → Results + Immediate Email → Drip Sequence
```

### Why Mandatory Email Works Here
1. **High-intent users** - They've already invested 2 minutes in the chat
2. **Clear value exchange** - "Email your results so you don't lose them"
3. **Urgency** - VPP programs change, they need updates
4. **Trust built** - The AI chat has already established rapport

### Email Capture UX

**Before Results (Gate):**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  🎉 Great news! We found 4 VPP programs        │
│     that match your Tesla Powerwall.           │
│                                                 │
│  Enter your email to:                          │
│  ✓ See your personalized results               │
│  ✓ Get earnings estimates emailed to you       │
│  ✓ Receive VPP updates & program changes       │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ your@email.com                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Show My Results →]                           │
│                                                 │
│  🔒 No spam. Unsubscribe anytime.              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Key Elements:**
- Shows they qualified (validation)
- Teases value (4 programs found)
- Clear benefits for giving email
- Privacy reassurance
- No skip option (or small "Skip for now" that shows limited results)

---

## Part 2: Email Sequences

### Sequence 1: Immediate Results Email (T+0)

**Subject:** Your VPP Match Results - [Battery] in [Postcode]

**Content:**
```
Hi [Name/there],

Thanks for using VPP Finder! Here are your personalized results:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR SETUP
• Battery: [Tesla Powerwall 2]
• Location: [2000] ([NSW])
• Solar: [6.6kW]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 YOUR TOP MATCH: [Amber Electric SmartShift]

Estimated earnings: $1,200-1,500/year
Sign-up bonus: None
Retailer lock-in: No

Why it's #1 for you:
• Wholesale price access = highest earning potential
• Works with your Tesla Powerwall
• No retailer switching required

[Sign Up to Amber →] (affiliate link)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OTHER GREAT OPTIONS:

2. AGL VPP - $400-600/year, major retailer reliability
3. Origin Loop - $400/year + $200 bonus
4. ShineHub - $500-700/year, keep current retailer

[View Full Comparison →] (link to results page)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS:
1. Review the programs above
2. Click through to sign up (takes 5-10 min)
3. Start earning within 1-2 weeks

Questions? Reply to this email - we read everything.

Cheers,
The VPP Finder Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VPP Finder | vppfinder.com.au
Unsubscribe: [link]
```

---

### Sequence 2: Follow-Up Drip Campaign

**Day 2 - The Nudge**
```
Subject: Did you sign up yet? Here's why [Program] is worth it

Content:
- Remind them of their top match
- Add social proof (if available)
- Address common objections
- Strong CTA
```

**Day 5 - Educational Value**
```
Subject: How [Name]'s Tesla Powerwall earns $1,200/year (real example)

Content:
- Case study or example scenario
- Break down the math
- Show it's passive income
- Soft CTA
```

**Day 10 - Urgency/FOMO**
```
Subject: [Program] sign-up bonus ending soon

Content:
- Create urgency (if legitimate)
- Or use "rates may change" angle
- Final strong push
```

**Day 21 - Check-In**
```
Subject: Quick question about your VPP search

Content:
- Ask if they signed up
- Offer to help if stuck
- Provide alternative options
- Humanize the brand
```

**Monthly Newsletter (Ongoing)**
```
Subject: VPP Market Update - [Month] 2025

Content:
- New programs or changes
- Rate updates
- Tips for maximizing earnings
- Success stories
- Keeps them warm for future conversion
```

---

## Part 3: Technical Implementation

### Recommended Stack

**Option A: Resend + React Email (Recommended)**
- Cost: Free up to 3,000 emails/month, then $20/month
- Modern, developer-friendly
- Great deliverability
- Easy to set up with Next.js

**Option B: SendGrid**
- Cost: Free up to 100 emails/day
- More established
- Good for transactional + marketing

**Option C: Loops**
- Cost: $49/month
- Purpose-built for SaaS drip campaigns
- Visual sequence builder

### Database Schema Updates

```sql
-- Update emails table
ALTER TABLE emails ADD COLUMN IF NOT EXISTS
  sequence_status VARCHAR(50) DEFAULT 'welcome_sent',
  last_email_sent TIMESTAMP,
  email_count INT DEFAULT 0,
  unsubscribed BOOLEAN DEFAULT FALSE,
  unsubscribed_at TIMESTAMP;

-- Add email_events table for tracking
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID REFERENCES emails(id),
  event_type VARCHAR(50), -- 'sent', 'opened', 'clicked', 'bounced', 'unsubscribed'
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store qualification data with email
ALTER TABLE emails ADD COLUMN IF NOT EXISTS
  battery VARCHAR(100),
  location VARCHAR(10),
  solar DECIMAL,
  preference VARCHAR(20),
  top_match VARCHAR(100);
```

### API Routes Needed

```
POST /api/email/capture     - Save email + trigger welcome sequence
POST /api/email/send        - Send individual email (called by cron)
POST /api/email/unsubscribe - Handle unsubscribe
GET  /api/email/track       - Track opens/clicks (pixel + redirect)
```

### Cron Jobs (Vercel Cron)

```javascript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/email-drip",
      "schedule": "0 9 * * *"  // Daily at 9am AEST
    }
  ]
}
```

---

## Part 4: Compliance

### Australian Privacy Act Requirements
1. **Clear consent** - Checkbox or clear action to subscribe
2. **Easy unsubscribe** - One-click in every email
3. **Privacy policy** - Already have this
4. **Data handling** - Don't sell to third parties

### CAN-SPAM / SPAM Act 2003 (Australia)
1. **Identify sender** - VPP Finder in From field
2. **Physical address** - Required (use registered business address)
3. **Unsubscribe** - Must work within 5 business days
4. **No deceptive subjects** - Be honest about content

### Email Footer Template
```
VPP Finder | ABN: [Your ABN]
[Your Business Address]
You're receiving this because you used VPP Finder.
Unsubscribe | Privacy Policy
```

---

## Part 5: Metrics to Track

### Email Metrics
| Metric | Target | Why |
|--------|--------|-----|
| Capture Rate | >60% | % of qualified users who give email |
| Open Rate | >40% | Industry avg is 20%, we should beat it |
| Click Rate | >10% | Clicks on affiliate links |
| Conversion Rate | >5% | Actually signed up to VPP |
| Unsubscribe Rate | <1% | Per email sent |

### Revenue Attribution
- Track which email drove the signup
- UTM parameters on all affiliate links
- Example: `?utm_source=email&utm_campaign=day2_nudge`

---

## Part 6: Implementation Phases

### Phase 1: Basic Email Capture (This Week)
- [x] Email capture modal exists
- [ ] Make email required before results
- [ ] Store qualification data with email
- [ ] Set up Resend account
- [ ] Send immediate results email

### Phase 2: Drip Sequence (Week 2)
- [ ] Create email templates
- [ ] Set up Vercel cron job
- [ ] Implement 4-email drip sequence
- [ ] Add unsubscribe handling

### Phase 3: Optimization (Ongoing)
- [ ] A/B test subject lines
- [ ] Track open/click rates
- [ ] Refine sequence timing
- [ ] Add monthly newsletter

---

## Part 7: Email Copy Bank

### Subject Lines to Test

**Results Email:**
- Your VPP Match Results - [Battery] in [Postcode]
- We found 4 VPP programs for your [Battery]
- Your battery could earn $[X]/year - here's how

**Day 2 Nudge:**
- Quick question about your VPP search
- Did you see your top match? It's [Program]
- You're leaving $[X]/year on the table

**Educational:**
- How [Battery] owners earn $1,200/year (passive)
- The #1 mistake battery owners make with VPPs
- VPP vs Feed-in Tariff: The $640 difference

**Urgency:**
- [Program] bonus ending [Date]
- VPP rates are changing - lock in now
- Last chance: Your personalized results expire in 7 days

---

## Estimated Impact

### Current State (No Email)
- 10,000 visitors → 1,000 complete chat → 50 signups
- Conversion: 0.5%
- Revenue: $2,500/month (at $50/commission)

### With Email Capture
- 10,000 visitors → 1,000 complete chat → 600 emails captured
- Immediate conversion: 5% = 30 signups
- Drip sequence: 3% of remaining = 17 signups
- Total: 47 signups from email alone
- **Revenue: $2,350/month from email + direct conversions**

### 12-Month Value
- Email list of 7,200 qualified leads
- Monthly newsletter drives ongoing conversions
- **Estimated additional revenue: $500-1,000/month**

---

## Next Steps

1. Set up Resend account (free tier)
2. Make email capture mandatory
3. Build results email template
4. Implement send on capture
5. Test full flow
6. Deploy and monitor

---

*This strategy turns one-time visitors into a owned audience you can monetize repeatedly.*
