export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 rounded-lg bg-muted animate-pulse" />

      <div className="h-12 rounded-lg border border-border bg-muted animate-pulse" />

      <div className="rounded-lg border border-border bg-card">
        <div className="h-64 animate-pulse bg-muted" />
      </div>
    </div>
  )
}
