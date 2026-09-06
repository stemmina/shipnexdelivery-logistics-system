"use client"

import { useState } from "react"
import { Loader2, Mail, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Shipment } from "@/lib/shipment-service"
import { getDefaultShipmentEmail } from "@/lib/email-templates"
import { saveShipmentEmailDraftAction, sendShipmentEmailAction } from "@/app/admin/shipments/actions"

interface ShipmentEmailEditorProps {
  shipment: Shipment
}

export function ShipmentEmailEditor({ shipment }: ShipmentEmailEditorProps) {
  const [subject, setSubject] = useState(shipment.email_subject || "")
  const [body, setBody] = useState(shipment.email_body || "")
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)

  const defaults = getDefaultShipmentEmail(shipment)

  async function handleSave() {
    setSaving(true)
    const result = await saveShipmentEmailDraftAction(shipment.id, subject, body)
    setSaving(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Email draft saved")
    }
  }

  async function handleReset() {
    setSubject(defaults.subject)
    setBody(defaults.body)
    toast.success("Email reset to default template")
  }

  async function handleSend() {
    if (!shipment.receiver_email) {
      toast.error("Add recipient email to shipment first")
      return
    }
    setSending(true)
    const result = await sendShipmentEmailAction(shipment.id, subject, body)
    setSending(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Email sent to " + shipment.receiver_email)
    }
  }

  const isCurrent = subject === shipment.email_subject && body === shipment.email_body
  const isDefault = subject === defaults.subject && body === defaults.body
  const hasContent = subject.trim() && body.trim()

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h3 className="mb-2 font-semibold">Email to {shipment.receiver_name}</h3>
        <p className="text-sm text-muted-foreground">{shipment.receiver_email || "No email address"}</p>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="email-subject">Subject</Label>
        <Input
          id="email-subject"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={sending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-body">Message</Label>
        <Textarea
          id="email-body"
          placeholder="Email body. Use {{tracking_url}} for the tracking link."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={sending}
          rows={10}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">{"Tip: Use {{tracking_url}} as a placeholder for the tracking page link."}</p>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave} disabled={saving || isCurrent || !hasContent} variant="outline" size="sm">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <span>Save Draft</span>}
        </Button>
        <Button onClick={handleReset} disabled={isDefault} variant="outline" size="sm">
          <RotateCcw className="mr-2 size-4" />
          Reset to Default
        </Button>
        <Button
          onClick={handleSend}
          disabled={sending || !hasContent || !shipment.receiver_email}
          className="ml-auto"
          size="sm"
        >
          {sending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="mr-2 size-4" />}
          {shipment.receiver_email ? "Send Email" : "Add Email"}
        </Button>
      </div>

      {shipment.email_status && (
        <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
          <div className="font-medium">
            {shipment.email_status === "sent" ? "✓ Email sent" : shipment.email_status === "failed" ? "✗ Failed" : "○ Not sent"}
          </div>
          {shipment.email_sent_at && <div className="text-xs text-muted-foreground">Sent on {new Date(shipment.email_sent_at).toLocaleString()}</div>}
          {shipment.email_last_error && <div className="text-xs text-destructive">Error: {shipment.email_last_error}</div>}
        </div>
      )}
    </Card>
  )
}
