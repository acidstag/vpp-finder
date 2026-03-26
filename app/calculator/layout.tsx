import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VPP Calculator | Compare Battery Earnings',
  description: 'Calculate your potential Virtual Power Plant earnings based on your battery brand, location, and solar system. Quick 2-minute comparison of Australian VPP programs.',
  alternates: {
    canonical: '/calculator',
  },
  openGraph: {
    title: 'VPP Calculator | Compare Battery Earnings',
    description: 'Calculate your potential VPP earnings in 2 minutes. Enter your battery details and compare Australian programs.',
  },
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children
}
