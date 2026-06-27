import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShipmentTable } from "@/components/admin/shipment-table"
import { ShipmentFilters } from "@/components/admin/shipment-filters"
import { getAllShipments } from "@/lib/shipment-service"
import { ShipmentsList } from "@/components/admin/shipments-list"

export default async function ShipmentsPage() {
  const { data: allShipments } = await getAllShipments({ limit: 1000 })

  return <ShipmentsList shipments={allShipments} />
}
