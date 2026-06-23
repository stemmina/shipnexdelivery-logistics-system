import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Ship<span className="text-accent">Nex</span>Delivery
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" render={<Link href="/#how-it-works">How it works</Link>} />
          <Button variant="ghost" size="sm" render={<Link href="/#track">Track</Link>} />
          <Button variant="outline" size="sm" render={<Link href="/admin">Admin</Link>} />
        </nav>
      </div>
    </header>
  )
}
