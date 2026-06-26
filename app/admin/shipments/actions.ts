"use server"

import { revalidatePath } from "next/cache"
import {
  createShipment,
  updateShipment,
  deleteShipment,
  updateShipmentStatus,
  updateShipmentLocation,
  updateShipmentEstimatedDelivery,
  updateShipmentAdminNotes,
} from "@/lib/shipment-service"
import { generateTrackingNumber } from "@/lib/tracking-number-generator"

export async function createShipmentAction(formData: {
  trackingNumber?: string
  senderName: string
  receiverName: string
  origin: string
  destination: string
  currentLocation: string
  latitude: number
  longitude: number
  status: "pending" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled"
  estimatedDelivery: string
  adminNotes?: string
}) {
  try {
    const trackingNumber = formData.trackingNumber || generateTrackingNumber()

    const result = await createShipment({
      tracking_number: trackingNumber,
      sender_name: formData.senderName,
      receiver_name: formData.receiverName,
      origin: formData.origin,
      destination: formData.destination,
      current_location: formData.currentLocation,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      estimated_delivery: formData.estimatedDelivery,
      admin_notes: formData.adminNotes || null,
    })

    if (!result) {
      return { error: "Failed to create shipment" }
    }

    revalidatePath("/admin/shipments")
    revalidatePath("/admin")

    return { success: true, shipment: result }
  } catch (error) {
    console.error("Error creating shipment:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateShipmentAction(
  id: string,
  formData: {
    senderName: string
    receiverName: string
    origin: string
    destination: string
    currentLocation: string
    latitude: number
    longitude: number
    status: "pending" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled"
    estimatedDelivery: string
    adminNotes?: string
  }
) {
  try {
    const result = await updateShipment(id, {
      sender_name: formData.senderName,
      receiver_name: formData.receiverName,
      origin: formData.origin,
      destination: formData.destination,
      current_location: formData.currentLocation,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      estimated_delivery: formData.estimatedDelivery,
      admin_notes: formData.adminNotes || null,
    })

    if (!result) {
      return { error: "Failed to update shipment" }
    }

    revalidatePath("/admin/shipments")
    revalidatePath("/admin/shipments/[id]")
    revalidatePath("/admin")

    return { success: true, shipment: result }
  } catch (error) {
    console.error("Error updating shipment:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function deleteShipmentAction(id: string) {
  try {
    const success = await deleteShipment(id)

    if (!success) {
      return { error: "Failed to delete shipment" }
    }

    revalidatePath("/admin/shipments")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error deleting shipment:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateStatusAction(
  id: string,
  status: "pending" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled"
) {
  try {
    const result = await updateShipmentStatus(id, status)

    if (!result) {
      return { error: "Failed to update status" }
    }

    revalidatePath("/admin/shipments")
    revalidatePath("/admin/shipments/[id]")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error updating status:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateLocationAction(id: string, location: string, latitude: number, longitude: number) {
  try {
    const result = await updateShipmentLocation(id, location, latitude, longitude)

    if (!result) {
      return { error: "Failed to update location" }
    }

    revalidatePath("/admin/shipments")
    revalidatePath("/admin/shipments/[id]")

    return { success: true }
  } catch (error) {
    console.error("Error updating location:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateEstimatedDeliveryAction(id: string, date: string) {
  try {
    const result = await updateShipmentEstimatedDelivery(id, date)

    if (!result) {
      return { error: "Failed to update estimated delivery" }
    }

    revalidatePath("/admin/shipments")
    revalidatePath("/admin/shipments/[id]")

    return { success: true }
  } catch (error) {
    console.error("Error updating estimated delivery:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateAdminNotesAction(id: string, notes: string) {
  try {
    const result = await updateShipmentAdminNotes(id, notes)

    if (!result) {
      return { error: "Failed to update admin notes" }
    }

    revalidatePath("/admin/shipments")
    revalidatePath("/admin/shipments/[id]")

    return { success: true }
  } catch (error) {
    console.error("Error updating admin notes:", error)
    return { error: "An unexpected error occurred" }
  }
}
