# Supabase Setup Guide

This guide will help you set up the Supabase database for VPP Finder.

## Quick Setup

### 1. Create Tables

1. Go to your Supabase project: https://supabase.com/dashboard/project/jrpzfphrzurzmzrahzqu
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `schema.sql` and paste it
5. Click **Run** (or press Cmd/Ctrl + Enter)

This will create all tables, indexes, views, and policies.

### 2. Verify Setup

After running the schema, verify the tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- `users`
- `conversations`
- `messages`
- `program_clicks`
- `comparisons`
- `feedback`
- `analytics_events`

### 3. Test Insert

Test that tracking is working:

```sql
-- Test program click tracking
INSERT INTO program_clicks (
  program_id,
  program_name,
  provider,
  source_page,
  session_id
) VALUES (
  'amber-smartshift',
  'SmartShift',
  'Amber Electric',
  'test',
  'test-session-123'
);

-- Verify
SELECT * FROM program_clicks ORDER BY created_at DESC LIMIT 1;
```

## Database Schema Overview

### Core Tables

#### `users`
Stores user profiles and battery setup information.

**Key Fields:**
- `email`, `name` - User identity
- `battery_brand`, `battery_capacity`, `solar_capacity` - Setup details
- `postcode`, `state` - Location
- `retailer_preference` - keep/open/advice

#### `conversations`
Tracks AI chat sessions.

**Key Fields:**
- `session_id` - Unique session identifier
- `status` - active/completed/abandoned
- `battery_identified`, `location_identified`, etc. - Profile completion tracking
- `recommendation_shown`, `application_started` - Conversion funnel

#### `messages`
Individual chat messages within conversations.

**Key Fields:**
- `conversation_id` - Links to conversation
- `role` - user/assistant/system
- `content` - Message text
- `token_count`, `latency_ms` - Performance tracking

#### `program_clicks` ⭐ IMPORTANT
Tracks affiliate link clicks for commission tracking.

**Key Fields:**
- `program_id` - Which VPP program
- `source_page` - Where they clicked from
- `match_percentage` - How good the match was
- `application_started`, `signup_confirmed` - Conversion tracking
- `commission_amount`, `commission_status` - Revenue tracking

#### `comparisons`
Tracks when users view the comparison table.

**Key Fields:**
- `program_ids` - Array of programs compared
- `view_mode` - table/cards
- `duration_seconds` - How long they viewed

#### `feedback`
User ratings and feedback.

#### `analytics_events`
General event tracking with flexible JSONB properties.

### Helpful Views

#### `daily_stats`
Pre-computed daily metrics:
- Unique sessions
- Total clicks
- Applications started
- Signups confirmed
- Commission earned

```sql
SELECT * FROM daily_stats WHERE date >= CURRENT_DATE - INTERVAL '7 days';
```

#### `program_performance`
Per-program metrics:
- Click counts
- Conversion rates
- Average match percentage
- Total commission

```sql
SELECT * FROM program_performance ORDER BY total_clicks DESC LIMIT 10;
```

#### `conversation_funnel`
Daily conversation funnel metrics:
- Total conversations
- Profile completion stages
- Recommendations shown
- Applications started

```sql
SELECT * FROM conversation_funnel WHERE date >= CURRENT_DATE - INTERVAL '30 days';
```

## Using the Database in Code

The `lib/supabase.ts` file already has helper functions:

### Track Program Clicks

```typescript
import { trackProgramClick } from '@/lib/supabase'

// When user clicks "Apply" button
await trackProgramClick('amber-smartshift', userId)
```

### Track Comparisons

```typescript
import { supabase } from '@/lib/supabase'

await supabase.from('comparisons').insert({
  user_id: userId,
  program_ids: ['amber-smartshift', 'origin-spike'],
  view_mode: 'table',
  filter_mode: 'top'
})
```

### Track Conversations

