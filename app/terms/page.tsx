'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Footer } from '@/components/layout/footer'
import { transitionPresets } from '@/lib/animations'

export default function TermsPage() {
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
                Legal
              </p>
              <h1 className="font-display font-bold text-5xl mb-6">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            <Card className="p-8 space-y-8">
              <section>
                <h2 className="font-display font-bold text-xl mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using VPP Finder ("the Service"), you accept and agree to be bound
                  by these Terms of Service. If you do not agree to these terms, please do not use
                  our Service.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  VPP Finder is a free comparison tool that helps Australian households identify
                  suitable Virtual Power Plant programs for their battery systems. We provide
                  information and recommendations but do not directly provide VPP services.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">3. Accuracy of Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  While we strive to maintain accurate and up-to-date information about VPP programs:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Program details, rates, and availability may change without notice</li>
                  <li>Earnings estimates are indicative only and not guaranteed</li>
                  <li>You should verify all details directly with VPP providers before signing up</li>
                  <li>We are not responsible for decisions made based on our recommendations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">4. Affiliate Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  VPP Finder participates in affiliate programs with various VPP providers. When you
                  sign up to a program through our links, we may receive a commission. This does not
                  affect the price you pay or our recommendations, which are based solely on program
                  suitability for your needs.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">5. Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Service contains links to third-party websites (VPP providers). We are not
                  responsible for the content, privacy practices, or terms of these external sites.
                  Your use of third-party services is governed by their respective terms and conditions.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by Australian law, VPP Finder and its operators
                  shall not be liable for any indirect, incidental, special, consequential, or
                  punitive damages arising from your use of the Service, including but not limited
                  to loss of profits, data, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">7. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on VPP Finder, including text, graphics, logos, and software, is the
                  property of VPP Finder or its content suppliers and is protected by Australian
                  and international copyright laws. You may not reproduce, distribute, or create
                  derivative works without our express permission.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">8. User Conduct</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Scrape or harvest data from our Service without permission</li>
                  <li>Submit false or misleading information</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective
                  immediately upon posting to this page. Your continued use of the Service after
                  changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">10. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms are governed by the laws of Australia. Any disputes shall be resolved
                  in the courts of Australia.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">11. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, contact us at:{' '}
                  <a href="mailto:legal@vppfinder.com.au" className="text-accent hover:underline">
                    legal@vppfinder.com.au
                  </a>
                </p>
              </section>
            </Card>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
