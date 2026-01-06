'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface QuickReply {
  text: string
  value: string
}

interface QuickRepliesProps {
  replies: QuickReply[]
  onSelect: (value: string) => void
  disabled?: boolean
}

/**
 * Quick Reply Buttons
 *
 * Shows suggested responses as clickable chips
 * Provides visual, one-click interaction instead of typing
 */
export function QuickReplies({ replies, onSelect, disabled = false }: QuickRepliesProps) {
  if (replies.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="flex flex-wrap gap-2 mb-4"
    >
      {replies.map((reply, index) => (
        <motion.div
          key={reply.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(reply.value)}
            disabled={disabled}
            className="rounded-full border-2 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
          >
            {reply.text}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}
