"use client"

import { useState } from "react"
import { Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { sendShipmentUpdateEmailAction } from "@/app/admin/shipments/actions"

interface SendUpdateEmailButtonProps {
  shipmentId: string
  hasRecipientEmail: boolean
}

export function SendUpdateEmailButton({ shipmentId, hasRecipientEmail }: SendUpdateEmailButtonProps) {
  const [sending, setSending] = useState(false)

  async function handleSend() {
    setSending(true)
    const result = await sendShipmentUpdateEmailAction(shipmentId)
    setSending(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Delivery update email sent")
  }

  return (
    <Button type="button" variant="outline" onClick={handleSend} disabled={sending || !hasRecipientEmail}>
      {sending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
      {hasRecipientEmail ? "Send delivery update" : "Add recipient email first"}
    </Button>
  )
}
