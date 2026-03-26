import { ChatInterface } from '@/components/chat/chat-interface'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI VPP Advisor | Find Your Perfect Program',
  description: 'Chat with our AI advisor to find the best Virtual Power Plant program for your battery. Get personalised recommendations for Australian VPP programs in 2 minutes.',
  alternates: {
    canonical: '/chat',
  },
  openGraph: {
    title: 'AI VPP Advisor | Find Your Perfect Program',
    description: 'Get personalised VPP program recommendations through AI-powered chat. Free, 2-minute comparison.',
  },
}

export default function ChatPage() {
  return <ChatInterface />
}
