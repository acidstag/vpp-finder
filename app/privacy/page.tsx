'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Footer } from '@/components/layout/footer'
import { transitionPresets } from '@/lib/animations'

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            <Card className="p-8 space-y-8">
              <section>
                <h2 className="font-display font-bold text-xl mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you use VPP Finder, we collect the following information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Battery Information:</strong> Type, brand, and capacity of your battery system</li>
                  <li><strong>Location:</strong> Your postcode to determine regional availability</li>
                  <li><strong>Solar System Size:</strong> If you choose to provide it</li>
                  <li><strong>Retailer Preference:</strong> Whether you're open to switching energy retailers</li>
                  <li><strong>Usage Data:</strong> How you interact with our website (pages visited, time spent)</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide personalized VPP program recommendations</li>
                  <li>Improve our matching algorithm and user experience</li>
                  <li>Track referrals to VPP providers (for commission purposes)</li>
                  <li>Analyze website usage to improve our service</li>
                  <li>Communicate with you if you've provided contact details</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">3. Data Storage & Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your data is stored securely using industry-standard encryption. We use Supabase
                  for data storage, which provides enterprise-grade security including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Encryption at rest and in transit</li>
                  <li>Regular security audits</li>
                  <li>SOC 2 Type II compliance</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">4. Third-Party Sharing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>VPP Providers:</strong> When you click through to apply, basic referral data is shared</li>
                  <li><strong>Analytics Services:</strong> Google Analytics for website usage analysis</li>
                  <li><strong>Hosting Providers:</strong> Vercel for website hosting</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">5. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use essential cookies to maintain your session and preferences. Analytics cookies
                  help us understand how visitors use our site. You can disable cookies in your browser
                  settings, though this may affect functionality.
                </p>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Under Australian Privacy Principles, you have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display font-bold text-xl mb-4">7. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For privacy-related inquiries or to exercise your rights, contact us at:{' '}
                  <a href="mailto:privacy@vppfinder.com.au" className="text-accent hover:underline">
                    privacy@vppfinder.com.au
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
