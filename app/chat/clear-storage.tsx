'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export function ClearStorageButton() {
  const router = useRouter()
  const resetChat = useChatStore((state) => state.resetChat)

  const handleClear = () => {
    // Clear the store
    resetChat()

    // Clear localStorage completely
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vpp-chat-storage')
    }

    // Reload the page to start fresh
    router.refresh()
    window.location.reload()
  }

  return (
    <button
      onClick={handleClear}
      className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors text-sm font-medium z-50"
    >
      Clear Chat & Fix Duplicates
    </button>
  )
}
