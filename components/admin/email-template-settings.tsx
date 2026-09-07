"use client"

import { useState, useTransition } from "react"
import { RotateCcw, Save } from "lucide-react"
import { EmailPreview } from "@/components/admin/email-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DEFAULT_EMAIL_TEMPLATE } from "@/lib/email-templates"
import { saveEmailTemplateSettingsAction } from "@/app/admin/shipments/actions"
import type { EmailTemplateSettings } from "@/lib/email-template-settings"
import type { Shipment } from "@/lib/shipment-service"

export function EmailTemplateSettings({ initialSettings, previewShipment }: { initialSettings: EmailTemplateSettings; previewShipment?: Shipment }) {
  const [subject, setSubject] = useState(initialSettings.subject)
  const [body, setBody] = useState(initialSettings.body)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const save = () => {
    setMessage("")
    setError("")
    startTransition(async () => {
      const result = await saveEmailTemplateSettingsAction(subject, body)
      if (result.error) setError(result.error)
      else setMessage("Official template saved.")
    })
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-medium text-accent">Global template</p>
        <h2 className="text-xl font-semibold">Edit official shipment email</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">Changes apply when an admin resets a shipment draft or creates a new shipment. Existing drafts keep their current content.</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="official-email-subject">Default subject</Label>
          <Input id="official-email-subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="official-email-body">Default message</Label>
          <Textarea id="official-email-body" value={body} onChange={(event) => setBody(event.target.value)} rows={10} className="font-mono text-sm" />
          <p className="text-xs text-muted-foreground">Available placeholders: {"{{receiver_name}}"}, {"{{status}}"}, {"{{tracking_number}}"}, {"{{current_location}}"}, {"{{estimated_delivery}}"}, and {"{{tracking_url}}"}.</p>
        </div>
        {(message || error) && <p className={error ? "text-sm text-destructive" : "text-sm text-emerald-700"}>{error || message}</p>}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => { setSubject(DEFAULT_EMAIL_TEMPLATE.subject); setBody(DEFAULT_EMAIL_TEMPLATE.body); setMessage(""); setError("") }} disabled={isPending}><RotateCcw className="mr-2 size-4" />Restore built-in template</Button>
          <Button type="button" onClick={save} disabled={isPending || !subject.trim() || !body.trim()}><Save className="mr-2 size-4" />Save official template</Button>
        </div>
        {previewShipment && <EmailPreview shipment={previewShipment} subject={subject} body={body} />}
      </div>
    </section>
  )
}
