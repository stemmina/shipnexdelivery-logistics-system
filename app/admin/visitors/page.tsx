import { Eye, MapPin, Users } from "lucide-react"
import { getVisitorActivity } from "@/lib/visitor-analytics"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function VisitorsPage() {
  const visitors = await getVisitorActivity()
  const recentSessions = visitors.slice(0, 10).length
  const consentedLocations = visitors.filter((visitor) => visitor.location_consent).length

  return (
    <div className="space-y-8">
      <header><p className="text-sm font-medium text-accent">Customer activity</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Tracking visitors</h1><p className="mt-2 max-w-2xl text-muted-foreground">See who has visited shipment tracking pages, with names and exact location only when visitors choose to share them.</p></header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5"><Users className="size-5 text-accent" /><p className="mt-3 text-2xl font-bold">{visitors.length}</p><p className="text-sm text-muted-foreground">Tracked sessions</p></div>
        <div className="rounded-xl border border-border bg-card p-5"><Eye className="size-5 text-accent" /><p className="mt-3 text-2xl font-bold">{recentSessions}</p><p className="text-sm text-muted-foreground">Most recent sessions</p></div>
        <div className="rounded-xl border border-border bg-card p-5"><MapPin className="size-5 text-accent" /><p className="mt-3 text-2xl font-bold">{consentedLocations}</p><p className="text-sm text-muted-foreground">Shared exact location</p></div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card"><Table><TableHeader><TableRow><TableHead>Visitor</TableHead><TableHead>Shipment</TableHead><TableHead>Location</TableHead><TableHead>Activity</TableHead><TableHead>Last seen</TableHead></TableRow></TableHeader><TableBody>{visitors.length === 0 ? <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No tracking visitors recorded yet.</TableCell></TableRow> : visitors.map((visitor) => <TableRow key={visitor.id}><TableCell><p className="font-medium">{visitor.visitor_name || "Anonymous visitor"}</p><p className="text-xs text-muted-foreground">{visitor.location_consent ? "Location consented" : "Location not shared"}</p></TableCell><TableCell className="font-mono text-xs">{visitor.tracking_number}</TableCell><TableCell>{visitor.location_consent && visitor.latitude !== null && visitor.longitude !== null ? <span>{visitor.latitude.toFixed(5)}, {visitor.longitude.toFixed(5)}<span className="block text-xs text-muted-foreground">±{Math.round(visitor.accuracy_meters ?? 0)}m</span></span> : <span className="text-muted-foreground">Not shared</span>}</TableCell><TableCell><p>{visitor.page_views} page view{visitor.page_views === 1 ? "" : "s"}</p><p className="text-xs text-muted-foreground">{visitor.interactions.length} interactions</p></TableCell><TableCell>{new Date(visitor.last_seen_at).toLocaleString()}</TableCell></TableRow>)}</TableBody></Table></div>
    </div>
  )
}
