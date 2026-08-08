import { FileStack, Layers3, Gauge, HeartPulse } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  trend,
}: {
  label: string
  value: string
  suffix?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: { direction: "up" | "down"; value: string }
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono-label text-muted-foreground">
            {label}
          </span>
          <span className="font-mono-label text-2xl font-semibold tabular-nums">
            {value}
            {suffix && (
              <span className="ml-1 text-sm text-muted-foreground">
                {suffix}
              </span>
            )}
          </span>
          {trend && (
            <span
              className={cn(
                "text-xs font-mono-label",
                trend.direction === "up" ? "text-success" : "text-destructive",
              )}
            >
              {trend.direction === "up" ? "▲" : "▼"} {trend.value}
            </span>
          )}
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsOverview({
  totalDocuments,
  totalEmbeddings,
  apiLatencyMs,
  indexHealth,
}: {
  totalDocuments: number
  totalEmbeddings: number
  apiLatencyMs: number
  indexHealth: number
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="DOCUMENTS INDEXED"
        value={totalDocuments.toLocaleString()}
        icon={FileStack}
        trend={{ direction: "up", value: "+4 today" }}
      />
      <StatCard
        label="VECTOR EMBEDDINGS"
        value={totalEmbeddings.toLocaleString()}
        icon={Layers3}
        trend={{ direction: "up", value: "+1.2k today" }}
      />
      <StatCard
        label="API LATENCY"
        value={String(apiLatencyMs)}
        suffix="ms"
        icon={Gauge}
        trend={{ direction: "down", value: "-8ms" }}
      />
      <StatCard
        label="INDEX HEALTH"
        value={indexHealth.toFixed(1)}
        suffix="%"
        icon={HeartPulse}
      />
    </div>
  )
}
