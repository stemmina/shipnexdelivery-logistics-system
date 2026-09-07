import type { Shipment } from "@/lib/shipment-service"

const SITE_URL = "https://shipnexdelivery.site"

function formatStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function nextStepForStatus(status: string) {
  if (status === "delivered") return "Shipment complete"
  if (status === "out_for_delivery") return "Delivery expected soon"
  if (status === "in_transit") return "Continue tracking"
  return "Shipment processing"
}

export function getDefaultShipmentEmail(
  shipment: Pick<Shipment, "receiver_name" | "tracking_number" | "status" | "current_location" | "origin" | "destination" | "estimated_delivery">,
) {
  const status = formatStatus(shipment.status)
  const deliveryDate = formatDate(shipment.estimated_delivery)

  return {
    subject: `Your shipment ${shipment.tracking_number} is ${status}`,
    body: `Hello ${shipment.receiver_name},\n\nWe're pleased to provide you with an update on your shipment. Your package is currently moving through our logistics network.\n\nCurrent status: ${status}\nTracking number: ${shipment.tracking_number}\nCurrent location: ${shipment.current_location}\nEstimated delivery: ${deliveryDate}\n\nWe'll continue to monitor your shipment and provide additional updates as it progresses toward its destination.\n\n{{tracking_url}}`,
  }
}

export function renderShipmentEmailHtml(shipment: Shipment, body: string) {
  const status = formatStatus(shipment.status)
  const trackingUrl = `${SITE_URL}/track/${encodeURIComponent(shipment.tracking_number)}`
  const safeBody = escapeHtml(body.replaceAll("{{tracking_url}}", trackingUrl)).replaceAll(
    escapeHtml(trackingUrl),
    `<a href="${escapeHtml(trackingUrl)}" style="color:#173b70;font-weight:700">Track your shipment</a>`,
  )
  const progress = ["received", "processing", "in_transit", "pending", "out_for_delivery", "delivered"]
  const currentIndex = Math.max(progress.indexOf(shipment.status), 0)
  const progressCells = progress.map((step, index) => {
    const active = index <= currentIndex
    const current = index === currentIndex
    const label = formatStatus(step)
    return `<td align="center" width="16.66%"><div style="width:${current ? 16 : 14}px;height:${current ? 16 : 14}px;background:${active ? (current ? "#e31837" : "#173b70") : "#d7dee8"};border-radius:50%;margin:auto;${current ? "border:3px solid #ffd9df;" : ""}"></div><div style="font-size:10px;color:${current ? "#e31837" : "#667085"};font-weight:${current ? 700 : 400};margin-top:7px">${label}</div></td>${index < progress.length - 1 ? `<td style="height:2px;background:${index < currentIndex ? "#173b70" : "#d7dee8"};"></td>` : ""}`
  }).join("")

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#172033"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f6fa"><tr><td align="center" style="padding:32px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;background:#fff;border-radius:14px;overflow:hidden"><tr><td style="padding:24px 32px;border-bottom:1px solid #e8edf3"><div style="font-size:22px;font-weight:700;color:#173b70">ShipNexDelivery</div><div style="font-size:12px;color:#667085;margin-top:4px">Reliable logistics. Delivered with care.</div></td></tr><tr><td style="padding:34px 32px 10px"><div style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5d6b7d;margin-bottom:10px">Shipment Notification</div><h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#15213a">Your shipment is ${escapeHtml(status.toLowerCase())}</h1><div style="font-size:16px;line-height:1.7;color:#536174">${safeBody.replaceAll("\n", "<br>")}</div></td></tr><tr><td style="padding:24px 32px"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f9fc;border:1px solid #e2e8f0;border-radius:12px"><tr><td style="padding:22px"><div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#718096">Current Status</div><div style="font-size:22px;font-weight:700;color:#0f766e;margin-top:6px">${escapeHtml(status)}</div><table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px"><tr><td width="50%" style="padding:0 10px 14px 0"><div style="font-size:12px;color:#718096">Tracking Number</div><div style="font-size:15px;font-weight:700;color:#172033;margin-top:5px">${escapeHtml(shipment.tracking_number)}</div></td><td width="50%" style="padding:0 0 14px 10px"><div style="font-size:12px;color:#718096">Current Location</div><div style="font-size:15px;font-weight:700;color:#172033;margin-top:5px">${escapeHtml(shipment.current_location)}</div></td></tr><tr><td width="50%" style="padding:0 10px 0 0"><div style="font-size:12px;color:#718096">Estimated Delivery</div><div style="font-size:15px;font-weight:700;color:#172033;margin-top:5px">${escapeHtml(formatDate(shipment.estimated_delivery))}</div></td><td width="50%" style="padding:0 0 0 10px"><div style="font-size:12px;color:#718096">Next Step</div><div style="font-size:15px;font-weight:700;color:#172033;margin-top:5px">${nextStepForStatus(shipment.status)}</div></td></tr></table></td></tr></table></td></tr><tr><td style="padding:4px 32px 20px"><div style="font-size:16px;font-weight:700;color:#172033;margin-bottom:18px">Shipment Progress</div><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${progressCells}</tr></table></td></tr><tr><td align="center" style="padding:12px 32px 32px"><a href="${escapeHtml(trackingUrl)}" style="display:inline-block;background:#173b70;color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 28px;border-radius:8px">Track Your Shipment</a></td></tr><tr><td style="padding:0 32px 30px"><div style="background:#f8fafc;border-left:4px solid #e31837;padding:16px 18px;font-size:14px;line-height:1.7;color:#536174">We'll continue to monitor your shipment and provide additional updates as it progresses toward its destination.</div></td></tr><tr><td style="background:#15213a;padding:26px 32px;text-align:center"><div style="font-size:16px;font-weight:700;color:#fff">ShipNexDelivery</div><div style="font-size:13px;color:#c5cfdd;margin-top:7px">Reliable logistics. Delivered with care.</div><div style="font-size:12px;color:#9eabba;margin-top:16px">Questions about your shipment? Contact delivery@shipnexdelivery.site</div><div style="font-size:11px;color:#7f8b9b;margin-top:14px">© ${new Date().getFullYear()} ShipNexDelivery. All rights reserved.</div></td></tr></table></td></tr></table></body></html>`
}
