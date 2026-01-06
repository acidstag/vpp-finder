'use client'

import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  // Don't render if no measurement ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

/**
 * Track custom events in Google Analytics
 *
 * Usage:
 *   trackEvent('button_click', { button_name: 'apply_now', program: 'amber' })
 *   trackEvent('comparison_viewed', { programs_count: 4 })
 *   trackEvent('chat_completed', { battery: 'tesla', region: 'NSW' })
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', eventName, eventParams)
  }
}

/**
 * Track outbound link clicks (for affiliate tracking)
 *
 * Usage:
 *   trackOutboundLink('https://amber.com.au/signup', 'amber-smartshift')
 */
export function trackOutboundLink(url: string, programId?: string) {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    program_id: programId || 'unknown',
    transport_type: 'beacon',
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}
