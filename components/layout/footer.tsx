import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
                <span className="text-background font-mono font-bold text-lg">V</span>
              </div>
              <span className="font-display font-bold text-xl">VPP Finder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Compare Virtual Power Plant programs and maximize your battery earnings.
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              Made in Australia
            </p>
          </div>

          {/* Compare */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider font-mono">
              Compare
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Chat Comparison
                </Link>
              </li>
              <li>
                <Link href="/results?battery=tesla&location=2000&solar=6.6&preference=open" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Programs
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider font-mono">
              Learn
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  VPP FAQ
                </Link>
              </li>
              <li>
                <a
                  href="https://www.solarquotes.com.au/battery-storage/vpp-comparison/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  VPP Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider font-mono">
              Info
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            <span className="font-semibold">Affiliate Disclosure:</span> VPP Finder may earn a commission when you sign up to a VPP program through links on this website. This does not affect our recommendations, which are based solely on your profile and program features. We are committed to providing unbiased comparisons to help Australian households make informed decisions about their energy.
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-mono">
              © {currentYear} VPP Finder. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="font-mono">Comparing 11 VPP programs</span>
              <span>•</span>
              <span className="font-mono">Data verified Jan 2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
