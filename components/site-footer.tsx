import Image from "next/image"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-card p-0.5">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7819%20%282%29-Er2qhPu9NWUVVuiK5fbV7lp0Ae0Duu.jpeg"
              alt="ShipNexDelivery logo"
              width={36}
              height={36}
              className="size-full object-contain"
            />
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
