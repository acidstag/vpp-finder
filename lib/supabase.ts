import { createClient } from '@supabase/supabase-js'
import { env } from './env'

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Types for our database
export interface User {
  id: string
  created_at: string
  email?: string
  battery_type?: string
  location?: string
  solar_size?: number
}

export interface Conversation {
  id: string
  user_id?: string
  messages: any[]
  qualified: boolean
  created_at: string
}

export interface ProgramClick {
  id: string
  user_id?: string
  program_id: string
  clicked_at: string
  referrer?: string
}

export interface Comparison {
  id: string
  user_id?: string
  programs_compared: string[]
  created_at: string
}

export interface ProgramClickOptions {
  sessionId?: string
  conversationId?: string
  matchPercentage?: number
  sourcePage?: string
  programName?: string
  provider?: string
}

// Helper functions for analytics
export async function trackProgramClick(
  programId: string,
  options: ProgramClickOptions = {}
) {
  try {
    const { error } = await supabase.from('program_clicks').insert({
      program_id: programId,
      program_name: options.programName,
      provider: options.provider,
      session_id: options.sessionId,
      conversation_id: options.conversationId,
      match_percentage: options.matchPercentage,
      source_page: options.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : null),
      referrer: typeof window !== 'undefined' ? document.referrer : null,
      clicked_at: new Date().toISOString(),
    })

    if (error) console.error('Error tracking click:', error)
  } catch (err) {
    console.error('Error tracking click:', err)
  }
}

export async function trackComparison(programs: string[], sessionId?: string) {
  try {
    const { error } = await supabase.from('comparisons').insert({
      program_ids: programs, // Schema uses program_ids not programs_compared
      session_id: sessionId,
      created_at: new Date().toISOString(),
    })

    if (error) console.error('Error tracking comparison:', error)
  } catch (err) {
    console.error('Error tracking comparison:', err)
  }
}

export async function saveConversation(
  messages: any[],
  qualified: boolean,
  sessionId?: string,
  conversationId?: string
) {
  try {
    // First, create the conversation record
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        session_id: sessionId,
        status: qualified ? 'completed' : 'abandoned',
        message_count: messages.length,
        battery_identified: qualified,
        location_identified: qualified,
        solar_identified: qualified,
        recommendation_shown: qualified,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (convError) {
      console.error('Error saving conversation:', convError)
      return
    }

    // Then save individual messages (if conversation was created successfully)
    if (conversation && messages.length > 0) {
      const messageRecords = messages.map(msg => ({
        conversation_id: conversation.id,
        role: msg.role,
        content: msg.content,
        created_at: msg.timestamp || new Date().toISOString(),
      }))

      const { error: msgError } = await supabase
        .from('messages')
        .insert(messageRecords)

      if (msgError) console.error('Error saving messages:', msgError)
    }

    return conversation
  } catch (err) {
    console.error('Error saving conversation:', err)
  }
}

export async function saveEmail(
  email: string,
  sessionId?: string,
  source: string = 'chat'
) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      // User exists, just update
      const { error } = await supabase
        .from('users')
        .update({
          updated_at: new Date().toISOString(),
          source: source,
        })
        .eq('email', email)

      if (error) console.error('Error updating user:', error)
      return existingUser.id
    } else {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email,
          source,
          referrer: typeof window !== 'undefined' ? document.referrer : null,
          user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) console.error('Error saving email:', error)
      return newUser?.id
    }
  } catch (err) {
    console.error('Error saving email:', err)
  }
}

export interface PlatformStats {
  totalSessions: number
  completedConversations: number
  programClicks: number
  emailsCollected: number
}

/**
 * Get live platform statistics
 *
 * Returns real-time counts from the database for social proof
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    // Run all queries in parallel for speed
    const [sessionsResult, conversationsResult, clicksResult, emailsResult] = await Promise.all([
      supabase.from('conversations').select('id', { count: 'exact', head: true }),
      supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('program_clicks').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).not('email', 'is', null),
    ])

    return {
      totalSessions: sessionsResult.count || 0,
      completedConversations: conversationsResult.count || 0,
      programClicks: clicksResult.count || 0,
      emailsCollected: emailsResult.count || 0,
    }
  } catch (err) {
    console.error('Error fetching platform stats:', err)
    return {
      totalSessions: 0,
      completedConversations: 0,
      programClicks: 0,
      emailsCollected: 0,
    }
  }
}
