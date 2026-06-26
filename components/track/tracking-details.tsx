"use client"

import { MapPin, AlertCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { Shipment } from "@/lib/shipment-service"

const TrackingMap = dynamic(() => import("@/components/track/tracking-map").then((mod) => ({ default: mod.TrackingMap })), {
  loading: () => <div className="h-96 rounded-lg border border-border bg-muted animate-pulse" />,
  ssr: false,
})

interface TrackingDetailsProps {
  shipment: Shipment
}

export function TrackingDetails({ shipment }: TrackingDetailsProps) {
  const statusSteps = [
    { status: "pending", label: "Order Placed" },
    { status: "in_transit", label: "In Transit" },
    { status: "out_for_delivery", label: "Out for Delivery" },
    { status: "delivered", label: "Delivered" },
  ]

  const currentStepIndex = statusSteps.findIndex((step) => step.status === shipment.status)
  const isDelivered = shipment.status === "delivered"
  const isCancelled = shipment.status === "cancelled"

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tracking Number</p>
            <p className="font-mono text-2xl font-bold">{shipment.tracking_number}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Status</p>
            <div className="mt-1 flex items-center justify-end gap-2">
              {isCancelled ? (
                <span className="inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800">
                  Cancelled
                </span>
              ) : isDelivered ? (
                <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                  Delivered
                </span>
              ) : (
                <span className="inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
                  {shipment.status.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 font-semibold">Delivery Timeline</h2>
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex

              return (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`h-8 w-0.5 ${
                          index < currentStepIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className={`font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-accent font-semibold mt-1">Current Status</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Current Location & Map */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2 font-semibold">
          <MapPin className="size-4" />
          Current Location
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{shipment.current_location}</p>
        <div className="rounded-lg overflow-hidden border border-border h-96">
          <TrackingMap latitude={shipment.latitude} longitude={shipment.longitude} />
        </div>
      </div>

      {/* Shipment Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold">Sender Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
              <dd className="font-medium">{shipment.sender_name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Origin</dt>
              <dd className="font-medium">{shipment.origin}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold">Receiver Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Name</dt>
              <dd className="font-medium">{shipment.receiver_name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Destination</dt>
              <dd className="font-medium">{shipment.destination}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Estimated Delivery & Last Updated */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
          <p className="mt-2 text-lg font-semibold">
            {new Date(shipment.estimated_delivery).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Last Updated</p>
          <p className="mt-2 text-lg font-semibold">
            {new Date(shipment.updated_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Admin Notes */}
      {shipment.admin_notes && (
        <div className="rounded-lg border border-border bg-blue-50 p-6 dark:bg-blue-950/20">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="size-4 text-blue-600 dark:text-blue-400" />
            <p className="font-semibold text-blue-900 dark:text-blue-100">Important Information</p>
          </div>
          <p className="whitespace-pre-wrap text-sm text-blue-800 dark:text-blue-200">{shipment.admin_notes}</p>
        </div>
      )}
    </div>
  )
}
