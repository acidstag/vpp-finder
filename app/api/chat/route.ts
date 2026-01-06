import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '@/lib/prompts'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check
    const identifier = req.headers.get('x-forwarded-for') || req.ip || 'unknown'
    const rateLimitResult = rateLimit({
      identifier,
      limit: env.RATE_LIMIT_REQUESTS,
      windowSeconds: env.RATE_LIMIT_WINDOW_SECONDS,
    })

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Please wait a moment before sending another message.',
          retryAfter: rateLimitResult.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': env.RATE_LIMIT_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
      )
    }

    const { messages } = await req.json()

    // Create streaming response from Claude
    const stream = await anthropic.messages.create({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
    })

    // Create a readable stream to send to client
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                // Send each chunk of text
                controller.enqueue(encoder.encode(event.delta.text))
              }
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
