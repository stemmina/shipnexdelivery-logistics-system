"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Mail, RotateCcw, Save, Send, Trash2 } from "lucide-react"
import { EmailPreview } from "@/components/admin/email-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getDefaultShipmentEmail } from "@/lib/email-templates"
import {
  deleteShipmentEmailDraftAction,
  saveShipmentEmailDraftAction,
  sendShipmentEmailAction,
} from "@/app/admin/shipments/actions"
import type { Shipment } from "@/lib/shipment-service"

export function EmailManager({ shipment }: { shipment: Shipment }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [subject, setSubject] = useState(shipment.email_subject ?? "")
  const [body, setBody] = useState(shipment.email_body ?? "")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const reset = () => {
    const template = getDefaultShipmentEmail(shipment)
    setSubject(template.subject)
    setBody(template.body)
    setMessage("")
    setError("")
  }

  const run = (action: () => Promise<{ success?: boolean; error?: string }>, success: string) => {
    setError("")
    setMessage("")
    startTransition(async () => {
      const result = await action()
      if (result.error) setError(result.error)
      else {
        setMessage(success)
        router.refresh()
      }
    })
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Mail className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Shipment email</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Compose an official ShipNexDelivery update for {shipment.receiver_email || "this recipient"}.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">{shipment.email_status.replace("_", " ")}</span>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email-subject">Subject</Label>
          <Input id="email-subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Your ShipNexDelivery shipment update" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email-body">Message</Label>
          <Textarea id="email-body" value={body} onChange={(event) => setBody(event.target.value)} rows={12} className="font-mono text-sm" placeholder="Write the shipment update..." />
          <p className="text-xs text-muted-foreground">Use <code>{"{{tracking_url}}"}</code> to insert the tracking page link.</p>
        </div>
        <EmailPreview shipment={shipment} body={body} subject={subject} />
        {(message || error) && <p className={error ? "text-sm text-destructive" : "text-sm text-emerald-700"}>{error || message}</p>}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={reset} disabled={isPending}><RotateCcw className="mr-2 size-4" />Reset official template</Button>
          <Button type="button" variant="outline" onClick={() => run(() => saveShipmentEmailDraftAction(shipment.id, subject, body), "Draft saved.")} disabled={isPending || !subject.trim() || !body.trim()}><Save className="mr-2 size-4" />Save draft</Button>
          <Button type="button" onClick={() => run(() => sendShipmentEmailAction(shipment.id, subject, body), "Email sent successfully.")} disabled={isPending || !shipment.receiver_email || !subject.trim() || !body.trim()}><Send className="mr-2 size-4" />Send email</Button>
          <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => run(() => deleteShipmentEmailDraftAction(shipment.id), "Draft deleted.")} disabled={isPending}><Trash2 className="mr-2 size-4" />Delete draft</Button>
        </div>
      </div>
    </section>
  )
}
