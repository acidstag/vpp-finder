'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { matchPrograms, type UserProfile, postcodeToRegion } from '@/lib/matching'
import { trackComparison } from '@/lib/supabase'
import { useChatStore } from '@/lib/store'
import { ProgramCard } from '@/components/comparison/program-card'
import { ComparisonTable } from '@/components/comparison/comparison-table'
import { FAQAccordion } from '@/components/ui/faq-accordion'
import { EarningsComparison } from '@/components/ui/earnings-comparison'
import { resultsPageFAQ } from '@/data/faq'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, LayoutGrid, Table } from 'lucide-react'
import { motion } from 'framer-motion'
import { transitionPresets } from '@/lib/animations'

type ViewMode = 'cards' | 'table'
type FilterMode = 'all' | 'top' | 'available'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [filterMode, setFilterMode] = useState<FilterMode>('top')
  const { sessionId } = useChatStore()

  // Extract user profile from query params
  const battery = searchParams.get('battery') || ''
  const location = searchParams.get('location') || ''
  const solar = parseFloat(searchParams.get('solar') || '0') || null
  const preference = (searchParams.get('preference') || 'open') as 'keep' | 'open' | 'advice'

  // Check if this is example data (coming from homepage/nav links)
  const isExampleData = battery === 'tesla' && location === '2000'

  const userProfile: UserProfile = {
    battery,
    location,
    solar,
    retailerPreference: preference,
  }

  // Get matched programs
  const matches = matchPrograms(userProfile)
  const topMatch = matches[0]
  const region = postcodeToRegion(location)

  // Track comparison on page load
  useEffect(() => {
    if (matches.length > 0) {
      trackComparison(
        matches.map(m => m.program.id),
        sessionId
      )
    }
  }, []) // Only run once on mount

  // Calculate available/compatible programs count
  const compatibleCount = matches.filter(m => m.matchPercentage >= 70).length

  // Filter programs based on mode
  const filteredMatches = (() => {
    switch (filterMode) {
      case 'top':
        return matches.slice(0, 4)
      case 'available':
        return matches.filter(m => m.matchPercentage >= 70)
      case 'all':
      default:
        return matches
    }
  })()

  if (!battery || !location) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">No Profile Data</h2>
          <p className="text-muted-foreground">
            Please complete the chat to get your personalized recommendations.
          </p>
          <Button asChild>
            <Link href="/chat">Start Chat</Link>
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4 space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/chat">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Link>
        </Button>

        {/* Example Data Notice */}
        {isExampleData && (
          <Card className="p-4 bg-accent/10 border-accent/20">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Example Results</h3>
              <p className="text-sm text-muted-foreground">
                You're viewing example results for a Tesla Powerwall 2 in Sydney.{' '}
                <Link href="/chat" className="text-accent hover:underline font-medium">
                  Chat with our AI
                </Link>{' '}
                to get personalized recommendations for your battery.
              </p>
            </div>
          </Card>
        )}

        {/* User Setup Summary */}
        <Card className="p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Your Setup</h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Battery:</span> {battery}
              </div>
              <div>
                <span className="font-medium">Location:</span> {location} ({region})
              </div>
              {solar && (
                <div>
                  <span className="font-medium">Solar:</span> {solar}kW
                </div>
              )}
              <div>
                <span className="font-medium">Retailer:</span>{' '}
                {preference === 'keep'
                  ? 'Keep Current'
                  : preference === 'open'
                  ? 'Open to Switch'
                  : 'Need Advice'}
              </div>
            </div>
          </div>
        </Card>

        {/* Earnings Comparison - Show the value gap */}
        {topMatch && (
          <EarningsComparison
            vppEarnings={topMatch.estimatedEarnings.max}
            feedInEarnings={407}
            batterySize={13.5}
            context={`with ${battery}`}
          />
        )}

        {/* Top Match - Always Featured */}
        {topMatch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitionPresets.smooth}
            className="space-y-4"
          >
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                Best Match
              </p>
              <h2 className="font-display font-bold text-4xl">Your Top Match</h2>
              <p className="text-lg text-muted-foreground">
                This program is the best fit for your battery and preferences
              </p>
            </div>
            <ProgramCard match={topMatch} featured />
          </motion.div>
        )}

        {/* Filter & View Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            {[
              { value: 'top' as FilterMode, label: 'Top 4', count: 4 },
              { value: 'available' as FilterMode, label: 'Compatible', count: compatibleCount },
              { value: 'all' as FilterMode, label: 'All Programs', count: matches.length },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterMode(filter.value)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${filterMode === filter.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {filter.label}
                <span className="ml-1.5 font-mono text-xs opacity-70">({filter.count})</span>
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setViewMode('cards')}
              className={`
                p-2 rounded-md transition-all
                ${viewMode === 'cards'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              aria-label="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`
                p-2 rounded-md transition-all
                ${viewMode === 'table'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              aria-label="Table view"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Display - Cards or Table */}
        <motion.div
          key={`${viewMode}-${filterMode}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitionPresets.smooth}
        >
          {viewMode === 'cards' ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-2xl">
                  {filterMode === 'top' && 'Top Recommendations'}
                  {filterMode === 'available' && 'Compatible Programs'}
                  {filterMode === 'all' && 'All Programs'}
                </h3>
                <p className="text-muted-foreground">
                  {filterMode === 'top' && 'The best programs for your setup'}
                  {filterMode === 'available' && 'Programs that match your requirements'}
                  {filterMode === 'all' && 'Complete list of VPP programs'}
                </p>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredMatches.slice(1).map((match) => (
                  <ProgramCard key={match.program.id} match={match} />
                ))}
              </div>
            </div>
          ) : (
            <ComparisonTable
              title={
                filterMode === 'top' ? 'Compare Top Programs' :
                filterMode === 'available' ? 'Compare Compatible Programs' :
                'Compare All Programs'
              }
              subtitle="Side-by-side comparison of features, earnings, and requirements"
              programs={filteredMatches.map(m => m.program)}
              variant="card"
            />
          )}
        </motion.div>

        {/* FAQ Section */}
        <FAQAccordion
          title="Frequently Asked Questions"
          subtitle="Common questions about VPP programs and how they work"
          items={resultsPageFAQ}
        />

        {/* Inline Disclosure */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            VPP Finder may earn a commission if you sign up through our links. This does not affect rankings, which are based on your profile and program compatibility.
          </p>
        </div>
      </div>
    </main>
  )
}
