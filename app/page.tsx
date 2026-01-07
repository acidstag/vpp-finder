'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/metric-card'
import { HybridBackground } from '@/components/layout/hybrid-background'
import { Footer } from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { motionPresets, transitionPresets, createStagger } from '@/lib/animations'
import { programs } from '@/data/programs'
import { FAQAccordion } from '@/components/ui/faq-accordion'
import { homepageFAQ } from '@/data/faq'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Enterprise Minimal with Midjourney Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
        <HybridBackground variant="hero" imagePattern={1} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Hero Content */}
            <motion.div
              className="max-w-4xl mb-16"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: createStagger(0.1)
                }
              }}
            >
              <motion.div variants={motionPresets.fadeInUp} className="space-y-6">
                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-7xl leading-tight tracking-tight">
                  Find Your Perfect{' '}
                  <span className="text-accent">Virtual Power Plant</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Earn $800-1,200/year from your battery.{' '}
                  Compare programs in 2 minutes.
                </p>
              </motion.div>

              <motion.div
                variants={motionPresets.fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <Button size="lg" asChild>
                  <Link href="/chat">Chat with AI →</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/calculator">
                    Quick Calculator
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                variants={motionPresets.fadeInUp}
                className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>2 minute comparison</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>No signup required</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Metrics Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ...transitionPresets.smooth }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                      System Overview
                    </p>
                    <h3 className="text-2xl font-display font-bold">Your Battery Could Earn</h3>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <MetricCard
                      label="Annual Earnings"
                      value="$1,047"
                      sublabel="per year"
                      trend={{ value: "↑ $640 vs feed-in", positive: true }}
                      delay={0.5}
                    />
                    <MetricCard
                      label="Sign-up Bonus"
                      value="$200"
                      sublabel="average"
                      delay={0.6}
                    />
                    <MetricCard
                      label="Programs"
                      value="11"
                      sublabel="active nationwide"
                      delay={0.7}
                    />
                    <MetricCard
                      label="Comparison Time"
                      value="2 min"
                      sublabel="average to match"
                      trend={{ value: "AI-powered", positive: true }}
                      delay={0.8}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Enterprise Minimal */}
      <section className="relative py-32 bg-card overflow-hidden" id="how-it-works">
        <HybridBackground variant="section" imagePattern={2} useCodePattern />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={transitionPresets.smooth}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-16">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                Process
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl">
                How It Works
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Tell Us About Your Battery',
                  description: 'Use our quick calculator or chat with our AI to share your battery details.',
                  duration: '2 min'
                },
                {
                  step: '02',
                  title: 'Get Personalized Matches',
                  description: 'We compare 11 VPP programs to find the best fit for your setup and preferences.',
                  duration: 'Instant'
                },
                {
                  step: '03',
                  title: 'Sign Up & Start Earning',
                  description: 'Apply directly with your chosen VPP provider and start earning within days.',
                  duration: '1 week'
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, ...transitionPresets.smooth }}
                >
                  <Card className="h-full p-8 hover:border-accent/50 transition-colors duration-300">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="text-6xl font-mono font-black text-accent/20">
                          {item.step}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                          {item.duration}
                        </div>
                      </div>
                      <h3 className="text-xl font-display font-bold">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Enterprise Minimal */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={transitionPresets.smooth}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-16">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                The Opportunity
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl max-w-2xl">
                What Your Battery Could Earn
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: 'VPP Programs', value: '11', sublabel: 'Compared nationwide' },
                { label: 'Potential Earnings', value: '$800-1,500', sublabel: 'Per year (varies by program)' },
                { label: 'vs Feed-in Tariff', value: '+$640', sublabel: 'Additional annual value*' },
                { label: 'Time to Compare', value: '2 min', sublabel: 'AI-powered matching' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, ...transitionPresets.smooth }}
                  className="text-center space-y-3"
                >
                  <div className="text-4xl md:text-5xl font-mono font-black text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.sublabel}
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-8">
              *Based on 13.5kWh battery comparison. Actual earnings depend on battery size, location, and program.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Enterprise Minimal */}
      <section className="relative py-32 bg-foreground text-background overflow-hidden">
        <HybridBackground variant="cta" imagePattern={3} className="opacity-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transitionPresets.smooth}
          className="container mx-auto px-4 text-center space-y-8 relative z-10"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-background/60 mb-4 font-mono">
              Get Started
            </p>
            <h2 className="font-display font-black text-3xl md:text-5xl mb-6">
              Ready to Find Your VPP Match?
            </h2>
            <p className="text-xl text-background/80 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Australians earning more from their batteries.
              Compare programs in 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-accent text-background hover:bg-accent/90">
              <Link href="/chat">Chat with AI →</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="border border-background/40 text-background hover:bg-background/10 hover:text-background">
              <Link href="/calculator">
                Quick Calculator
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-background/60">
            <span className="font-mono">⚡</span>
            <span>Free • No signup required • 2 minute comparison</span>
          </div>
        </motion.div>
      </section>

      {/* Quick Program Preview Section */}
      <section className="py-32 bg-background" id="programs">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={transitionPresets.smooth}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-16 text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                Available Programs
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">
                11 VPP Programs Compared
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From major retailers to innovative startups, find the perfect match for your battery.
              </p>
            </div>

            {/* Program Grid - Top 6 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {programs.slice(0, 6).map((program, idx) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, ...transitionPresets.smooth }}
                >
                  <Card className="p-6 h-full hover:border-accent/50 transition-colors group">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display font-bold text-xl mb-1">
                            {program.provider}
                          </h3>
                          <p className="text-sm text-muted-foreground">{program.name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-mono font-bold text-accent">
                            ${program.avgAnnualEarnings.max}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            /year
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {!program.retailerLockin && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-mono">
                            No Lock-in
                          </span>
                        )}
                        {program.controlLevel === 'full' && (
                          <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            Full Control
                          </span>
                        )}
                        {program.signupBonus > 0 && (
                          <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            ${program.signupBonus} Bonus
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {program.pros[0]}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button size="lg" asChild>
                <Link href="/results?battery=tesla&location=2000&solar=6.6&preference=open">
                  Compare All 11 Programs →
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30" id="faq">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <FAQAccordion
              title="Common Questions"
              subtitle="Everything you need to know about Virtual Power Plants"
              items={homepageFAQ}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
