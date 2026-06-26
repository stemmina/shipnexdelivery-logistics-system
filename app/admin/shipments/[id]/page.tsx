import { getShipmentById } from "@/lib/shipment-service"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Truck, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  in_transit: "bg-amber-100 text-amber-800",
  out_for_delivery: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

interface ShipmentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ShipmentDetailPage({ params }: ShipmentDetailPageProps) {
  const { id } = await params
  const shipment = await getShipmentById(id)

  if (!shipment) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" render={<Link href="/admin/shipments"><ArrowLeft className="size-4" /></Link>} />
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{shipment.tracking_number}</h1>
          <p className="text-muted-foreground">Shipment details and tracking information</p>
        </div>
        <Button render={<Link href={`/admin/shipments/${id}/edit`}>Edit</Link>} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipment Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold">Shipment Information</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted-foreground">Tracking Number</dt>
              <dd className="font-mono font-semibold">{shipment.tracking_number}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[shipment.status]}`}>
                  {STATUS_LABELS[shipment.status]}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Created</dt>
              <dd>{new Date(shipment.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Last Updated</dt>
              <dd>{new Date(shipment.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {/* Parties Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold">Sender & Receiver</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted-foreground">Sender Name</dt>
              <dd>{shipment.sender_name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Receiver Name</dt>
              <dd>{shipment.receiver_name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Origin</dt>
              <dd>{shipment.origin}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Destination</dt>
              <dd>{shipment.destination}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Location Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <MapPin className="size-4" />
            Current Location
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted-foreground">Location</dt>
              <dd>{shipment.current_location}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Latitude</dt>
              <dd className="font-mono">{shipment.latitude.toFixed(6)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Longitude</dt>
              <dd className="font-mono">{shipment.longitude.toFixed(6)}</dd>
            </div>
          </dl>
        </div>

        {/* Delivery Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <Calendar className="size-4" />
            Delivery Information
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted-foreground">Estimated Delivery</dt>
              <dd>{new Date(shipment.estimated_delivery).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Admin Notes */}
      {shipment.admin_notes && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <FileText className="size-4" />
            Admin Notes
          </div>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{shipment.admin_notes}</p>
        </div>
      )}
    </div>
  )
}
