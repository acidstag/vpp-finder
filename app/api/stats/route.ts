import { NextResponse } from 'next/server'
import { getPlatformStats } from '@/lib/supabase'

/**
 * GET /api/stats
 *
 * Returns live platform statistics for social proof
 *
 * Caching strategy:
 * - Cache for 5 minutes (300 seconds)
 * - Revalidate in background
 * - Always serve cached version while revalidating
 */
export async function GET() {
  try {
    const stats = await getPlatformStats()

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
