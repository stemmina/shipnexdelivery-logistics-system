"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TrackingSearchProps {
  initialValue?: string
}

export function TrackingSearch({ initialValue = "" }: TrackingSearchProps) {
  const router = useRouter()
  const [trackingNumber, setTrackingNumber] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setLoading(true)
    router.push(`/track/${encodeURIComponent(trackingNumber.toUpperCase())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Enter tracking number (e.g., SNX000001)"
            value={trackingNumber}
            onChange={(e) => {
              setTrackingNumber(e.target.value.toUpperCase())
              setError(null)
            }}
            className="pl-10"
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Tracking...
            </>
          ) : (
            "Track Package"
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  )
}
