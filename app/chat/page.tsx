import { ChatInterface } from '@/components/chat/chat-interface'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Chat | Find Your Perfect VPP Program | VPP Finder',
  description: 'Chat with our AI advisor to find the perfect Virtual Power Plant program for your battery. Get personalized recommendations in 2 minutes.',
  openGraph: {
    title: 'AI Chat | VPP Finder',
    description: 'Get personalized VPP program recommendations through AI-powered chat.',
  },
}

export default function ChatPage() {
  return <ChatInterface />
}
