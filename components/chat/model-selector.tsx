"use client"

import { Sparkles } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MODEL_OPTIONS } from "@/lib/mock-data"
import type { ModelId } from "@/lib/types"

export function ModelSelector({
  value,
  onValueChange,
}: {
  value: ModelId
  onValueChange: (value: ModelId) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v as ModelId)}
    >
      <SelectTrigger size="sm" className="w-[200px] font-mono-label text-xs">
        <Sparkles className="text-primary" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {MODEL_OPTIONS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <span className="flex flex-col">
                <span className="text-sm">{model.label}</span>
                <span className="text-[10px] font-mono-label text-muted-foreground">
                  {model.provider}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
