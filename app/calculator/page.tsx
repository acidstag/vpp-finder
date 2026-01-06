import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CalculatorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="p-8 max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold">Calculator Coming Soon</h1>
        <p className="text-muted-foreground">
          The traditional calculator is under development. For now, try our AI chat for the best experience!
        </p>
        <Button size="lg" asChild>
          <Link href="/chat">Start AI Chat</Link>
        </Button>
      </Card>
    </main>
  )
}
