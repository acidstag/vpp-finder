import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { ResultsEmail } from '@/emails/results-email'
import { matchPrograms, postcodeToRegion, type UserProfile } from '@/lib/matching'

// Initialize Resend - will be undefined if API key not set
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  try {
    const { email, battery, location, solar, preference } = await req.json()

    // Validate required fields
    if (!email || !battery || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: email, battery, location' },
        { status: 400 }
      )
    }

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
      console.log('Resend not configured - would send email to:', email)
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
      to: email,
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
