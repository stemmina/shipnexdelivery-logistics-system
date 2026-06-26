import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ArrowLeft className="size-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Shipment Not Found</h1>
      <p className="max-w-md text-muted-foreground">
        The tracking number you entered could not be found in our system. Please check and try again.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
