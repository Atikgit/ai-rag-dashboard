"use client"

import * as React from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { ConfigCards } from "@/components/dashboard/config-cards"
import { UploadZone } from "@/components/dashboard/upload-zone"
import { DocumentsTable } from "@/components/dashboard/documents-table"
import { MOCK_DOCUMENTS, STATS } from "@/lib/mock-data"
import type { KnowledgeDocument, VectorDb, Orchestrator } from "@/lib/types"

export default function DashboardPage() {
  const [documents, setDocuments] = React.useState<KnowledgeDocument[]>(MOCK_DOCUMENTS)
  const [vectorDb, setVectorDb] = React.useState<VectorDb>("pinecone")
  const [orchestrator, setOrchestrator] = React.useState<Orchestrator>("langchain")

  const totalChunks = documents.reduce((sum, d) => sum + d.chunks, 0)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <h1 className="text-sm font-medium">Knowledge Base Administration</h1>
      </header>

      <ScrollArea className="flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
          <StatsOverview
            totalDocuments={STATS.totalDocuments}
            totalEmbeddings={STATS.totalEmbeddings + totalChunks}
            apiLatencyMs={STATS.apiLatencyMs}
            indexHealth={STATS.indexHealth}
          />

          <ConfigCards
            vectorDb={vectorDb}
            onVectorDbChange={setVectorDb}
            orchestrator={orchestrator}
            onOrchestratorChange={setOrchestrator}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-mono-label">
                Data Ingestion
              </CardTitle>
              <CardDescription>
                Upload domain-specific documents to fine-tune the chatbot&apos;s
                retrieval context.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadZone
                onIngested={(doc) => setDocuments((prev) => [doc, ...prev])}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-mono-label">
                Indexed Documents
              </CardTitle>
              <CardDescription>
                {documents.length} document{documents.length === 1 ? "" : "s"} in
                the active knowledge base, powered by {vectorDb} via {orchestrator}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentsTable documents={documents} />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
