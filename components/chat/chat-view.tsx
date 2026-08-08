"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { ChatMessageRow } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import type { ChatMessage, ModelId } from "@/lib/types"

const CITATION_DELIMITER = "\n␟CITATIONS␟"

const SUGGESTED_PROMPTS = [
  "What is our refund policy?",
  "Summarize the onboarding handbook",
  "How did Q3 revenue perform?",
]

export function ChatView({ model }: { model: ModelId }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = React.useState(false)

  async function sendMessage(content: string, attachment: File | null) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: attachment ? `${content}\n\n📎 ${attachment.name}` : content,
      createdAt: Date.now(),
    }

    const assistantId = crypto.randomUUID()
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      model,
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setIsStreaming(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [...messages, userMessage],
        }),
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const delimiterIndex = buffer.indexOf(CITATION_DELIMITER)
        const textPart =
          delimiterIndex === -1 ? buffer : buffer.slice(0, delimiterIndex)

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: textPart } : m,
          ),
        )
      }

      const delimiterIndex = buffer.indexOf(CITATION_DELIMITER)
      if (delimiterIndex !== -1) {
        const citationsJson = buffer.slice(
          delimiterIndex + CITATION_DELIMITER.length,
        )
        try {
          const citations = JSON.parse(citationsJson)
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, citations } : m)),
          )
        } catch {
          // Ignore malformed citation payloads in this mock.
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Something went wrong reaching the model. Please try again." }
            : m,
        ),
      )
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <MessageScrollerProvider>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-3xl px-4 py-6">
              {messages.length === 0 ? (
                <MessageScrollerItem>
                  <Empty className="border-none py-16">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Sparkles />
                      </EmptyMedia>
                      <EmptyTitle>Ask your knowledge base</EmptyTitle>
                      <EmptyDescription>
                        Responses are grounded in your indexed documents with
                        cited sources.
                      </EmptyDescription>
                    </EmptyHeader>
                    <div className="flex flex-wrap justify-center gap-2">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <Button
                          key={prompt}
                          variant="outline"
                          size="sm"
                          onClick={() => sendMessage(prompt, null)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </Empty>
                </MessageScrollerItem>
              ) : (
                messages.map((message) => (
                  <MessageScrollerItem key={message.id}>
                    <ChatMessageRow message={message} />
                  </MessageScrollerItem>
                ))
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <div className="border-t border-border bg-background px-4 py-4">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Responses may be inaccurate. Verify important information against
            source documents.
          </p>
        </div>
      </div>
    </div>
  )
}
