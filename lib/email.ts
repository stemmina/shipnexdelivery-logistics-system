import nodemailer from "nodemailer"
import type { Shipment } from "@/lib/shipment-service"

const SMTP_HOST = "smtp.hostinger.com"
const SMTP_PORT = 465
const FROM_EMAIL = "delivery@shipnexdelivery.site"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function formatStatus(status: Shipment["status"]) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getTransporter() {
  const password = process.env.HOSTINGER_SMTP_PASSWORD

  if (!password) {
    throw new Error("HOSTINGER_SMTP_PASSWORD is not configured")
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: FROM_EMAIL,
      pass: password,
    },
  })
}

export async function sendShipmentUpdateEmail(shipment: Shipment) {
  if (!shipment.receiver_email) {
    throw new Error("This shipment does not have a receiver email address")
  }

  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://shipnexdelivery.site"}/track/${encodeURIComponent(shipment.tracking_number)}`
  const status = formatStatus(shipment.status)
  const recipientName = escapeHtml(shipment.receiver_name)
  const trackingNumber = escapeHtml(shipment.tracking_number)
  const location = escapeHtml(shipment.current_location)
  const destination = escapeHtml(shipment.destination)

  await getTransporter().sendMail({
    from: `ShipNexDelivery <${FROM_EMAIL}>`,
    to: shipment.receiver_email,
    subject: `Delivery update for ${shipment.tracking_number}: ${status}`,
    text: [
      `Hello ${shipment.receiver_name},`,
      "",
      `Your ShipNexDelivery shipment ${shipment.tracking_number} is now ${status}.`,
      `Current location: ${shipment.current_location}`,
      `Destination: ${shipment.destination}`,
      `Track your shipment: ${trackingUrl}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17233d;max-width:600px;margin:auto">
        <h1 style="color:#172d5a">ShipNexDelivery</h1>
        <p>Hello ${recipientName},</p>
        <p>Your shipment <strong>${trackingNumber}</strong> is now <strong>${escapeHtml(status)}</strong>.</p>
        <p><strong>Current location:</strong> ${location}<br /><strong>Destination:</strong> ${destination}</p>
        <p><a href="${trackingUrl}" style="display:inline-block;background:#172d5a;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px">Track shipment</a></p>
        <p style="color:#667085;font-size:13px">This update was sent by ShipNexDelivery.</p>
      </div>
    `,
  })
}
