import { Package } from "lucide-react"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-48 rounded-lg bg-muted animate-pulse" />

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-6 w-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
