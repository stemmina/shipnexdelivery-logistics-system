import { createClient } from "@/lib/supabase/server"

export interface Shipment {
  id: string
  tracking_number: string
  sender_name: string
  receiver_name: string
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
}

export interface ShipmentInput {
  tracking_number: string
  sender_name: string
  receiver_name: string
  origin: string
  destination: string
  current_location: string
  latitude: number
  longitude: number
  status: "pending" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled"
  estimated_delivery: string
  admin_notes?: string | null
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
