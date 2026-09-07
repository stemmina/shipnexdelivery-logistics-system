import Link from "next/link"
import { Search, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmailManager } from "@/components/admin/email-manager"
import { getAllShipments } from "@/lib/shipment-service"
import { getEmailTemplateSettings } from "@/lib/email-template-settings"
import { DEFAULT_EMAIL_TEMPLATE } from "@/lib/email-templates"
import { EmailTemplateSettings } from "@/components/admin/email-template-settings"

export default async function AdminEmailsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const query = params.q?.trim() ?? ""
  const { data: shipments, count } = await getAllShipments({ search: query, limit: 25 })
  const selected = shipments[0]
  const settings = await getEmailTemplateSettings()

  return (
    <main className="space-y-6 p-6 lg:p-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-accent">Communication center</p>
        <h1 className="text-3xl font-semibold tracking-tight">Shipment emails</h1>
        <p className="max-w-2xl text-muted-foreground">Search for a shipment, create or edit its official ShipNexDelivery email, then save, delete, or send it to the recipient.</p>
      </header>

      <EmailTemplateSettings initialSettings={settings ?? { ...DEFAULT_EMAIL_TEMPLATE, updated_at: new Date().toISOString() }} />

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <form className="flex flex-col gap-3 sm:flex-row" action="/admin/emails">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input name="q" defaultValue={query} placeholder="Search tracking number, sender, or recipient" className="pl-9" />
          </div>
          <Button type="submit">Search shipments</Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">{query ? `${count} matching shipment${count === 1 ? "" : "s"}` : `${count} shipments available`}</p>
      </section>

      {selected ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Selected shipment</h2>
              <p className="text-sm text-muted-foreground">{selected.tracking_number} · {selected.receiver_name} · {selected.receiver_email || "No recipient email"}</p>
            </div>
            <Button variant="outline" asChild><Link href={`/admin/shipments/${selected.id}`}>Open shipment</Link></Button>
          </div>
          <EmailManager shipment={selected} />
        </div>
      ) : (
        <section className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Mail className="mx-auto mb-3 size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="font-semibold">No shipment selected</h2>
          <p className="mt-1 text-sm text-muted-foreground">Search by tracking number, sender, or recipient to manage an email.</p>
        </section>
      )}
    </main>
  )
}
