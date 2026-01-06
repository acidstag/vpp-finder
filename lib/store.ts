import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from './matching'
import { getSessionId, generateConversationId } from './session'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatStore {
  messages: Message[]
  isStreaming: boolean
  userProfile: Partial<UserProfile>
  sessionId: string
  conversationId: string
  hasHydrated: boolean
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  updateLastMessage: (content: string) => void
  setStreaming: (streaming: boolean) => void
  updateProfile: (profile: Partial<UserProfile>) => void
  resetChat: () => void
  startNewConversation: () => void
  setHydrated: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      isStreaming: false,
      userProfile: {},
      sessionId: getSessionId(),
      conversationId: generateConversationId(),
      hasHydrated: false,

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: Math.random().toString(36).substring(7),
              timestamp: new Date(),
            },
          ],
        })),

      updateLastMessage: (content) =>
        set((state) => ({
          messages: state.messages.map((msg, idx) =>
            idx === state.messages.length - 1 ? { ...msg, content } : msg
          ),
        })),

      setStreaming: (streaming) =>
        set({ isStreaming: streaming }),

      updateProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),

      resetChat: () =>
        set({
          messages: [],
          isStreaming: false,
          userProfile: {},
          conversationId: generateConversationId(),
        }),

      startNewConversation: () =>
        set({
          messages: [],
          isStreaming: false,
          userProfile: {},
          conversationId: generateConversationId(),
        }),

      setHydrated: () =>
        set({ hasHydrated: true }),
    }),
    {
      name: 'vpp-chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        userProfile: state.userProfile,
        sessionId: state.sessionId,
        conversationId: state.conversationId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
