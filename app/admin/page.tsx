import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-6">
          <div className="animate-pulse">
            <div className="mb-2 h-4 w-24 rounded bg-muted"></div>
            <div className="h-8 w-16 rounded bg-muted"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your shipment management dashboard.</p>
      </div>

      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">Get started managing your shipments.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/admin/shipments">View all shipments</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/shipments/new">Create new shipment</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
