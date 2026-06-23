import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Package, MapPin, CalendarClock, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TrackingSearch } from "@/components/tracking-search"
import { StatusBadge } from "@/components/status-badge"
import { StatusTimeline } from "@/components/status-timeline"
import { ShipmentMapCard } from "@/components/shipment-map-card"
import { Button } from "@/components/ui/button"
import { formatDate, formatDateTime, type Shipment } from "@/lib/shipments"

export const dynamic = "force-dynamic"

export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackingNumber: string }>
}) {
  const { trackingNumber } = await params
  const decoded = decodeURIComponent(trackingNumber).trim()

  const supabase = await createClient()
  const { data } = await supabase
    .from("shipments")
    .select("*")
    .ilike("tracking_number", decoded)
    .maybeSingle()

  const shipment = data as Shipment | null

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-12">
          <Button variant="ghost" size="sm" render={<Link href="/"><ArrowLeft className="size-4" />Back to home</Link>} />

          {!shipment ? (
            <NotFoundState query={decoded} />
          ) : (
            <ShipmentDetails shipment={shipment} />
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function NotFoundState({ query }: { query: string }) {
  return (
    <div className="mt-8 flex flex-col items-center rounded-xl border border-border bg-card px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Package className="size-7 text-muted-foreground" />
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">No shipment found</h1>
      <p className="mt-2 max-w-md text-pretty text-muted-foreground">
        We couldn&apos;t find a shipment for tracking number{" "}
        <span className="font-mono font-semibold text-foreground">{query}</span>. Double-check the number and try
        again.
      </p>
      <div className="mt-6 w-full max-w-lg">
        <TrackingSearch initialValue={query} />
      </div>
    </div>
  )
}

function ShipmentDetails({ shipment }: { shipment: Shipment }) {
  return (
    <div className="mt-6 space-y-6">
      {/* Header card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tracking number</p>
            <p className="font-mono text-xl font-semibold tracking-tight sm:text-2xl">{shipment.tracking_number}</p>
          </div>
          <StatusBadge status={shipment.status} className="text-sm" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoTile icon={MapPin} label="From" value={shipment.origin ?? "—"} />
          <InfoTile icon={MapPin} label="To" value={shipment.destination ?? "—"} />
          <InfoTile icon={CalendarClock} label="Estimated delivery" value={formatDate(shipment.estimated_delivery)} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Map */}
        <ShipmentMapCard
          latitude={shipment.latitude}
          longitude={shipment.longitude}
          currentLocation={shipment.current_location}
        />

        {/* Timeline */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-5 font-semibold">Delivery progress</h2>
          <StatusTimeline status={shipment.status} />
        </div>
      </div>

      {/* Admin note */}
      {shipment.admin_note && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="size-4 text-accent" />
            <h2 className="font-semibold">Latest update</h2>
          </div>
          <p className="text-pretty leading-relaxed text-muted-foreground">{shipment.admin_note}</p>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Last updated {formatDateTime(shipment.updated_at)}
      </p>
    </div>
  )
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-1 font-medium text-balance">{value}</p>
    </div>
  )
}
