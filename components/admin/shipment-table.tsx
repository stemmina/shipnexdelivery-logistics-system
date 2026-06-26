"use client"

import Link from "next/link"
import { Shipment } from "@/lib/shipment-service"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Eye } from "lucide-react"
import { useState } from "react"
import { deleteShipmentAction } from "@/app/admin/shipments/actions"
import { useRouter } from "next/navigation"

interface ShipmentTableProps {
  shipments: Shipment[]
  onDelete?: () => void
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  in_transit: "bg-amber-100 text-amber-800",
  out_for_delivery: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function ShipmentTable({ shipments, onDelete }: ShipmentTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this shipment?")) {
      return
    }

    setDeletingId(id)
    const result = await deleteShipmentAction(id)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
      onDelete?.()
    }

    setDeletingId(null)
  }

  if (shipments.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No shipments found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Tracking Number</th>
            <th className="px-6 py-3 text-left font-semibold">Sender</th>
            <th className="px-6 py-3 text-left font-semibold">Receiver</th>
            <th className="px-6 py-3 text-left font-semibold">Status</th>
            <th className="px-6 py-3 text-left font-semibold">Current Location</th>
            <th className="px-6 py-3 text-left font-semibold">Est. Delivery</th>
            <th className="px-6 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="border-b border-border hover:bg-muted/50">
              <td className="px-6 py-4 font-mono font-semibold">
                {shipment.tracking_number}
              </td>
              <td className="px-6 py-4">{shipment.sender_name}</td>
              <td className="px-6 py-4">{shipment.receiver_name}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[shipment.status]}`}
                >
                  {shipment.status.replace(/_/g, " ")}
                </span>
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {shipment.current_location}
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {new Date(shipment.estimated_delivery).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={
                      <Link href={`/admin/shipments/${shipment.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    render={
                      <Link href={`/admin/shipments/${shipment.id}/edit`}>
                        <Edit2 className="size-4" />
                      </Link>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(shipment.id)}
                    disabled={deletingId === shipment.id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
