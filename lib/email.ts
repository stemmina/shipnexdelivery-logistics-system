import nodemailer from "nodemailer"
import type { Shipment } from "@/lib/shipment-service"
import { getDefaultShipmentEmail } from "@/lib/email-templates"

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
  const html = body
    .split("\n")
    .map((line) => (line.trim() ? `<p style="margin:0 0 14px">${escapeHtml(line).replaceAll(trackingUrl, `<a href="${escapeHtml(trackingUrl)}">${escapeHtml(trackingUrl)}</a>`)}</p>` : "<div style=\"height:6px\"></div>"))
    .join("")

  const result = await getTransporter().sendMail({
    from: `ShipNexDelivery <${FROM_EMAIL}>`,
    to: input.shipment.receiver_email,
    subject: input.subject,
    text: body,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17233d;max-width:620px;margin:auto"><div style="border-top:5px solid #e11d2e;padding:28px 24px;background:#f8fafc"><h1 style="color:#172d5a;margin:0 0 22px">ShipNexDelivery</h1>${html}<div style="margin-top:24px;padding-top:18px;border-top:1px solid #dbe2ea;color:#667085;font-size:13px">This message was sent from delivery@shipnexdelivery.site.</div></div></div>`,
  })

  return { messageId: result.messageId }
}

export function getShipmentEmailDefaults(shipment: Shipment) {
  return getDefaultShipmentEmail(shipment)
}
