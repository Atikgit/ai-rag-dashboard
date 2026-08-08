"use client"

import * as React from "react"
import { ArrowUp, Paperclip, X } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Badge } from "@/components/ui/badge"

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (value: string, attachment: File | null) => void
  disabled?: boolean
}) {
  const [value, setValue] = React.useState("")
  const [attachment, setAttachment] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed, attachment)
    setValue("")
    setAttachment(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {attachment && (
        <div className="px-1">
          <Badge variant="secondary" className="gap-1.5 font-mono-label text-[11px]">
            <Paperclip className="size-3" />
            {attachment.name}
            <button
              type="button"
              onClick={() => setAttachment(null)}
              aria-label="Remove attachment"
              className="ml-1 rounded-full hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          </Badge>
        </div>
      )}
      <InputGroup className="rounded-2xl">
        <InputGroupTextarea
          placeholder="Ask about your indexed knowledge base..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          rows={1}
          className="max-h-40 min-h-10"
        />
        <InputGroupAddon align="block-end">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.csv,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setAttachment(file)
              e.target.value = ""
            }}
          />
          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            aria-label="Attach file"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip />
          </InputGroupButton>
          <span className="flex-1" />
          <InputGroupButton
            variant="default"
            size="icon-xs"
            aria-label="Send message"
            disabled={!value.trim() || disabled}
            onClick={handleSubmit}
            className="rounded-full"
          >
            <ArrowUp />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
