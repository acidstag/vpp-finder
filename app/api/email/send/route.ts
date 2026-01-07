import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { ResultsEmail } from '@/emails/results-email'
import { matchPrograms, postcodeToRegion, type UserProfile } from '@/lib/matching'
import { rateLimit } from '@/lib/rate-limit'

// Initialize Resend - will be undefined if API key not set
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  if (email.length > 254) return false // RFC 5321 max length
  return EMAIL_REGEX.test(email)
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - stricter for email endpoint (5 emails per minute)
    const identifier = req.headers.get('x-forwarded-for') || req.ip || 'unknown'
    const rateLimitResult = rateLimit({
      identifier: `email:${identifier}`,
      limit: 5,
      windowSeconds: 60,
    })

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please wait before sending another email request.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
          },
        }
      )
    }

    const { email, battery, location, solar, preference } = await req.json()

    // Validate required fields
    if (!email || !battery || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: email, battery, location' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Normalize email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim()

    // Get matched programs
    const userProfile: UserProfile = {
      battery,
      location,
      solar: solar ? parseFloat(solar) : null,
      retailerPreference: preference || 'open',
    }

    const matches = matchPrograms(userProfile)
    const topMatch = matches[0]
    const region = postcodeToRegion(location)

    if (!topMatch) {
      return NextResponse.json(
        { error: 'No matching programs found' },
        { status: 400 }
      )
    }

    // Build results URL with UTM params
    const resultsUrl = `https://vppfinder.com.au/results?battery=${encodeURIComponent(battery)}&location=${location}&solar=${solar || 0}&preference=${preference}&utm_source=email&utm_campaign=results`

    // If Resend is not configured, return success without sending
    // This allows the flow to work in development
    if (!resend) {
      console.log('Resend not configured - would send email to:', normalizedEmail)
      console.log('Top match:', topMatch.program.provider)
      return NextResponse.json({
        success: true,
        message: 'Email skipped (Resend not configured)',
        preview: true,
      })
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'VPP Finder <results@vppfinder.com.au>',
      to: normalizedEmail,
      subject: `Your VPP Match Results - ${battery} in ${location}`,
      react: ResultsEmail({
        battery,
        location,
        region,
        solar,
        preference,
        topMatch: {
          provider: topMatch.program.provider,
          name: topMatch.program.name,
          earningsMin: topMatch.estimatedEarnings.min,
          earningsMax: topMatch.estimatedEarnings.max,
          signupBonus: topMatch.program.signupBonus,
          retailerLockin: topMatch.program.retailerLockin,
          signupUrl: topMatch.program.signupUrl,
        },
        otherMatches: matches.slice(1, 4).map(m => ({
          provider: m.program.provider,
          name: m.program.name,
          earningsMax: m.estimatedEarnings.max,
          highlight: m.program.pros[0] || 'Great option',
        })),
        resultsUrl,
      }),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
