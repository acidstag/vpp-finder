'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChatStore } from '@/lib/store'
import { saveConversation, saveEmail } from '@/lib/supabase'
import { Message } from './message'
import { TypingIndicator } from './typing-indicator'
import { QualificationSuccess } from './qualification-success'
import { EmailCaptureModal } from './email-capture-modal'
import { QuickReplies } from './quick-replies'
import { ConversationProgress } from './conversation-progress'
import { ClearStorageButton } from '@/app/chat/clear-storage'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

const INITIAL_GREETING = "Hey! I'm here to help you find the perfect VPP program. Do you already have a battery installed, or are you researching before you buy?"

// Quick replies for different conversation stages
const QUICK_REPLIES = {
  initial: [
    { text: "Yes, I have a battery", value: "Yes, I have a battery installed" },
    { text: "Not yet, researching", value: "I'm researching before I buy" },
  ],
  batteryType: [
    { text: "Tesla Powerwall", value: "Tesla Powerwall" },
    { text: "LG Chem", value: "LG Chem" },
    { text: "Sonnen", value: "Sonnen" },
    { text: "Other brand", value: "I have a different brand" },
  ],
  retailerPreference: [
    { text: "Keep current retailer", value: "I want to keep my current retailer" },
    { text: "Open to switching", value: "I'm open to switching retailers" },
    { text: "Need advice", value: "I need advice on this" },
  ],
}

export function ChatInterface() {
  const [input, setInput] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [qualificationData, setQualificationData] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)
  const router = useRouter()

  const { messages, isStreaming, sessionId, conversationId, hasHydrated, addMessage, updateLastMessage, setStreaming } = useChatStore()

  // Determine current conversation step and quick replies
  const getConversationState = () => {
    const lastAiMessage = messages.filter(m => m.role === 'assistant').pop()?.content.toLowerCase() || ''

    // Check for qualification
    if (lastAiMessage.includes('qualified:')) return { step: 5, replies: [] }

    // Check what question was just asked
    if (messages.length <= 2) {
      return { step: 1, replies: QUICK_REPLIES.initial }
    }

    if (lastAiMessage.includes('battery') && lastAiMessage.includes('brand')) {
      return { step: 1, replies: QUICK_REPLIES.batteryType }
    }

    if (lastAiMessage.includes('postcode') || lastAiMessage.includes('location')) {
      return { step: 2, replies: [] } // No quick replies for postcode
    }

    if (lastAiMessage.includes('solar') && lastAiMessage.includes('kw')) {
      return { step: 3, replies: [] } // No quick replies for solar size
    }

    if (lastAiMessage.includes('retailer') || lastAiMessage.includes('switch')) {
      return { step: 4, replies: QUICK_REPLIES.retailerPreference }
    }

    return { step: 1, replies: [] }
  }

  const conversationState = getConversationState()

  // Add initial greeting (only once, after hydration completes)
  useEffect(() => {
    // Wait for Zustand to finish loading persisted messages
    if (!hasHydrated) return

    // Only add greeting if no messages exist and we haven't initialized yet
    if (!hasInitialized.current && messages.length === 0) {
      hasInitialized.current = true
      addMessage({
        role: 'assistant',
        content: INITIAL_GREETING,
      })
    }
  }, [hasHydrated, messages.length])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  const handleQuickReply = (value: string) => {
    if (isStreaming) return
    // Simulate typing the quick reply value
    setInput(value)
    // Use setTimeout to ensure input is set before sending
    setTimeout(() => {
      sendMessageWithText(value)
    }, 0)
  }

  async function sendMessageWithText(text: string) {
    if (!text.trim() || isStreaming) return

    const userMessage = text.trim()
    setInput('')

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    })

    // Add empty assistant message for streaming
    addMessage({
      role: 'assistant',
      content: '',
    })

    setStreaming(true)

    try {
      // Call API with conversation history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: userMessage },
          ],
        }),
      })

      if (!response.body) throw new Error('No response body')

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        aiMessage += chunk

        // Update the last message with accumulated content
        updateLastMessage(aiMessage)
      }

      setStreaming(false)

      // Check if user is qualified
      if (aiMessage.includes('QUALIFIED:')) {
        // Extract the qualification data - supports both pipe-separated and JSON formats
        const pipeMatch = aiMessage.match(/QUALIFIED:\s*battery=([^|]+)\|location=([^|]+)\|solar=([^|]+)\|preference=(\w+)/)
        const jsonMatch = aiMessage.match(/QUALIFIED:\s*(\{[^}]+\})/)

        let data: { battery: string; location: string; solar: number | null; preference: string } | null = null

        if (pipeMatch) {
          // Parse pipe-separated format: battery=X|location=Y|solar=Z|preference=W
          data = {
            battery: pipeMatch[1].trim(),
            location: pipeMatch[2].trim(),
            solar: pipeMatch[3].trim().toLowerCase() === 'no' ? null : parseFloat(pipeMatch[3]),
            preference: pipeMatch[4].trim()
          }
        } else if (jsonMatch) {
          // Fallback to JSON format for backwards compatibility
          try {
            data = JSON.parse(jsonMatch[1])
          } catch (e) {
            console.error('Failed to parse JSON qualification data:', e)
          }
        }

        if (data) {
          // Save conversation to database
          await saveConversation(
            messages.map(m => ({
              role: m.role,
              content: m.content,
              timestamp: m.timestamp
            })),
            true, // qualified = true
            sessionId,
            conversationId
          )

          // Store qualification data for later use
          setQualificationData(data)

          // Show success animation
          setShowSuccess(true)

          // After 1.5 seconds, show email modal
          setTimeout(() => {
            setShowSuccess(false)
            setShowEmailModal(true)
          }, 1500)
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      updateLastMessage('Sorry, something went wrong. Please try again.')
      setStreaming(false)
    }
  }

  async function sendMessage() {
    sendMessageWithText(input)
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleEmailSubmit = async (email: string) => {
    // Save email to database
    await saveEmail(email, sessionId, 'chat')

    // Close modal and redirect
    setShowEmailModal(false)
    redirectToResults()
  }

  const handleEmailSkip = () => {
    // Just redirect without saving email
    setShowEmailModal(false)
    redirectToResults()
  }

  const redirectToResults = () => {
    if (!qualificationData) return

    const params = new URLSearchParams({
      battery: qualificationData.battery || '',
      location: qualificationData.location || '',
      solar: qualificationData.solar?.toString() || '0',
      preference: qualificationData.preference || 'open',
    })
    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="relative">
      {/* Clear Storage Button (for testing - remove after fixing duplicates) */}
      <ClearStorageButton />

      {/* Success Animation */}
      {showSuccess && <QualificationSuccess isVisible={showSuccess} />}

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        onSkip={handleEmailSkip}
      />

      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="container mx-auto">
            <h2 className="text-lg font-semibold">VPP Finder Chat</h2>
            <p className="text-sm text-muted-foreground">
              Answer a few questions to find your perfect match
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        {!showSuccess && messages.length > 0 && (
          <div className="border-b bg-muted/30 py-4">
            <ConversationProgress currentStep={conversationState.step} />
          </div>
        )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          {messages.map((message, idx) => (
            <Message key={`${message.id}-${idx}`} {...message} />
          ))}
          {isStreaming && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <div className="container mx-auto max-w-3xl">
          {/* Quick Replies */}
          {!isStreaming && conversationState.replies.length > 0 && (
            <QuickReplies
              replies={conversationState.replies}
              onSelect={handleQuickReply}
              disabled={isStreaming}
            />
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isStreaming}
              className="flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              size="lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
