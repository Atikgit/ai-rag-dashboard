// ─────────────────────────────────────────────────────────────────────────
// MOCK INGESTION ENDPOINT
//
// This route scaffolds the data-ingestion pipeline for the RAG knowledge
// base. It currently just validates the upload and returns a fabricated
// job summary so the admin dashboard can demonstrate the ingestion flow.
//
// In a production implementation, this is where you would:
//
//   1. Receive the uploaded file(s) (PDF / CSV / DOCX) via `FormData` and
//      persist the raw file to object storage (e.g. Vercel Blob, S3).
//   2. Parse and chunk the document content:
//        - PDFs: extract text per page (e.g. `pdf-parse`, `unstructured.io`)
//        - CSVs: parse rows and chunk by record or logical section
//   3. Generate embeddings for each chunk with an embeddings model
//      (e.g. OpenAI `text-embedding-3-large`, Cohere Embed v3).
//   4. Upsert the embeddings + metadata into the configured vector
//      database (Pinecone / Weaviate / FAISS), namespaced per knowledge
//      base or tenant:
//
//        await pineconeIndex.upsert(
//          chunks.map((chunk) => ({
//            id: chunk.id,
//            values: chunk.embedding,
//            metadata: { source: file.name, text: chunk.text },
//          })),
//        )
//
//   5. Optionally register the document + chunk graph with the
//      orchestration framework (LangChain / LlamaIndex / Haystack) so it
//      can be retrieved during chat completions.
//   6. Persist ingestion job status (processing / indexed / failed) to a
//      database so the dashboard can poll or subscribe to progress.
// ─────────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null)
  const file = formData?.get("file") as File | null

  if (!file) {
    return Response.json(
      { error: "No file provided." },
      { status: 400 },
    )
  }

  const allowed = [".pdf", ".csv", ".docx", ".txt"]
  const isAllowed = allowed.some((ext) => file.name.toLowerCase().endsWith(ext))

  if (!isAllowed) {
    return Response.json(
      { error: "Unsupported file type. Upload a PDF, CSV, DOCX, or TXT file." },
      { status: 415 },
    )
  }

  // Simulated processing latency for parsing + embedding + upsert.
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 900))

  const mockChunkCount = Math.max(8, Math.round(file.size / 4096))

  return Response.json({
    id: `doc_${Date.now()}`,
    name: file.name,
    size: file.size,
    status: "indexed",
    chunks: mockChunkCount,
    uploadedAt: new Date().toISOString(),
  })
}
