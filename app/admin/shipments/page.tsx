import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShipmentTable } from "@/components/admin/shipment-table"
import { ShipmentFilters } from "@/components/admin/shipment-filters"
import { getAllShipments, Shipment } from "@/lib/shipment-service"

export default async function ShipmentsPage() {
  const { data: allShipments } = await getAllShipments({ limit: 1000 })

  return (
    <ShipmentsList shipments={allShipments} />
  )
}

"use client"

import { useState, useMemo } from "react"

interface ShipmentsListProps {
  shipments: Shipment[]
}

function ShipmentsList({ shipments }: ShipmentsListProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesSearch =
        !search ||
        shipment.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
        shipment.sender_name.toLowerCase().includes(search.toLowerCase()) ||
        shipment.receiver_name.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = !statusFilter || shipment.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [shipments, search, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">Manage and track all shipments.</p>
        </div>
        <Button asChild>
          <Link href="/admin/shipments/new">
            <Plus className="size-4" />
            Create shipment
          </Link>
        </Button>
      </div>

      <ShipmentFilters onSearch={setSearch} onStatusFilter={setStatusFilter} />

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredShipments.length} of {shipments.length} shipments
        </p>
        <ShipmentTable shipments={filteredShipments} />
      </div>
    </div>
  )
}
