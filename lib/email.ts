import nodemailer from "nodemailer"
import type { Shipment } from "@/lib/shipment-service"
import { getDefaultShipmentEmail, renderShipmentEmailHtml } from "@/lib/email-templates"

const SMTP_HOST = "smtp.hostinger.com"
const SMTP_PORT = 465
const FROM_EMAIL = "delivery@shipnexdelivery.site"

function getTransporter() {
  const password = process.env.HOSTINGER_SMTP_PASSWORD
  if (!password) throw new Error("HOSTINGER_SMTP_PASSWORD is not configured")

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user: FROM_EMAIL, pass: password },
  })
}

export async function sendShipmentEmail(input: {
  shipment: Shipment
  subject: string
  body: string
}) {
  if (!input.shipment.receiver_email) throw new Error("This shipment does not have a receiver email address")

  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://shipnexdelivery.site"}/track/${encodeURIComponent(input.shipment.tracking_number)}`
  const body = input.body.replaceAll("{{tracking_url}}", trackingUrl)

  const result = await getTransporter().sendMail({
    from: `ShipNexDelivery <${FROM_EMAIL}>`,
    to: input.shipment.receiver_email,
    subject: input.subject,
    text: body,
    html: renderShipmentEmailHtml(input.shipment, body),
  })

  return { messageId: result.messageId }
}

export function getShipmentEmailDefaults(shipment: Shipment) {
  return getDefaultShipmentEmail(shipment)
}
