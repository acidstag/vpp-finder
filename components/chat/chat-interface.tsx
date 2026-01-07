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
  solar: [
    { text: "Around 6.6kW", value: "Around 6.6kW" },
    { text: "Around 10kW", value: "Around 10kW" },
    { text: "No solar", value: "I don't have solar panels" },
    { text: "Not sure", value: "I'm not sure of the size" },
  ],
  retailerPreference: [
    { text: "Happy to switch", value: "I'm happy to switch for better earnings" },
    { text: "Keep current", value: "I'd prefer to keep my current retailer" },
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

  // Determine current conversation step based on what info has been collected
  const getConversationState = () => {
    const allText = messages.map(m => m.content.toLowerCase()).join(' ')
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase()).join(' ')
    const lastAiMessage = messages.filter(m => m.role === 'assistant').pop()?.content.toLowerCase() || ''

    // Check for qualification trigger
    if (allText.includes('qualified:')) return { step: 5, replies: [] }

    // Detect what info has been provided by looking at user messages
    // Extended battery brand list with common misspellings
    const batteryBrands = [
      'tesla', 'powerwall', 'power wall',
      'lg', 'lg chem', 'lgchem', 'lg-chem',
      'sonnen', 'sonen', 'sonnon',
      'sungrow', 'sun grow', 'sungrouw',
      'enphase', 'enphaze',
      'alpha', 'alphaess', 'alpha ess', 'alpha-ess',
      'byd', 'b.y.d',
      'redback', 'red back',
      'growatt', 'growat',
      'goodwe', 'good we',
      'solax', 'sola x',
      'fronius', 'huawei', 'pylontech', 'pylon',
      'simpliphi', 'eguana', 'senec', 'varta'
    ]
    const hasBattery = batteryBrands.some(b => userMessages.includes(b))

    // Postcode detection - must be valid Australian range (0200-9999)
    const postcodeMatch = userMessages.match(/\b([0-9]{4})\b/)
    const hasPostcode = postcodeMatch !== null && parseInt(postcodeMatch[1]) >= 200 && parseInt(postcodeMatch[1]) <= 9999

    // Solar detection - multiple patterns
    const solarPatterns = [
      /\d+(\.\d+)?\s*kw/i,                    // "6.6kw", "10 kW"
      /\d+(\.\d+)?\s*kilowatt/i,              // "6.6 kilowatts"
      /no\s*solar/i,                          // "no solar"
      /don'?t\s*have\s*(solar|panels)/i,      // "don't have solar", "dont have panels"
      /no\s*panels/i,                         // "no panels"
      /without\s*solar/i,                     // "without solar"
      /not\s*yet.*solar/i,                    // "not yet got solar"
      /none|nope|no(?:\s|$)/i,                // Simple "none", "nope" in context
    ]
    const hasSolar = solarPatterns.some(p => p.test(userMessages))

    // Retailer preference detection - expanded patterns
    const retailerPatterns = [
      /switch/i, /keep/i, /stay/i,            // Direct terms
      /current\s*retailer/i,                  // "current retailer"
      /open\s*to/i,                           // "open to switching"
      /happy\s*to/i,                          // "happy to switch"
      /willing/i,                             // "willing to switch"
      /don'?t\s*(mind|care)/i,                // "don't mind", "dont care"
      /whatever/i,                            // "whatever works"
      /advice/i,                              // "need advice"
      /recommend/i,                           // "what do you recommend"
      /best\s*(option|deal|earning)/i,        // "best option"
    ]
    const hasRetailerPref = retailerPatterns.some(p => p.test(userMessages))

    // Calculate step based on what's collected
    let step = 1
    if (hasBattery) step = 2
    if (hasBattery && hasPostcode) step = 3
    if (hasBattery && hasPostcode && hasSolar) step = 4
    if (hasBattery && hasPostcode && hasSolar && hasRetailerPref) step = 5

    // Determine quick replies based on what AI just asked
    // Order matters: check more specific patterns first
    let replies: typeof QUICK_REPLIES.initial = []

    if (messages.length <= 2) {
      replies = QUICK_REPLIES.initial
    } else if (lastAiMessage.includes('retailer') || lastAiMessage.includes('switch') || lastAiMessage.includes('stay with') || lastAiMessage.includes('electricity provider')) {
      // Retailer preference question
      replies = QUICK_REPLIES.retailerPreference
    } else if (lastAiMessage.includes('solar') || lastAiMessage.includes('kw') || lastAiMessage.includes('kilowatt') || lastAiMessage.includes('panels')) {
      // Solar question - show helpful quick replies
      replies = QUICK_REPLIES.solar
    } else if (lastAiMessage.includes('postcode') || lastAiMessage.includes('post code') || lastAiMessage.includes('suburb') || lastAiMessage.includes('area')) {
      // Location question - no quick replies, user must type postcode
      replies = []
    } else if ((lastAiMessage.includes('battery') || lastAiMessage.includes('brand') || lastAiMessage.includes('type')) && !lastAiMessage.includes('solar')) {
      // Battery brand question - but only if not asking about solar
      replies = QUICK_REPLIES.batteryType
    }

    return { step, replies }
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
        // Strip the QUALIFIED: line from displayed message
        const cleanMessage = aiMessage.replace(/\n?QUALIFIED:.*$/m, '').trim()
        updateLastMessage(cleanMessage)
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

          // Give user time to read the closing message before showing success
          setTimeout(() => {
            // Show success animation
            setShowSuccess(true)

            // After 1.5 seconds, show email modal
            setTimeout(() => {
              setShowSuccess(false)
              setShowEmailModal(true)
            }, 1500)
          }, 2000) // 2s delay to read the AI's closing message
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
    if (!qualificationData) return

    // Save email to database with qualification data
    await saveEmail(email, sessionId, 'chat')

    // Send results email
    try {
      await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          battery: qualificationData.battery,
          location: qualificationData.location,
          solar: qualificationData.solar,
          preference: qualificationData.preference,
        }),
      })
    } catch (error) {
      console.error('Failed to send results email:', error)
      // Continue anyway - don't block the user
    }

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
      source: 'chat',
    })
    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="relative">
      {/* Success Animation */}
      {showSuccess && <QualificationSuccess isVisible={showSuccess} />}

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        onSkip={handleEmailSkip}
        matchCount={11}
        battery={qualificationData?.battery || 'your battery'}
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
