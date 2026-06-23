export type Shipment = {
  id: string
  tracking_number: string
  status: string
  current_location: string | null
  latitude: number | null
  longitude: number | null
  admin_note: string | null
  origin: string | null
  destination: string | null
  estimated_delivery: string | null
  created_at: string
  updated_at: string
}

// Ordered list of lifecycle statuses used for the progress timeline.
export const SHIPMENT_STATUSES = [
  "Pending",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
] as const

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number]

// Statuses that fall outside the happy-path timeline.
export const EXCEPTION_STATUSES = ["On Hold", "Exception", "Returned"] as const

export const ALL_STATUSES = [...SHIPMENT_STATUSES, ...EXCEPTION_STATUSES] as const

export function statusIndex(status: string): number {
  return SHIPMENT_STATUSES.indexOf(status as ShipmentStatus)
}

export function isExceptionStatus(status: string): boolean {
  return (EXCEPTION_STATUSES as readonly string[]).includes(status)
}

export function formatDate(value: string | null): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateTime(value: string | null): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
