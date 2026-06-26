"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createShipmentAction,
  updateShipmentAction,
} from "@/app/admin/shipments/actions"
import { generateTrackingNumber } from "@/lib/tracking-number-generator"
import { Shipment } from "@/lib/shipment-service"

interface ShipmentFormProps {
  shipment?: Shipment
  isEditing?: boolean
}

export function ShipmentForm({ shipment, isEditing = false }: ShipmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoGenerate, setAutoGenerate] = useState(!shipment)

  const [formData, setFormData] = useState({
    trackingNumber: shipment?.tracking_number || "",
    senderName: shipment?.sender_name || "",
    receiverName: shipment?.receiver_name || "",
    origin: shipment?.origin || "",
    destination: shipment?.destination || "",
    currentLocation: shipment?.current_location || "",
    latitude: shipment?.latitude || 0,
    longitude: shipment?.longitude || 0,
    status: (shipment?.status || "pending") as
      | "pending"
      | "in_transit"
      | "out_for_delivery"
      | "delivered"
      | "cancelled",
    estimatedDelivery: shipment?.estimated_delivery || "",
    adminNotes: shipment?.admin_notes || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let result

      if (isEditing && shipment) {
        result = await updateShipmentAction(shipment.id, {
          senderName: formData.senderName,
          receiverName: formData.receiverName,
          origin: formData.origin,
          destination: formData.destination,
          currentLocation: formData.currentLocation,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          status: formData.status,
          estimatedDelivery: formData.estimatedDelivery,
          adminNotes: formData.adminNotes,
        })
      } else {
        result = await createShipmentAction({
          trackingNumber: autoGenerate ? undefined : formData.trackingNumber,
          senderName: formData.senderName,
          receiverName: formData.receiverName,
          origin: formData.origin,
          destination: formData.destination,
          currentLocation: formData.currentLocation,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          status: formData.status,
          estimatedDelivery: formData.estimatedDelivery,
          adminNotes: formData.adminNotes,
        })
      }

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      router.push("/admin/shipments")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Tracking Number */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="trackingNumber">Tracking Number</Label>
          <div className="flex gap-2">
            <Input
              id="trackingNumber"
              placeholder="SNX000001"
              value={formData.trackingNumber}
              onChange={(e) =>
                setFormData({ ...formData, trackingNumber: e.target.value })
              }
              disabled={autoGenerate || isEditing}
            />
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAutoGenerate(!autoGenerate)
                  if (!autoGenerate) {
                    setFormData({ ...formData, trackingNumber: "" })
                  } else {
                    setFormData({
                      ...formData,
                      trackingNumber: generateTrackingNumber(),
                    })
                  }
                }}
              >
                {autoGenerate ? "Auto" : "Manual"}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {autoGenerate ? "Will be auto-generated" : "Manual entry"}
          </p>
        </div>
      </div>

      {/* Sender & Receiver */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="senderName">Sender Name</Label>
          <Input
            id="senderName"
            placeholder="John Doe"
            required
            value={formData.senderName}
            onChange={(e) =>
              setFormData({ ...formData, senderName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="receiverName">Receiver Name</Label>
          <Input
            id="receiverName"
            placeholder="Jane Smith"
            required
            value={formData.receiverName}
            onChange={(e) =>
              setFormData({ ...formData, receiverName: e.target.value })
            }
          />
        </div>
      </div>

      {/* Origin & Destination */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            placeholder="New York, NY"
            required
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            placeholder="Los Angeles, CA"
            required
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
          />
        </div>
      </div>

      {/* Current Location */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentLocation">Current Location</Label>
        <Input
          id="currentLocation"
          placeholder="Chicago, IL"
          required
          value={formData.currentLocation}
          onChange={(e) =>
            setFormData({ ...formData, currentLocation: e.target.value })
          }
        />
      </div>

      {/* Coordinates */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            placeholder="40.7128"
            required
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            placeholder="-74.0060"
            required
            value={formData.longitude}
            onChange={(e) =>
              setFormData({ ...formData, longitude: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as typeof formData.status,
            })
          }
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Estimated Delivery */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
        <Input
          id="estimatedDelivery"
          type="datetime-local"
          required
          value={formData.estimatedDelivery}
          onChange={(e) =>
            setFormData({ ...formData, estimatedDelivery: e.target.value })
          }
        />
      </div>

      {/* Admin Notes */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="adminNotes">Admin Notes</Label>
        <textarea
          id="adminNotes"
          placeholder="Any special notes or instructions..."
          value={formData.adminNotes}
          onChange={(e) =>
            setFormData({ ...formData, adminNotes: e.target.value })
          }
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {isEditing ? "Update Shipment" : "Create Shipment"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
