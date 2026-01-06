-- VPP Finder Database Schema
-- Supabase PostgreSQL Schema
-- Last Updated: 2025-11-10

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- Tracks users who interact with the platform
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Identity
  email TEXT UNIQUE,
  name TEXT,

  -- Location
  postcode TEXT,
  state TEXT,

  -- Setup
  battery_brand TEXT,
  battery_capacity NUMERIC,
  solar_capacity NUMERIC,

  -- Preferences
  retailer_preference TEXT CHECK (retailer_preference IN ('keep', 'open', 'advice')),

  -- Metadata
  source TEXT, -- 'chat', 'calculator', 'direct'
  referrer TEXT,
  user_agent TEXT
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- =====================================================
-- CONVERSATIONS TABLE
-- Tracks AI chat conversations
-- =====================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- User relation
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Session
  session_id TEXT UNIQUE,
  ip_address INET,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  message_count INTEGER DEFAULT 0,

  -- Profile extracted
  battery_identified BOOLEAN DEFAULT FALSE,
  location_identified BOOLEAN DEFAULT FALSE,
  solar_identified BOOLEAN DEFAULT FALSE,
  preference_identified BOOLEAN DEFAULT FALSE,

  -- Outcome
  recommendation_shown BOOLEAN DEFAULT FALSE,
  application_started BOOLEAN DEFAULT FALSE,

  -- Metadata
  user_agent TEXT,
  referrer TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);

-- =====================================================
-- MESSAGES TABLE
-- Stores individual chat messages
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Conversation relation
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Metadata
  token_count INTEGER,
  model TEXT, -- 'claude-3-5-sonnet-20241022'
  latency_ms INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- =====================================================
-- PROGRAM_CLICKS TABLE
-- Tracks affiliate link clicks for commission tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS program_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,

  -- Program info
  program_id TEXT NOT NULL, -- e.g., 'amber-smartshift'
  program_name TEXT,
  provider TEXT,

  -- Click context
  source_page TEXT, -- 'results', 'comparison', 'homepage'
  match_percentage NUMERIC,

  -- Session
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,

  -- Conversion tracking
  application_started BOOLEAN DEFAULT FALSE,
  application_completed BOOLEAN DEFAULT FALSE,
  signup_confirmed BOOLEAN DEFAULT FALSE,
  signup_confirmed_at TIMESTAMP WITH TIME ZONE,

  -- Commission
  commission_amount NUMERIC,
  commission_status TEXT CHECK (commission_status IN ('pending', 'approved', 'paid', 'rejected'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_program_clicks_program_id ON program_clicks(program_id);
CREATE INDEX IF NOT EXISTS idx_program_clicks_user_id ON program_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_program_clicks_created_at ON program_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_clicks_commission_status ON program_clicks(commission_status);

-- =====================================================
-- COMPARISONS TABLE
-- Tracks when users compare multiple programs
-- =====================================================
CREATE TABLE IF NOT EXISTS comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,

  -- Programs compared
  program_ids TEXT[] NOT NULL, -- Array of program IDs

  -- Context
  view_mode TEXT, -- 'table', 'cards'
  filter_mode TEXT, -- 'top', 'available', 'all'

  -- Session
  session_id TEXT,
  duration_seconds INTEGER -- How long they viewed comparison
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_comparisons_user_id ON comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_created_at ON comparisons(created_at DESC);

-- =====================================================
-- FEEDBACK TABLE
-- User feedback and ratings
-- =====================================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,

  -- Feedback
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  -- Type
  feedback_type TEXT, -- 'recommendation', 'chat', 'comparison', 'general'

  -- Metadata
  page TEXT,
  session_id TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

-- =====================================================
-- ANALYTICS_EVENTS TABLE
-- General event tracking for analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Event
  event_name TEXT NOT NULL,
  event_category TEXT, -- 'navigation', 'interaction', 'conversion'

  -- Context
  page_path TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT,

  -- Properties (JSONB for flexibility)
  properties JSONB,

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  referrer TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- Automatically updates updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS for data protection
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read access for analytics (admin only writes)
-- Note: Adjust these policies based on your auth setup

-- Allow anonymous inserts for tracking
CREATE POLICY "Allow anonymous inserts" ON program_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON comparisons
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON feedback
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- HELPFUL VIEWS
-- Pre-computed views for common queries
-- =====================================================

-- Daily stats view
CREATE OR REPLACE VIEW daily_stats AS
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT program_id) as programs_clicked,
  COUNT(*) FILTER (WHERE application_started = true) as applications_started,
  COUNT(*) FILTER (WHERE signup_confirmed = true) as signups_confirmed,
  SUM(commission_amount) FILTER (WHERE commission_status = 'approved') as commission_earned
FROM program_clicks
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Program performance view
CREATE OR REPLACE VIEW program_performance AS
SELECT
  program_id,
  program_name,
  provider,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) FILTER (WHERE application_started = true) as applications,
  COUNT(*) FILTER (WHERE signup_confirmed = true) as signups,
  ROUND(AVG(match_percentage), 1) as avg_match_percentage,
  SUM(commission_amount) as total_commission
FROM program_clicks
GROUP BY program_id, program_name, provider
ORDER BY total_clicks DESC;

-- Conversation funnel view
CREATE OR REPLACE VIEW conversation_funnel AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_conversations,
  COUNT(*) FILTER (WHERE battery_identified = true) as with_battery,
  COUNT(*) FILTER (WHERE location_identified = true) as with_location,
  COUNT(*) FILTER (WHERE recommendation_shown = true) as shown_recommendations,
  COUNT(*) FILTER (WHERE application_started = true) as started_application,
  COUNT(*) FILTER (WHERE status = 'completed') as completed
FROM conversations
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

-- Top performing programs this month
-- SELECT * FROM program_performance WHERE total_clicks > 0 ORDER BY signups DESC LIMIT 10;

-- Daily conversion rate
-- SELECT date,
--        total_clicks,
--        applications_started,
--        ROUND(100.0 * applications_started / NULLIF(total_clicks, 0), 2) as conversion_rate
-- FROM daily_stats
-- WHERE date >= CURRENT_DATE - INTERVAL '30 days'
-- ORDER BY date DESC;

-- Conversation completion rate
-- SELECT
--   COUNT(*) FILTER (WHERE status = 'completed') as completed,
--   COUNT(*) as total,
--   ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'completed') / COUNT(*), 2) as completion_rate
-- FROM conversations
-- WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';

-- Most clicked programs by state
-- SELECT
--   u.state,
--   pc.program_id,
--   pc.program_name,
--   COUNT(*) as clicks
-- FROM program_clicks pc
-- JOIN users u ON pc.user_id = u.id
-- WHERE u.state IS NOT NULL
-- GROUP BY u.state, pc.program_id, pc.program_name
-- ORDER BY u.state, clicks DESC;
