import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Syne } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'VPP Finder | Find Your Perfect Virtual Power Plant in Australia',
  description: 'Compare 11 Virtual Power Plant programs in Australia. Earn $800-1,200/year from your battery. AI-powered matching in 2 minutes. Free, no signup required.',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  keywords: [
    'VPP Australia',
    'Virtual Power Plant',
    'battery earnings',
    'solar battery',
    'Tesla Powerwall VPP',
    'home battery program',
    'VPP comparison',
    'energy storage',
    'Amber SmartShift',
    'AGL VPP',
    'Origin VPP',
  ],
  authors: [{ name: 'VPP Finder' }],
  openGraph: {
    title: 'VPP Finder | Compare Virtual Power Plant Programs',
    description: 'Find the best VPP program for your battery. Compare 11 programs, earn $800-1,200/year. AI-powered matching in 2 minutes.',
    url: 'https://vppfinder.com.au',
    siteName: 'VPP Finder',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VPP Finder | Compare Virtual Power Plant Programs',
    description: 'Find the best VPP program for your battery. Earn $800-1,200/year.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'your-verification-code',
  },
}

import { Navigation } from '@/components/layout/navigation'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <Navigation />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  )
}
