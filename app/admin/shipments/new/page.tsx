import { ShipmentForm } from "@/components/admin/shipment-form"

export default function NewShipmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Shipment</h1>
        <p className="text-muted-foreground">Add a new shipment to the system.</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <ShipmentForm />
      </div>
    </div>
  )
}
