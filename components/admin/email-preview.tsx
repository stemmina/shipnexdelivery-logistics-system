"use client"

import { useMemo } from "react"
import { Eye } from "lucide-react"
import { renderShipmentEmailHtml } from "@/lib/email-templates"
import type { Shipment } from "@/lib/shipment-service"

export function EmailPreview({ shipment, body }: { shipment: Shipment; body: string }) {
  const previewHtml = useMemo(() => renderShipmentEmailHtml(shipment, body || "Your shipment update will appear here."), [shipment, body])

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-muted/30 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-card px-5 py-4">
        <Eye className="size-4 text-primary" aria-hidden="true" />
        <div>
          <h2 className="font-semibold">Email preview</h2>
          <p className="text-xs text-muted-foreground">Live preview using the official ShipNexDelivery template.</p>
        </div>
      </div>
      <div className="bg-[#f3f6fa] p-3 sm:p-5">
        <iframe
          title="Shipment email preview"
          srcDoc={previewHtml}
          sandbox=""
          className="h-[760px] w-full rounded-lg border border-border bg-white shadow-sm"
        />
      </div>
    </section>
  )
}
