import { cn } from "@/lib/utils"
import { isExceptionStatus } from "@/lib/shipments"

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  "Picked Up": "bg-chart-4/15 text-chart-4",
  "In Transit": "bg-primary/10 text-primary",
  "Out for Delivery": "bg-accent/20 text-accent-foreground",
  Delivered: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const exception = isExceptionStatus(status)
  const style = exception ? "bg-destructive/10 text-destructive" : STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        style,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
