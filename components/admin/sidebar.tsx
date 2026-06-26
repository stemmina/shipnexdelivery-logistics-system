"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, LayoutDashboard, Truck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Shipments",
    href: "/admin/shipments",
    icon: Truck,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-dvh w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center justify-center border-b border-border">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-4" />
          </span>
          <span className="text-sm tracking-tight">
            Ship<span className="text-accent">Nex</span>Delivery
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <form
          action={async () => {
            "use server"
            const { createClient } = await import("@/lib/supabase/server")
            const supabase = await createClient()
            await supabase.auth.signOut()
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
