import { createClient } from "@/lib/supabase/server"

export interface Shipment {
  id: string
  tracking_number: string
  sender_name: string
  receiver_name: string
  receiver_email: string | null
  origin: string
  destination: string
  current_location: string
  latitude: number
  longitude: number
  status: "pending" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled"
  estimated_delivery: string
  admin_notes: string | null
  created_at: string
  updated_at: string
  email_subject: string | null
  email_body: string | null
  email_status: "not_sent" | "sent" | "failed"
  email_sent_at: string | null
  email_last_error: string | null
}

export interface ShipmentInput {
  tracking_number: string
  sender_name: string
  receiver_name: string
  receiver_email?: string | null
  origin: string
  destination: string
  current_location: string
  latitude: number
  longitude: number
  status: "pending" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled"
  estimated_delivery: string
  admin_notes?: string | null
  email_subject?: string | null
  email_body?: string | null
}

/**
 * Fetch a single shipment by tracking number
 */
export async function getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("tracking_number", trackingNumber)
    .single()

  if (error) {
    console.error("Error fetching shipment:", error)
    return null
  }

  return data as Shipment
}

/**
 * Fetch a single shipment by ID
 */
export async function getShipmentById(id: string): Promise<Shipment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("shipments").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching shipment:", error)
    return null
  }

  return data as Shipment
}

/**
 * Fetch all shipments with optional filtering and pagination
 */
export async function getAllShipments(
  filters?: {
    status?: string
    search?: string
    limit?: number
    offset?: number
  }
): Promise<{ data: Shipment[]; count: number }> {
  const supabase = await createClient()

  let query = supabase.from("shipments").select("*", { count: "exact" })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.or(
      `tracking_number.ilike.%${filters.search}%,sender_name.ilike.%${filters.search}%,receiver_name.ilike.%${filters.search}%`
    )
  }

  query = query.order("created_at", { ascending: false })

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching shipments:", error)
    return { data: [], count: 0 }
  }

  return { data: (data || []) as Shipment[], count: count || 0 }
}

/**
 * Create a new shipment
 */
export async function createShipment(input: ShipmentInput): Promise<Shipment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shipments")
    .insert([
      {
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating shipment:", error)
    return null
  }

  return data as Shipment
}

/**
 * Update an existing shipment
 */
export async function updateShipment(id: string, updates: Partial<ShipmentInput>): Promise<Shipment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("shipments")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating shipment:", error)
    return null
  }

  return data as Shipment
}

/**
 * Delete a shipment
 */
export async function deleteShipment(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from("shipments").delete().eq("id", id)

  if (error) {
    console.error("Error deleting shipment:", error)
    return false
  }

  return true
}

/**
 * Update shipment status
 */
export async function updateShipmentStatus(
  id: string,
  status: "pending" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled"
): Promise<Shipment | null> {
  return updateShipment(id, { status })
}

/**
 * Update shipment location and coordinates
 */
export async function updateShipmentLocation(
  id: string,
  location: string,
  latitude: number,
  longitude: number
): Promise<Shipment | null> {
  return updateShipment(id, { current_location: location, latitude, longitude })
}

/**
 * Update shipment estimated delivery date
 */
export async function updateShipmentEstimatedDelivery(id: string, date: string): Promise<Shipment | null> {
  return updateShipment(id, { estimated_delivery: date })
}

/**
 * Update shipment admin notes
 */
export async function updateShipmentAdminNotes(id: string, notes: string): Promise<Shipment | null> {
  return updateShipment(id, { admin_notes: notes })
}

export async function updateShipmentEmailDraft(
  id: string,
  emailSubject: string,
  emailBody: string,
): Promise<Shipment | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shipments")
    .update({ email_subject: emailSubject, email_body: emailBody, email_last_error: null })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating shipment email draft:", error)
    return null
  }

  return data as Shipment
}

export async function recordShipmentEmailEvent(input: {
  shipmentId: string
  recipientEmail: string
  subject: string
  body: string
  status: "sent" | "failed"
  providerMessageId?: string | null
  errorMessage?: string | null
}) {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { error: eventError } = await supabase.from("shipment_email_events").insert({
    shipment_id: input.shipmentId,
    recipient_email: input.recipientEmail,
    subject: input.subject,
    body: input.body,
    status: input.status,
    provider_message_id: input.providerMessageId ?? null,
    error_message: input.errorMessage ?? null,
  })

  if (eventError) throw eventError

  const { error: shipmentError } = await supabase
    .from("shipments")
    .update({
      email_status: input.status,
      email_sent_at: input.status === "sent" ? now : null,
      email_last_error: input.errorMessage ?? null,
    })
    .eq("id", input.shipmentId)

  if (shipmentError) throw shipmentError
}

export async function getShipmentEmailEvents(shipmentId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shipment_email_events")
    .select("*")
    .eq("shipment_id", shipmentId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching shipment email events:", error)
    return []
  }

  return data ?? []
}
