"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Bot, FileText, User } from "lucide-react"

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Badge } from "@/components/ui/badge"
import { MODEL_OPTIONS } from "@/lib/mock-data"
import type { ChatMessage } from "@/lib/types"

export function ChatMessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  const model = MODEL_OPTIONS.find((m) => m.id === message.model)

  return (
    <Message align={isUser ? "end" : "start"}>
      <MessageAvatar>
        {isUser ? (
          <User className="size-4 text-muted-foreground" />
        ) : (
          <Bot className="size-4 text-primary" />
        )}
      </MessageAvatar>
      <MessageContent>
        <Bubble
          align={isUser ? "end" : "start"}
          variant={isUser ? "default" : "secondary"}
        >
          <BubbleContent>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose-chat">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content || "\u200b"}
                </ReactMarkdown>
              </div>
            )}
          </BubbleContent>
        </Bubble>

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="flex flex-col gap-1.5 px-3">
            <span className="text-[10px] font-mono-label text-muted-foreground">
              SOURCES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.citations.map((c, i) => (
                <Badge
                  key={`${c.source}-${i}`}
                  variant="outline"
                  className="gap-1.5 font-mono-label text-[11px] font-normal"
                >
                  <FileText className="size-3" />
                  {c.source}
                  <span className="text-muted-foreground">
                    · {c.index} · {(c.score * 100).toFixed(0)}%
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!isUser && model && (
          <MessageFooter className="font-mono-label text-[10px]">
            {model.label}
          </MessageFooter>
        )}
      </MessageContent>
    </Message>
  )
}
