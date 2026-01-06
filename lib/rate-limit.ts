/**
 * Simple In-Memory Rate Limiter
 *
 * ULTRATHINK Principle: Start simple, scale when needed.
 *
 * This rate limiter:
 * - Protects API routes from abuse
 * - Uses sliding window algorithm
 * - Stores data in-memory (fine for single-instance deployments)
 * - Can be upgraded to Redis/Upstash if needed
 *
 * For production scale (>1 server), replace with Upstash Rate Limit:
 * https://github.com/upstash/ratelimit
 */

interface RateLimitStore {
  [key: string]: number[]
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  /**
   * Unique identifier (usually IP address or user ID)
   */
  identifier: string

  /**
   * Maximum number of requests allowed
   */
  limit: number

  /**
   * Time window in seconds
   */
  windowSeconds: number
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean

  /**
   * Number of requests remaining in current window
   */
  remaining: number

  /**
   * When the rate limit resets (Unix timestamp)
   */
  resetAt: number

  /**
   * Number of seconds until reset
   */
  retryAfter?: number
}

/**
 * Check if a request should be rate limited
 *
 * Example usage:
 * ```typescript
 * const result = rateLimit({
 *   identifier: req.ip || 'unknown',
 *   limit: 10,
 *   windowSeconds: 60
 * })
 *
 * if (!result.allowed) {
 *   return new Response('Rate limit exceeded', {
 *     status: 429,
 *     headers: { 'Retry-After': result.retryAfter?.toString() || '60' }
 *   })
 * }
 * ```
 */
export function rateLimit(config: RateLimitConfig): RateLimitResult {
  const { identifier, limit, windowSeconds } = config
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  // Get or create request timestamps for this identifier
  if (!store[identifier]) {
    store[identifier] = []
  }

  // Remove timestamps outside the current window
  store[identifier] = store[identifier].filter(
    (timestamp) => now - timestamp < windowMs
  )

  // Check if limit is exceeded
  const requestCount = store[identifier].length
  const allowed = requestCount < limit

  if (allowed) {
    // Add current request timestamp
    store[identifier].push(now)
  }

  // Calculate reset time (end of current window)
  const oldestTimestamp = store[identifier][0] || now
  const resetAt = oldestTimestamp + windowMs
  const retryAfter = Math.ceil((resetAt - now) / 1000)

  return {
    allowed,
    remaining: Math.max(0, limit - requestCount - (allowed ? 1 : 0)),
    resetAt,
    retryAfter: allowed ? undefined : retryAfter,
  }
}

/**
 * Cleanup function to prevent memory leaks
 * Call this periodically (e.g., every 10 minutes) to remove stale entries
 */
export function cleanupRateLimitStore(maxAgeSeconds: number = 3600) {
  const now = Date.now()
  const maxAgeMs = maxAgeSeconds * 1000

  for (const identifier in store) {
    // Remove timestamps older than maxAge
    store[identifier] = store[identifier].filter(
      (timestamp) => now - timestamp < maxAgeMs
    )

    // Remove identifier if no timestamps remain
    if (store[identifier].length === 0) {
      delete store[identifier]
    }
  }
}

// Auto-cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => cleanupRateLimitStore(), 10 * 60 * 1000)
}
