import { getShipmentById } from "@/lib/shipment-service"
import { notFound } from "next/navigation"
import { ShipmentForm } from "@/components/admin/shipment-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EditShipmentPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditShipmentPage({ params }: EditShipmentPageProps) {
  const { id } = await params
  const shipment = await getShipmentById(id)

  if (!shipment) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/shipments/${id}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Shipment</h1>
          <p className="text-muted-foreground">{shipment.tracking_number}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <ShipmentForm shipment={shipment} isEditing />
      </div>
    </div>
  )
}