```typescript
// Start conversation
const { data: conversation } = await supabase
  .from('conversations')
  .insert({
    session_id: sessionId,
    status: 'active'
  })
  .select()
  .single()

// Update as profile is collected
await supabase
  .from('conversations')
  .update({
    battery_identified: true,
    location_identified: true,
    message_count: 5
  })
  .eq('id', conversationId)

// Save message
await supabase.from('messages').insert({
  conversation_id: conversationId,
  role: 'user',
  content: 'I have a Tesla Powerwall 2'
})
```

### Track Analytics Events

```typescript
await supabase.from('analytics_events').insert({
  event_name: 'view_comparison_table',
  event_category: 'interaction',
  page_path: '/results',
  session_id: sessionId,
  properties: {
    filter_mode: 'top',
    view_mode: 'table',
    programs_shown: 4
  }
})
```

## Useful Queries

### Top Programs This Week
```sql
SELECT
  program_id,
  program_name,
  COUNT(*) as clicks,
  COUNT(*) FILTER (WHERE application_started = true) as applications,
  ROUND(100.0 * COUNT(*) FILTER (WHERE application_started = true) / COUNT(*), 2) as conversion_rate
FROM program_clicks
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY program_id, program_name
ORDER BY clicks DESC;
```

### Conversion Funnel
```sql
SELECT
  COUNT(DISTINCT c.id) as total_conversations,
  COUNT(DISTINCT c.id) FILTER (WHERE c.recommendation_shown = true) as saw_recommendations,
  COUNT(DISTINCT pc.id) as total_clicks,
  COUNT(DISTINCT pc.id) FILTER (WHERE pc.application_started = true) as started_application,
  COUNT(DISTINCT pc.id) FILTER (WHERE pc.signup_confirmed = true) as confirmed_signups
FROM conversations c
LEFT JOIN program_clicks pc ON c.id = pc.conversation_id
WHERE c.created_at >= CURRENT_DATE - INTERVAL '30 days';
```

### Revenue by Program
```sql
SELECT
  program_id,
  program_name,
  COUNT(*) FILTER (WHERE signup_confirmed = true) as signups,
  SUM(commission_amount) FILTER (WHERE commission_status = 'approved') as revenue_approved,
  SUM(commission_amount) FILTER (WHERE commission_status = 'paid') as revenue_paid
FROM program_clicks
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY program_id, program_name
ORDER BY revenue_approved DESC;
```

### User Activity by State
```sql
SELECT
  u.state,
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT pc.id) as total_clicks,
  ROUND(AVG(pc.match_percentage), 1) as avg_match
FROM users u
LEFT JOIN program_clicks pc ON u.id = pc.user_id
WHERE u.state IS NOT NULL
GROUP BY u.state
ORDER BY total_users DESC;
```

## Security (Row Level Security)

All tables have RLS enabled with policies that:
- Allow anonymous inserts (for tracking without auth)
- Require authentication for updates/deletes (when implemented)

To add user authentication later, update the RLS policies in the Supabase dashboard.

## Next Steps

1. **Run the schema** in Supabase SQL Editor
2. **Test with sample data** using the test insert above
3. **Integrate tracking** in the chat and results pages
4. **Monitor in Supabase Dashboard** → Table Editor to see live data
5. **Set up Supabase webhooks** (optional) for real-time commission updates

## Performance Tips

- All critical columns have indexes
- Use the pre-computed views for dashboard/analytics
- Consider partitioning `program_clicks` table by month if it grows large (>1M rows)
- Set up automated backups in Supabase settings

## Troubleshooting

### Error: "permission denied for table X"
- Ensure RLS policies are correctly applied
- Check that the `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in `.env.local`

### Error: "duplicate key value violates unique constraint"
- Check if you're trying to insert duplicate `session_id` or `email`
- Use `ON CONFLICT` clause for upserts

### Slow queries
- Check query execution plan: `EXPLAIN ANALYZE SELECT ...`
- Verify indexes are being used
- Consider adding composite indexes for frequent query patterns

## Support

- Supabase Docs: https://supabase.com/docs
- SQL Reference: https://www.postgresql.org/docs/
- Project Dashboard: https://supabase.com/dashboard/project/jrpzfphrzurzmzrahzqu
