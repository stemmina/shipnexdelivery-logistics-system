"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Eye, LayoutDashboard, Mail, Truck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
  {
    label: "Emails",
    href: "/admin/emails",
    icon: Mail,
  },
  {
    label: "Visitors",
    href: "/admin/visitors",
    icon: Eye,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-dvh w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center justify-center border-b border-border">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-card p-0.5">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7819%20%282%29-Er2qhPu9NWUVVuiK5fbV7lp0Ae0Duu.jpeg"
                alt="ShipNexDelivery logo"
                width={36}
                height={36}
                className="size-full object-contain"
              />
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
        <button
          onClick={() => startTransition(handleSignOut)}
          disabled={isPending}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
