import { Truck, CheckCircle, Clock, Package } from "lucide-react"
import { getAllShipments } from "@/lib/shipment-service"

interface StatCard {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

export async function DashboardStats() {
  const { data: allShipments } = await getAllShipments()

  const totalShipments = allShipments.length
  const inTransit = allShipments.filter((s) => s.status === "in_transit").length
  const delivered = allShipments.filter((s) => s.status === "delivered").length
  const pending = allShipments.filter((s) => s.status === "pending").length

  const stats: StatCard[] = [
    {
      label: "Total Shipments",
      value: totalShipments,
      icon: <Package className="size-5" />,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "In Transit",
      value: inTransit,
      icon: <Truck className="size-5" />,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Delivered",
      value: delivered,
      icon: <CheckCircle className="size-5" />,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock className="size-5" />,
      color: "bg-gray-500/10 text-gray-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            </div>
            <div className={`rounded-lg p-3 ${stat.color}`}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
