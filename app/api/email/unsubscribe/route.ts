import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  if (email.length > 254) return false
  return EMAIL_REGEX.test(email)
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - prevent abuse
    const identifier = req.headers.get('x-forwarded-for') || req.ip || 'unknown'
    const rateLimitResult = rateLimit({
      identifier: `unsubscribe:${identifier}`,
      limit: 10,
      windowSeconds: 60,
    })

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const { email } = await req.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Update the user record in Supabase to mark as unsubscribed
    // Uses the users table where emails are stored
    const { error } = await supabase
      .from('users')
      .update({
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase())

    // Even if no record found, return success (don't reveal if email exists)
    if (error) {
      console.error('Unsubscribe error:', error)
      // Still return success to prevent email enumeration
    }

    // Log the unsubscribe event
    console.log(`Unsubscribe request for: ${email}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unsubscribe API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
