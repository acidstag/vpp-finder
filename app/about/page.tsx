'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'
import { transitionPresets } from '@/lib/animations'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transitionPresets.smooth}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-mono">
                About Us
              </p>
              <h1 className="font-display font-bold text-5xl mb-6">
                Helping Australians Earn More From Their Batteries
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                VPP Finder is an independent comparison tool that helps Australian households
                find the best Virtual Power Plant program for their battery system.
              </p>
            </div>

            <div className="space-y-8">
              <Card className="p-8">
                <h2 className="font-display font-bold text-2xl mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Australia has one of the highest rates of residential solar and battery adoption
                  in the world. Yet many battery owners are leaving money on the table by not
                  participating in Virtual Power Plant programs - or by choosing the wrong one.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We built VPP Finder to cut through the complexity. Our AI-powered tool asks
                  a few simple questions about your setup and matches you with the best programs
                  for your specific situation - in under 2 minutes.
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="font-display font-bold text-2xl mb-4">How We Make Money</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We believe in transparency. VPP Finder may earn a commission when you sign up
                  to a VPP program through our links. This is how we keep the service free.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Important:</span> Our recommendations
                  are based solely on your profile and program features - never on commission rates.
                  We show you what's genuinely best for your situation.
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="font-display font-bold text-2xl mb-4">Our Data</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We maintain detailed information on 11 active VPP programs across Australia.
                  Our data is sourced from:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Official provider websites and documentation</li>
                  <li>Industry publications (SolarQuotes, Solar Choice)</li>
                  <li>Direct communication with VPP providers</li>
                  <li>Community feedback from program participants</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Data is verified monthly to ensure accuracy. Last update: January 2025.
                </p>
              </Card>

              <Card className="p-8">
                <h2 className="font-display font-bold text-2xl mb-4">Get In Touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Have feedback, corrections, or partnership inquiries? We'd love to hear from you.
                </p>
                <p className="text-muted-foreground">
                  Email: <a href="mailto:hello@vppfinder.com.au" className="text-accent hover:underline">hello@vppfinder.com.au</a>
                </p>
              </Card>

              <div className="text-center pt-8">
                <Button size="lg" asChild>
                  <Link href="/chat">Find Your VPP Match →</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
