import Image from "next/image"
import Link from "next/link"
import { SignUpForm } from "@/components/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-primary px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-primary-foreground">
        <span className="flex size-11 items-center justify-center overflow-hidden rounded-lg bg-card p-0.5">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7819%20%282%29-Er2qhPu9NWUVVuiK5fbV7lp0Ae0Duu.jpeg"
            alt="ShipNexDelivery logo"
            width={44}
            height={44}
            className="size-full object-contain"
          />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Ship<span className="text-accent">Nex</span>Delivery
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create admin account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Set up access to the shipment dashboard.</p>
        </div>
        <SignUpForm />
      </div>

      <p className="mt-6 text-sm text-primary-foreground/70">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-accent underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
