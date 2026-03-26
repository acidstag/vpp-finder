import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'VPP Finder terms of service. Conditions for using our Virtual Power Plant comparison tool.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
