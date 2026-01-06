import { FAQItem } from '@/components/ui/faq-accordion'

/**
 * VPP FAQ Data
 *
 * ULTRATHINK Principle: Answer every objection that stands between the user and conversion.
 *
 * These questions address the most common concerns and conversion blockers:
 * - Understanding what VPPs are
 * - Trust/safety concerns
 * - Financial concerns
 * - Flexibility/commitment concerns
 */

export const vppFAQ: FAQItem[] = [
  {
    question: "What is a Virtual Power Plant (VPP)?",
    answer: "A VPP connects your home battery to a network managed by an energy company. When electricity demand is high, they can discharge a small amount of your battery's power to the grid. In return, you earn money, get better electricity rates, and help stabilize Australia's energy grid. You stay in control - your home's power needs always come first."
  },
  {
    question: "How much money can I actually make?",
    answer: "Most Australians with a VPP-connected battery earn between $800-1,200 per year, depending on their program, battery size, and location. This includes sign-up bonuses (typically $100-500), ongoing earnings from grid support ($400-900/year), and better electricity rates. Your exact earnings depend on which program you choose and how often the grid needs support in your area."
  },
  {
    question: "Do I need to switch electricity retailers?",
    answer: "It depends on the VPP program. Some programs (like Tesla VPP and Simply Energy) require you to be with their electricity retailer. Others (like Amber Electric) let you keep your current retailer. Our AI advisor filters programs based on whether you want to switch or not, so you'll only see options that match your preference."
  },
  {
    question: "Will this damage my battery?",
    answer: "No. VPP programs are designed to protect your battery's health. Most programs only use 10-30% of your battery's capacity for grid support, and they never discharge below safe levels. Plus, modern batteries are designed for thousands of charge cycles - VPP usage typically adds less than 5% additional cycling per year. Your battery warranty remains valid when you join a VPP."
  },
  {
    question: "Can I leave a VPP anytime?",
    answer: "Most VPPs have no lock-in contracts - you can leave anytime with 30-60 days notice. Some offer sign-up bonuses that require a minimum period (usually 12 months), but you're never trapped. If you're unhappy with the service or your circumstances change, you can always opt out. Check the specific terms for your chosen program."
  },
  {
    question: "What battery brands are supported?",
    answer: "The most widely supported batteries are Tesla Powerwall, LG Chem RESU, BYD Battery-Box, Enphase Encharge, sonnenBatterie, and AlphaESS. Most VPP programs support 5-10 different battery brands. Our comparison tool automatically filters programs based on your specific battery model, so you'll only see compatible options."
  },
  {
    question: "Are there any hidden costs or fees?",
    answer: "No. Joining a VPP is completely free. There are no installation fees, equipment costs, or monthly charges. The VPP provider may install a small gateway device (at no cost to you) to connect your battery to their system. You only earn money - you don't pay anything. The only 'cost' is that a portion of your battery's capacity is available to support the grid during peak times."
  },
  {
    question: "How long does it take to sign up?",
    answer: "After choosing a program, sign-up typically takes 10-15 minutes online. The VPP provider will then schedule a brief site visit (30-60 minutes) to install their connection device and verify your battery. You'll start earning within 1-4 weeks of signing up. The entire process is handled by the VPP provider - no need to hire an electrician or buy any equipment."
  }
]

export const resultsPageFAQ: FAQItem[] = vppFAQ.slice(0, 6) // Show top 6 on results page

export const homepageFAQ: FAQItem[] = vppFAQ.slice(0, 4) // Show top 4 on homepage
