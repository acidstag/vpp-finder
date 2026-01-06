'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <div className="text-6xl font-mono text-muted-foreground">⚠️</div>
          <h2 className="font-display font-bold text-3xl">Something went wrong</h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={reset} size="lg">
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </Card>
    </div>
  )
}
