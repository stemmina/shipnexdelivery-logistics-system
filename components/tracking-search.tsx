"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TrackingSearch({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    setLoading(true)
    router.push(`/track/${encodeURIComponent(trimmed)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-lg bg-background px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your tracking number (e.g. SNX123456789)"
          aria-label="Tracking number"
          className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
        />
      </div>
      <Button type="submit" size="lg" className="h-11 px-6" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        Track package
      </Button>
    </form>
  )
}
