"use client"

import * as React from "react"
import { Database, Workflow } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { VECTOR_DB_OPTIONS, ORCHESTRATOR_OPTIONS } from "@/lib/mock-data"
import type { VectorDb, Orchestrator } from "@/lib/types"

export function ConfigCards({
  vectorDb,
  onVectorDbChange,
  orchestrator,
  onOrchestratorChange,
}: {
  vectorDb: VectorDb
  onVectorDbChange: (value: VectorDb) => void
  orchestrator: Orchestrator
  onOrchestratorChange: (value: Orchestrator) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="size-4 text-primary" />
            <CardTitle className="text-sm font-mono-label">
              Vector Database
            </CardTitle>
          </div>
          <CardDescription>
            Where document embeddings are stored and queried.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={vectorDb}
            onValueChange={(v) => onVectorDbChange(v as VectorDb)}
          >
            {VECTOR_DB_OPTIONS.map((opt) => (
              <Label
                key={opt.id}
                htmlFor={`vdb-${opt.id}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50",
                  vectorDb === opt.id && "border-primary bg-accent/40",
                )}
              >
                <RadioGroupItem
                  id={`vdb-${opt.id}`}
                  value={opt.id}
                  className="mt-0.5"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {opt.description}
                  </span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Workflow className="size-4 text-primary" />
            <CardTitle className="text-sm font-mono-label">
              Orchestration Framework
            </CardTitle>
          </div>
          <CardDescription>
            Handles retrieval chains and prompt augmentation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={orchestrator}
            onValueChange={(v) => onOrchestratorChange(v as Orchestrator)}
          >
            {ORCHESTRATOR_OPTIONS.map((opt) => (
              <Label
                key={opt.id}
                htmlFor={`orc-${opt.id}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50",
                  orchestrator === opt.id && "border-primary bg-accent/40",
                )}
              >
                <RadioGroupItem
                  id={`orc-${opt.id}`}
                  value={opt.id}
                  className="mt-0.5"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{opt.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {opt.description}
                  </span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}
