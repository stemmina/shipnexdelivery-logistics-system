import Link from "next/link"
import { Package } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-primary px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-primary-foreground">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/10">
          <Package className="size-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Ship<span className="text-accent">Nex</span>Delivery
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage shipments and delivery updates.</p>
        </div>
        <LoginForm />
      </div>

      <p className="mt-6 text-sm text-primary-foreground/70">
        Need an admin account?{" "}
        <Link href="/auth/sign-up" className="font-medium text-accent underline-offset-4 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
