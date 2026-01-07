'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MetricCard } from '@/components/ui/metric-card'
import { ProgramMatch } from '@/lib/matching'
import { ExternalLink, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets, transitionPresets } from '@/lib/animations'
import { trackProgramClick } from '@/lib/supabase'
import { useChatStore } from '@/lib/store'

interface ProgramCardProps {
  match: ProgramMatch
  featured?: boolean
}

export function ProgramCard({ match, featured = false }: ProgramCardProps) {
  const { program, percentage, reasons, estimatedEarnings } = match
  const { sessionId, conversationId } = useChatStore()

  const handleApplyClick = async () => {
    await trackProgramClick(program.id, {
      sessionId,
      conversationId,
      matchPercentage: percentage,
      programName: program.name,
      provider: program.provider,
      sourcePage: '/results'
    })
  }

  return (
    <motion.div
      {...motionPresets.fadeInUp}
      transition={transitionPresets.smooth}
      whileHover={{ y: -4 }}
    >
      <Card className={featured ? 'border-accent/50 shadow-xl bg-accent/5' : 'hover:border-accent/30 transition-colors'}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            {featured && (
              <p className="text-xs uppercase tracking-widest text-accent font-mono">
                Top Match
              </p>
            )}
            <CardTitle className={`font-display ${featured ? 'text-3xl' : 'text-2xl'}`}>
              {program.provider}
            </CardTitle>
            <p className="text-muted-foreground">{program.name}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-mono font-black text-accent">
              {percentage}
            </div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-mono">
              Match
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!program.retailerLockin && (
            <Badge variant="outline" className="font-mono text-xs">
              No Switching
            </Badge>
          )}
          {program.controlLevel === 'full' && (
            <Badge variant="outline" className="font-mono text-xs">
              Full Control
            </Badge>
          )}
          {program.regions.map(region => (
            <Badge key={region} variant="secondary" className="font-mono text-xs">
              {region}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Metrics Grid - Enterprise Style */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              Annual Earnings
            </div>
            <div className="text-xl sm:text-3xl font-mono font-bold">
              ${estimatedEarnings.min}-{estimatedEarnings.max}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              Sign-up Bonus
            </div>
            <div className="text-xl sm:text-3xl font-mono font-bold text-accent">
              ${estimatedEarnings.signupBonus}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              VPP Rate
            </div>
            <div className="text-xl sm:text-3xl font-mono font-bold">
              ${program.vppRate}/kWh
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              Control
            </div>
            <div className="text-xl sm:text-3xl font-mono font-bold">
              {program.controlLevel === 'full' ? 'Full' : program.controlLevel === 'semi' ? 'Semi' : 'Auto'}
            </div>
          </div>
        </div>

        {/* Why This Matches */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
            Why This Matches
          </h4>
          <ul className="space-y-2">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pros & Cons */}
        <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-border">
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
              Advantages
            </h5>
            <ul className="space-y-2">
              {program.pros.slice(0, 3).map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-accent">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
              Considerations
            </h5>
            <ul className="space-y-2">
              {program.cons.slice(0, 3).map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span>−</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          size="lg"
          className="w-full font-display font-bold"
          asChild
          onClick={handleApplyClick}
        >
          <a href={program.signupUrl} target="_blank" rel="noopener noreferrer">
            Apply Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  )
}
