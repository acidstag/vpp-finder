export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground font-mono text-sm">Loading...</p>
      </div>
    </div>
  )
}
