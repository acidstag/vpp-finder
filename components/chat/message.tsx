import { cn } from '@/lib/utils'

interface MessageProps {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Clean message content by removing system/technical strings
 * that shouldn't be displayed to users
 */
function cleanContent(content: string): string {
  // Remove QUALIFIED: lines (both pipe-separated and JSON formats)
  return content
    .replace(/QUALIFIED:\s*battery=[^\n]+/gi, '')
    .replace(/QUALIFIED:\s*\{[^}]+\}/gi, '')
    .trim()
}

export function Message({ role, content }: MessageProps) {
  const displayContent = role === 'assistant' ? cleanContent(content) : content

  // Don't render empty messages
  if (!displayContent) return null

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3 animate-smooth',
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayContent}</p>
      </div>
    </div>
  )
}
