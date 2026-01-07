/**
 * Environment Variable Validation
 *
 * ULTRATHINK Principle: Fail fast with clear errors.
 *
 * If an environment variable is missing or invalid, the app should crash
 * immediately on startup with a clear message, not fail mysteriously in
 * production hours later.
 *
 * This file handles both server-side and client-side validation:
 * - Server: Validates all env vars including secrets
 * - Client: Only validates NEXT_PUBLIC_* vars (secrets not available)
 *
 * Usage:
 *   import { env } from '@/lib/env'
 *   const apiKey = env.ANTHROPIC_API_KEY // Type-safe (server-only)
 */

import { z } from 'zod'

/**
 * Server-only environment variables schema
 */
const serverEnvSchema = z.object({
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, 'ANTHROPIC_API_KEY is required')
    .startsWith('sk-ant-', 'ANTHROPIC_API_KEY must start with sk-ant-'),

  RESEND_API_KEY: z
    .string()
    .min(1, 'RESEND_API_KEY is required for email functionality')
    .startsWith('re_', 'RESEND_API_KEY must start with re_')
    .optional(),

  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required')
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  ANTHROPIC_MODEL: z
    .string()
    .default('claude-3-5-haiku-20241022'),

  RATE_LIMIT_REQUESTS: z
    .string()
    .default('10')
    .transform((val) => parseInt(val, 10)),

  RATE_LIMIT_WINDOW_SECONDS: z
    .string()
    .default('60')
    .transform((val) => parseInt(val, 10)),
})

/**
 * Type for validated environment variables
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>

/**
 * Type for client environment variables
 */
export type ClientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  NODE_ENV: 'development' | 'production' | 'test'
}

/**
 * Validate server environment variables
 */
function validateServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid server environment variables:')
    console.error(JSON.stringify(parsed.error.format(), null, 2))
    throw new Error('Server environment validation failed')
  }

  return parsed.data
}

/**
 * Get client environment variables
 * On the client, Next.js injects these at build time, so no validation needed
 */
function getClientEnv(): ClientEnv {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  }
}

/**
 * Check if we're running on the server
 */
const isServer = typeof window === 'undefined'

/**
 * Validated environment variables
 * - Server: Full validation with Zod (includes ANTHROPIC_API_KEY)
 * - Client: Direct access (Next.js injects at build time)
 *
 * Note: Use serverEnv for server-only variables in API routes
 */
export const env: ServerEnv = isServer ? validateServerEnv() : getClientEnv() as unknown as ServerEnv

/**
 * Server-only environment variables
 * Use this in API routes to get type-safe access to secrets
 */
export function getServerEnv(): ServerEnv {
  if (!isServer) {
    throw new Error('getServerEnv() can only be called on the server')
  }
  return validateServerEnv()
}

/**
 * Check if we're in production
 */
export const isProduction = env.NODE_ENV === 'production'

/**
 * Check if we're in development
 */
export const isDevelopment = env.NODE_ENV === 'development'

/**
 * Check if we're running tests
 */
export const isTest = env.NODE_ENV === 'test'
