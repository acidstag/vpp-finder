import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <div className="text-8xl font-mono font-black text-accent">404</div>
          <h2 className="font-display font-bold text-3xl">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/chat">Chat with AI</Link>
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Looking for VPP programs?{' '}
            <Link href="/chat" className="text-accent hover:underline">
              Start comparing now →
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
