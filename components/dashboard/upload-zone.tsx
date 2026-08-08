"use client"

import * as React from "react"
import { UploadCloud, FileText } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import type { KnowledgeDocument } from "@/lib/types"

const ACCEPTED_EXTENSIONS = [".pdf", ".csv", ".docx", ".txt"]

interface UploadJob {
  id: string
  name: string
  progress: number
}

export function UploadZone({
  onIngested,
}: {
  onIngested: (doc: KnowledgeDocument) => void
}) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [jobs, setJobs] = React.useState<UploadJob[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  function isAccepted(file: File) {
    return ACCEPTED_EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    )
  }

  async function ingestFile(file: File) {
    if (!isAccepted(file)) {
      toast.error(`Unsupported file type: ${file.name}`)
      return
    }

    const jobId = crypto.randomUUID()
    setJobs((prev) => [...prev, { id: jobId, name: file.name, progress: 0 }])

    const progressTimer = setInterval(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, progress: Math.min(92, j.progress + 14) } : j,
        ),
      )
    }, 180)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/ingest", { method: "POST", body: formData })
      const data = await res.json()

      clearInterval(progressTimer)

      if (!res.ok) {
        toast.error(data.error ?? "Ingestion failed.")
        setJobs((prev) => prev.filter((j) => j.id !== jobId))
        return
      }

      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, progress: 100 } : j)),
      )

      setTimeout(() => {
        setJobs((prev) => prev.filter((j) => j.id !== jobId))
        onIngested({
          id: data.id,
          name: data.name,
          type: (file.name.split(".").pop() as KnowledgeDocument["type"]) ?? "txt",
          size: `${(data.size / 1024 / 1024).toFixed(1)} MB`,
          status: "indexed",
          chunks: data.chunks,
          uploadedAt: new Date(data.uploadedAt).toISOString().slice(0, 10),
        })
        toast.success(`${file.name} indexed — ${data.chunks} chunks embedded.`)
      }, 400)
    } catch {
      clearInterval(progressTimer)
      setJobs((prev) => prev.filter((j) => j.id !== jobId))
      toast.error(`Failed to ingest ${file.name}.`)
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach(ingestFile)
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border px-6 py-12 text-center transition-colors",
          isDragging && "border-primary bg-accent/40",
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <UploadCloud className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">
            Drag & drop files, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, CSV, DOCX, or TXT — chunked and embedded automatically
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      {jobs.length > 0 && (
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-medium">
                    {job.name}
                  </span>
                  <span className="font-mono-label text-[10px] text-muted-foreground">
                    {job.progress < 100 ? "EMBEDDING" : "DONE"}
                  </span>
                </div>
                <Progress value={job.progress} className="h-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
