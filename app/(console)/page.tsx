"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ModelSelector } from "@/components/chat/model-selector"
import { ChatView } from "@/components/chat/chat-view"
import type { ModelId } from "@/lib/types"

export default function ChatPage() {
  const [model, setModel] = React.useState<ModelId>("gpt-4o")

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <div className="flex flex-1 items-center gap-3">
          <h1 className="text-sm font-medium">AI Chat</h1>
          <Badge
            variant="outline"
            className="gap-1.5 font-mono-label text-[10px] text-success border-success/30 bg-success/10"
          >
            <span className="size-1.5 rounded-full bg-success" />
            RAG ACTIVE
          </Badge>
        </div>
        <ModelSelector value={model} onValueChange={setModel} />
      </header>
      <ChatView model={model} />
    </div>
  )
}
