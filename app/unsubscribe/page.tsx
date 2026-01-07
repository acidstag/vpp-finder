'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to unsubscribe')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError('Something went wrong. Please try again or contact support.')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-4">
            You've Been Unsubscribed
          </h1>
          <p className="text-muted-foreground mb-6">
            We've removed {email} from our mailing list. You won't receive any more emails from us.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Changed your mind? You can always sign up again through our website.
          </p>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to VPP Finder
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl mb-2">
            Unsubscribe from Emails
          </h1>
          <p className="text-muted-foreground">
            Enter your email address below to unsubscribe from all VPP Finder marketing emails.
          </p>
        </div>

        <form onSubmit={handleUnsubscribe} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Note: This will only unsubscribe you from marketing emails. You may still receive transactional emails related to your account activity.
          </p>
          <Link href="/" className="text-sm text-accent hover:underline">
            Return to VPP Finder
          </Link>
        </div>
      </Card>
    </div>
  )
}
