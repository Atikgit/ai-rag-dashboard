import { FileText, FileSpreadsheet, File } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { KnowledgeDocument } from "@/lib/types"

const TYPE_ICON: Record<KnowledgeDocument["type"], React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  csv: FileSpreadsheet,
  docx: FileText,
  txt: File,
}

const STATUS_VARIANT: Record<
  KnowledgeDocument["status"],
  { variant: "secondary" | "outline" | "destructive"; className: string }
> = {
  indexed: { variant: "outline", className: "text-success border-success/30 bg-success/10" },
  processing: { variant: "secondary", className: "" },
  failed: { variant: "destructive", className: "" },
}

export function DocumentsTable({
  documents,
}: {
  documents: KnowledgeDocument[]
}) {
  if (documents.length === 0) {
    return (
      <Empty className="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>No documents yet</EmptyTitle>
          <EmptyDescription>
            Upload a file above to start building your knowledge base.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Chunks</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => {
          const Icon = TYPE_ICON[doc.type]
          const status = STATUS_VARIANT[doc.status]
          return (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate font-medium">{doc.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono-label text-xs text-muted-foreground">
                {doc.size}
              </TableCell>
              <TableCell className="font-mono-label text-xs text-muted-foreground">
                {doc.chunks > 0 ? doc.chunks.toLocaleString() : "—"}
              </TableCell>
              <TableCell className="font-mono-label text-xs text-muted-foreground">
                {doc.uploadedAt}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={status.variant} className={status.className}>
                  {doc.status}
                </Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
