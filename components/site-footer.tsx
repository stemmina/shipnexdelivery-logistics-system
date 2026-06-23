import Link from "next/link"
import { Package } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-4" />
          </span>
          <span className="font-semibold tracking-tight">
            Ship<span className="text-accent">Nex</span>Delivery
          </span>
        </Link>
        <p className="text-sm text-muted-foreground">
          Reliable shipping and real-time package tracking, worldwide.
        </p>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ShipNexDelivery. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
