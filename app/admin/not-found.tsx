import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Package className="size-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button render={<Link href="/admin">Back to Dashboard</Link>} />
    </div>
  )
}
