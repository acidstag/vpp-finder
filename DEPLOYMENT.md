# VPP Finder - Deployment Guide

Complete guide to deploying VPP Finder to production.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

Create a `.env.production` file with:

```bash
# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-your-production-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jrpzfphrzurzmzrahzqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

### 2. Supabase Database Setup

**Step 1:** Go to Supabase SQL Editor
- https://supabase.com/dashboard/project/jrpzfphrzurzmzrahzqu/sql

**Step 2:** Run the schema
- Copy entire contents of `supabase/schema.sql`
- Paste into SQL Editor
- Click **Run** (or Cmd/Ctrl + Enter)

**Step 3:** Verify tables created
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- analytics_events
- comparisons
- conversations
- feedback
- messages
- program_clicks
- users

**Step 4:** Test insert
```sql
INSERT INTO program_clicks (program_id, program_name, provider, source_page)
VALUES ('test', 'Test Program', 'Test Provider', 'deployment-test');

SELECT * FROM program_clicks ORDER BY created_at DESC LIMIT 1;
```

### 3. Domain Setup

**Purchase domain:** vppfinder.com.au (or your chosen domain)

**DNS Configuration:**
- Type: A Record
- Name: @
- Value: 76.76.21.21 (Vercel)

- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

---

## 🚀 Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

**Step 1:** Push to GitHub
```bash
cd /Users/leviloveridge/dev/hero-website-builder/tools/vpp-finder
git init
git add .
git commit -m "Initial commit - VPP Finder production ready"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/vpp-finder.git
git push -u origin main
```

**Step 2:** Connect to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or adjust if needed)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

**Step 3:** Add Environment Variables in Vercel
- Go to Project Settings → Environment Variables
- Add all variables from `.env.production`
- Make sure `NEXT_PUBLIC_*` variables are available to both Server & Edge & Client

**Step 4:** Deploy
- Click **Deploy**
- Wait 2-3 minutes for build
- Get deployment URL (e.g., vpp-finder.vercel.app)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Follow prompts to link project
```

---

## 🌐 Custom Domain Setup (Vercel)

**Step 1:** Add domain in Vercel
- Go to Project Settings → Domains
- Add `vppfinder.com.au`
- Add `www.vppfinder.com.au`

**Step 2:** Configure DNS
Vercel will show you the DNS records to add. Typically:
- A record: `76.76.21.21`
- CNAME for www: `cname.vercel-dns.com`

**Step 3:** Wait for propagation
- DNS can take 1-48 hours
- Check status in Vercel dashboard
- Vercel auto-provisions SSL certificate

---

## 📊 Post-Deployment Setup

### 1. Verify Deployment

**Test all pages:**
- ✅ Homepage: https://vppfinder.com.au
- ✅ Chat: https://vppfinder.com.au/chat
- ✅ Results: https://vppfinder.com.au/results?battery=tesla&location=2000&solar=6.6&preference=open
- ✅ Calculator: https://vppfinder.com.au/calculator

**Test functionality:**
- ✅ AI chat works and responds
- ✅ Chat qualification redirects to results
- ✅ Comparison table switches between cards/table
- ✅ Filters work (Top 4, Compatible, All)
- ✅ Mobile menu opens/closes
- ✅ All images load

### 2. Enable Analytics

**Vercel Analytics (Recommended):**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Google Analytics (Optional):**
- Create GA4 property: https://analytics.google.com
- Get Measurement ID (G-XXXXXXXXXX)
- Add to `.env.production`

### 3. Enable Web Vitals Monitoring

Add to `app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 4. SEO Verification

**Google Search Console:**
1. Go to https://search.google.com/search-console
2. Add property: vppfinder.com.au
3. Verify via DNS TXT record or HTML file
4. Submit sitemap: https://vppfinder.com.au/sitemap.xml

**Update `app/layout.tsx` with verification:**
```typescript
export const metadata = {
  verification: {
    google: 'your-verification-code-here',
  },
}
```

---

## 🔒 Security Checklist

- ✅ **Environment variables:** Never commit API keys to git
- ✅ **HTTPS:** Auto-enabled by Vercel
- ✅ **Security headers:** Configured in next.config.js
- ✅ **RLS enabled:** Supabase Row Level Security active
- ✅ **API keys:** Using anon key for public access
- ✅ **CORS:** Handled by Next.js API routes

---

## 📈 Monitoring & Maintenance

### Daily Checks
- ✅ Vercel deployment status
- ✅ Supabase database health
- ✅ API usage (Anthropic dashboard)

### Weekly Tasks
- Check analytics for user behavior
- Review program_clicks table for commission tracking
- Monitor conversation completion rates

### Monthly Tasks
- Update VPP program data if providers change
- Review and optimize based on analytics
- Check for Next.js updates

### Database Queries for Monitoring

**Daily stats:**
```sql
SELECT * FROM daily_stats
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;
```

**Top programs:**
```sql
SELECT * FROM program_performance
ORDER BY total_clicks DESC
LIMIT 10;
```

**Conversion rate:**
```sql
SELECT
  COUNT(*) FILTER (WHERE application_started = true) as applications,
  COUNT(*) as total_clicks,
  ROUND(100.0 * COUNT(*) FILTER (WHERE application_started = true) / COUNT(*), 2) as conversion_rate
FROM program_clicks
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Error: Environment variable missing**
- Check Vercel dashboard → Settings → Environment Variables
- Make sure `NEXT_PUBLIC_*` vars are set for all environments

### Runtime Errors

**Chat not responding:**
- Check Anthropic API key is valid
- Check API usage limits: https://console.anthropic.com
- Check browser console for errors

**Database errors:**
- Verify Supabase project is active
- Check RLS policies allow anonymous inserts
- Review Supabase logs: Project → Logs → Database

**Images not loading:**
- Check `public/` directory has all pattern images
- Verify next.config.js image config
- Check Network tab in browser dev tools

### Performance Issues

**Slow page loads:**
```bash
# Run Lighthouse audit
npm run build
npm start
# Open Chrome DevTools → Lighthouse → Run audit
```

**High API costs:**
- Review conversation lengths in database
- Consider caching common responses
- Monitor token usage in Anthropic dashboard

---

## 📦 Rollback Plan

If deployment has critical issues:

**Option 1: Rollback in Vercel**
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → Promote to Production

**Option 2: Revert Git Commit**
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys the revert
```

---

## 🎯 Success Criteria

Deployment is successful when:

- ✅ All pages load without errors
- ✅ AI chat responds within 3 seconds
- ✅ Lighthouse score: Performance 90+, SEO 95+
- ✅ Mobile responsive on all devices
- ✅ SSL certificate active (https://)
- ✅ Sitemap accessible at /sitemap.xml
- ✅ robots.txt accessible
- ✅ Database queries execute successfully
- ✅ Analytics tracking works

---

## 📞 Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Anthropic Docs:** https://docs.anthropic.com

---

## 🚀 You're Ready!

Your VPP Finder is production-ready. Here's what you've built:

✅ AI-powered VPP matching chat
✅ Comprehensive comparison table
✅ 12 VPP programs with detailed data
✅ Affiliate tracking infrastructure
✅ Enterprise minimal design
✅ Mobile responsive
✅ SEO optimized
✅ Performance optimized
✅ Error handling
✅ Analytics ready

**Next steps:**
1. Deploy to Vercel
2. Connect domain
3. Add analytics
4. Monitor and iterate

Good luck! 🎉
