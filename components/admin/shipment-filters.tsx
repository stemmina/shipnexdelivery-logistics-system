"use client"

import { useState } from "react"
import { Shipment } from "@/lib/shipment-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

interface ShipmentFiltersProps {
  onSearch?: (query: string) => void
  onStatusFilter?: (status: string) => void
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_transit", label: "In Transit" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export function ShipmentFilters({ onSearch, onStatusFilter }: ShipmentFiltersProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearch?.(value)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onStatusFilter?.(value)
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-end md:gap-3">
      <div className="flex-1 flex items-center gap-2 rounded-lg bg-background px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <Input
          placeholder="Search by tracking number or name..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSearch("")
          setStatus("")
          onSearch?.("")
          onStatusFilter?.("")
        }}
      >
        <Filter className="size-4" />
        Reset
      </Button>
    </div>
  )
}
