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
  getShipmentById,
  updateShipmentEmailDraft,
  recordShipmentEmailEvent,
  getShipmentEmailEvents,
} from "@/lib/shipment-service"
import { generateTrackingNumber } from "@/lib/tracking-number-generator"
import { getDefaultShipmentEmail } from "@/lib/email-templates"
import { sendShipmentEmail } from "@/lib/email"

export async function createShipmentAction(formData: {
  trackingNumber?: string
  senderName: string
  receiverName: string
  receiverEmail?: string
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

    const emailDefaults = getDefaultShipmentEmail({
      receiver_name: formData.receiverName,
      tracking_number: trackingNumber,
      status: formData.status,
      current_location: formData.currentLocation,
      origin: formData.origin,
      destination: formData.destination,
      estimated_delivery: formData.estimatedDelivery,
    })

    const result = await createShipment({
      tracking_number: trackingNumber,
      sender_name: formData.senderName,
      receiver_name: formData.receiverName,
      receiver_email: formData.receiverEmail || null,
      origin: formData.origin,
      destination: formData.destination,
      current_location: formData.currentLocation,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      estimated_delivery: formData.estimatedDelivery,
      admin_notes: formData.adminNotes || null,
      email_subject: emailDefaults.subject,
      email_body: emailDefaults.body,
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
    receiverEmail?: string
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
      receiver_email: formData.receiverEmail || null,
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

export async function saveShipmentEmailDraftAction(id: string, subject: string, body: string) {
  if (!subject.trim() || !body.trim()) return { error: "Subject and message are required" }
  const result = await updateShipmentEmailDraft(id, subject.trim(), body.trim())
  if (!result) return { error: "Failed to save email draft" }
  revalidatePath(`/admin/shipments/${id}`)
  return { success: true }
}

export async function sendShipmentEmailAction(id: string, subject?: string, body?: string) {
  try {
    const shipment = await getShipmentById(id)
    if (!shipment) return { error: "Shipment not found" }
    if (!shipment.receiver_email) return { error: "Add a recipient email before sending" }

    const emailSubject = subject?.trim() || shipment.email_subject
    const emailBody = body?.trim() || shipment.email_body
    if (!emailSubject || !emailBody) return { error: "Create an email draft before sending" }

    await updateShipmentEmailDraft(id, emailSubject, emailBody)
    const result = await sendShipmentEmail({ shipment, subject: emailSubject, body: emailBody })
    await recordShipmentEmailEvent({
      shipmentId: id,
      recipientEmail: shipment.receiver_email,
      subject: emailSubject,
      body: emailBody,
      status: "sent",
      providerMessageId: result.messageId,
    })

    revalidatePath(`/admin/shipments/${id}`)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email"
    try {
      const failedShipment = await getShipmentById(id)
      if (failedShipment?.receiver_email) {
        await recordShipmentEmailEvent({
          shipmentId: id,
          recipientEmail: failedShipment.receiver_email,
          subject: subject || failedShipment.email_subject || "Shipment update",
          body: body || failedShipment.email_body || "",
          status: "failed",
          errorMessage: message,
        })
      }

    } catch {
      // Preserve the original send error when audit logging also fails.
    }
    return { error: message }
  }
}

export async function deleteShipmentEmailDraftAction(id: string) {
  const result = await updateShipment(id, { email_subject: null, email_body: null })
  if (!result) return { error: "Failed to delete email draft" }
  revalidatePath(`/admin/shipments/${id}`)
  revalidatePath("/admin/emails")
  return { success: true }
}

export async function getShipmentEmailEventsAction(id: string) {
  return getShipmentEmailEvents(id)
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
