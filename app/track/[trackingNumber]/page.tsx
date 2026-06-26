import { getShipmentByTrackingNumber } from "@/lib/shipment-service"
import { TrackingDetails } from "@/components/track/tracking-details"
import { TrackingSearch } from "@/components/tracking-search"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ArrowLeft } from "lucide-react"

interface TrackPageProps {
  params: Promise<{
    trackingNumber: string
  }>
}

export async function generateMetadata({ params }: TrackPageProps) {
  const { trackingNumber } = await params
  return {
    title: `Track Shipment ${trackingNumber} - ShipNexDelivery`,
    description: `Real-time tracking for shipment ${trackingNumber}`,
  }
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { trackingNumber } = await params
  const shipment = await getShipmentByTrackingNumber(decodeURIComponent(trackingNumber))

  if (!shipment) {
    notFound()
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              render={
                <Link href="/">
                  <ArrowLeft className="size-4" />
                </Link>
              }
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">Track Your Shipment</h1>
              <p className="text-muted-foreground">Real-time updates on your delivery</p>
            </div>
          </div>

          <div className="mb-8 max-w-2xl">
            <TrackingSearch initialValue={shipment.tracking_number} />
          </div>

          <TrackingDetails shipment={shipment} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
