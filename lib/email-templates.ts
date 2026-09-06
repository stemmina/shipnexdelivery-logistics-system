import type { Shipment } from "@/lib/shipment-service"

export function getDefaultShipmentEmail(shipment: Pick<Shipment, "receiver_name" | "tracking_number" | "status" | "current_location" | "origin" | "destination" | "estimated_delivery">) {
  const status = shipment.status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  const deliveryDate = new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return {
    subject: `Your shipment ${shipment.tracking_number} is ${status}`,
    body: `Hello ${shipment.receiver_name},

Your ShipNexDelivery shipment is on its way. Here are the latest details:

Tracking number: ${shipment.tracking_number}
Status: ${status}
Current location: ${shipment.current_location}
Route: ${shipment.origin} to ${shipment.destination}
Estimated delivery: ${deliveryDate}

You can follow your shipment at:
{{tracking_url}}

Thank you for choosing ShipNexDelivery.

ShipNexDelivery Customer Care
 delivery@shipnexdelivery.site`,
  }
}
