import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your VPP Results | Personalised Program Comparison',
  description: 'Your personalised Virtual Power Plant program comparison. See which VPP programs match your battery, location, and preferences with estimated annual earnings.',
  alternates: {
    canonical: '/results',
  },
  openGraph: {
    title: 'Your VPP Results | Personalised Comparison',
    description: 'See your personalised VPP program matches with estimated earnings.',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children
}
