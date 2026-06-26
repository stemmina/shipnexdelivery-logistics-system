import { getAllShipments } from "@/lib/shipment-service"
import { ShipmentsList } from "@/components/admin/shipments-list"

export default async function ShipmentsPage() {
  const { data: shipments } = await getAllShipments({ limit: 1000 })

  return <ShipmentsList shipments={shipments} />
}
