import Image from "next/image"
import { MapPin, Bell, ShieldCheck, Truck, Clock, Globe2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TrackingSearch } from "@/components/tracking-search"

const FEATURES = [
  {
    icon: MapPin,
    title: "Live map location",
    description: "Watch your package move in real time on a satellite map, pinned to its latest scan.",
  },
  {
    icon: Bell,
    title: "Status at a glance",
    description: "Clear delivery milestones from pickup to your doorstep, updated by our team.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & reliable",
    description: "Every shipment is verified by tracking number so only the right person sees details.",
  },
  {
    icon: Globe2,
    title: "Worldwide coverage",
    description: "Domestic and international routes across our global logistics network.",
  },
]

const STEPS = [
  {
    icon: Truck,
    title: "We pick up",
    description: "Your package enters the ShipNexDelivery network and is scanned at origin.",
  },
  {
    icon: Clock,
    title: "We move it",
    description: "Each scan updates the live status and map so you always know where it is.",
  },
  {
    icon: MapPin,
    title: "We deliver",
    description: "Out for delivery and dropped at your destination, right on schedule.",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/hero-logistics.png" alt="" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-primary/85" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground">
              <Truck className="size-3.5" />
              Real-time shipment tracking
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
              Track your delivery, every mile of the way
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              Enter your ShipNexDelivery tracking number to see live status, current location on the map, and your
              estimated delivery date.
            </p>

            <div id="track" className="mt-8 w-full max-w-2xl scroll-mt-24">
              <TrackingSearch />
              <p className="mt-3 text-sm text-primary-foreground/70">
                Try a demo number: <span className="font-mono font-semibold text-accent">SNX123456789</span>
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to follow your package
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              ShipNexDelivery gives you a transparent view into your shipment from the moment it&apos;s picked up.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
              >
                <span className="flex size-11 items-center justify-center rounded-lg bg-accent/15">
                  <feature.icon className="size-5 text-accent" />
                </span>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-16 border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Three simple stages, fully tracked from start to finish.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <div key={step.title} className="relative flex flex-col gap-4 rounded-xl bg-background p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-4xl font-bold text-border">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
