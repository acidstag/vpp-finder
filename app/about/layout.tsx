import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About VPP Finder | Independent VPP Comparison Australia',
  description: 'VPP Finder is an independent comparison tool helping Australian battery owners find the best Virtual Power Plant program. Learn about our mission, data sources, and how we make money.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About VPP Finder',
    description: 'Independent VPP comparison tool for Australian battery owners.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
