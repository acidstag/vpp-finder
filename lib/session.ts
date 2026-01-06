/**
 * Session Management
 *
 * Provides UUID-based session tracking for analytics and monetization.
 * Sessions persist across page refreshes and track user journey through the funnel.
 */

import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'vpp-finder-session-id'
const SESSION_CREATED_KEY = 'vpp-finder-session-created'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export interface SessionData {
  sessionId: string
  createdAt: string
  conversationId?: string
}

/**
 * Get or create a session ID
 * Sessions expire after 24 hours
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: generate temporary ID
    return uuidv4()
  }

  try {
    const existingId = localStorage.getItem(SESSION_KEY)
    const createdAt = localStorage.getItem(SESSION_CREATED_KEY)

    // Check if session exists and is still valid
    if (existingId && createdAt) {
      const sessionAge = Date.now() - new Date(createdAt).getTime()

      if (sessionAge < SESSION_DURATION) {
        return existingId
      }
    }

    // Create new session
    const newId = uuidv4()
    localStorage.setItem(SESSION_KEY, newId)
    localStorage.setItem(SESSION_CREATED_KEY, new Date().toISOString())

    return newId
  } catch (error) {
    // Fallback if localStorage is unavailable
    console.warn('localStorage unavailable, using temporary session:', error)
    return uuidv4()
  }
}

/**
 * Generate a new conversation ID
 * Each chat conversation gets its own ID for tracking
 */
export function generateConversationId(): string {
  return uuidv4()
}

/**
 * Clear the current session
 * Useful for testing or user logout
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_CREATED_KEY)
  }
}

/**
 * Get full session data
 */
export function getSessionData(): SessionData {
  const sessionId = getSessionId()
  const createdAt = typeof window !== 'undefined'
    ? localStorage.getItem(SESSION_CREATED_KEY) || new Date().toISOString()
    : new Date().toISOString()

  return {
    sessionId,
    createdAt,
  }
}

/**
 * Check if session is active
 */
export function hasActiveSession(): boolean {
  if (typeof window === 'undefined') return false

  const sessionId = localStorage.getItem(SESSION_KEY)
  const createdAt = localStorage.getItem(SESSION_CREATED_KEY)

  if (!sessionId || !createdAt) return false

  const sessionAge = Date.now() - new Date(createdAt).getTime()
  return sessionAge < SESSION_DURATION
}

/**
 * Extend session expiry
 * Call this on significant user actions to keep session alive
 */
export function extendSession(): void {
  if (typeof window !== 'undefined') {
    const sessionId = getSessionId()
    localStorage.setItem(SESSION_CREATED_KEY, new Date().toISOString())
  }
}
