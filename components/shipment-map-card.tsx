"use client"

import dynamic from "next/dynamic"
import { MapPin, MapPinOff } from "lucide-react"

const ShipmentMap = dynamic(() => import("@/components/shipment-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
})

type ShipmentMapCardProps = {
  latitude: number | null
  longitude: number | null
  currentLocation: string | null
}

export function ShipmentMapCard({ latitude, longitude, currentLocation }: ShipmentMapCardProps) {
  const hasCoords = typeof latitude === "number" && typeof longitude === "number"

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-accent" />
          <h2 className="font-semibold">Current location</h2>
        </div>
        {currentLocation && <span className="truncate text-sm text-muted-foreground">{currentLocation}</span>}
      </div>

      <div className="relative h-[320px] w-full sm:h-[420px]">
        {hasCoords ? (
          <ShipmentMap latitude={latitude as number} longitude={longitude as number} label={currentLocation ?? undefined} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-muted text-center text-muted-foreground">
            <MapPinOff className="size-8" />
            <p className="text-sm">Location not available yet.</p>
            <p className="text-xs">The map updates once your package is scanned at a facility.</p>
          </div>
        )}
      </div>
    </div>
  )
}
