'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Card } from './card'
import { transitionPresets } from '@/lib/animations'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  title?: string
  subtitle?: string
  items: FAQItem[]
  className?: string
}

/**
 * FAQ Accordion Component
 *
 * ULTRATHINK Principle: Answer objections before they become roadblocks.
 *
 * Provides expandable FAQ section with:
 * - Smooth animations
 * - SEO-friendly structure
 * - Addresses conversion blockers
 *
 * Usage:
 * ```tsx
 * <FAQAccordion
 *   title="Frequently Asked Questions"
 *   items={faqItems}
 * />
 * ```
 */
export function FAQAccordion({ title, subtitle, items, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Card className={`p-8 ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-mono">
                FAQ
              </p>
              <h2 className="font-display font-bold text-3xl">
                {title}
              </h2>
            </div>
          )}
          {subtitle && (
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border-b border-border last:border-b-0"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between py-4 text-left hover:text-accent transition-colors group"
            >
              <span className="font-medium pr-8">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={transitionPresets.smooth}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transitionPresets.smooth}
                  className="overflow-hidden"
                >
                  <div className="pb-4 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* SEO-friendly structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': items.map(item => ({
              '@type': 'Question',
              'name': item.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer,
              },
            })),
          }),
        }}
      />
    </Card>
  )
}
