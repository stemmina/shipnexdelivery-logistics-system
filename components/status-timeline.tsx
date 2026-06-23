import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { SHIPMENT_STATUSES, statusIndex, isExceptionStatus } from "@/lib/shipments"

export function StatusTimeline({ status }: { status: string }) {
  const exception = isExceptionStatus(status)
  const currentIndex = statusIndex(status)

  if (exception) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">
          This shipment is currently marked as &ldquo;{status}&rdquo;. Please contact support for assistance.
        </p>
      </div>
    )
  }

  return (
    <ol className="space-y-0">
      {SHIPMENT_STATUSES.map((step, index) => {
        const completed = index < currentIndex
        const active = index === currentIndex
        const isLast = index === SHIPMENT_STATUSES.length - 1

        return (
          <li key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  completed && "border-primary bg-primary text-primary-foreground",
                  active && "border-accent bg-accent text-accent-foreground",
                  !completed && !active && "border-border bg-background text-muted-foreground",
                )}
              >
                {completed ? <Check className="size-4" /> : <span className="size-2 rounded-full bg-current" />}
              </span>
              {!isLast && (
                <span className={cn("my-1 w-0.5 flex-1", index < currentIndex ? "bg-primary" : "bg-border")} />
              )}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-medium",
                  active ? "text-foreground" : completed ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step}
              </p>
              {active && <p className="text-sm text-accent">Current status</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
