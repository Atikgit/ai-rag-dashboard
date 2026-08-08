import { getMockResponse } from "@/lib/mock-data"

// ─────────────────────────────────────────────────────────────────────────
// MOCK CHAT ENDPOINT
//
// This route is a scaffold for a production RAG chat pipeline. It currently
// returns a canned response streamed word-by-word so the UI can demonstrate
// the full chat experience (markdown rendering, source citations, model
// switching) without a real backend.
//
// In a production implementation, this is where you would:
//
//   1. Parse `messages` + `model` + `vectorDb` from the request body.
//   2. Embed the latest user message with an embeddings model
//      (e.g. OpenAI `text-embedding-3-large`, Cohere Embed).
//   3. Query the configured vector database (Pinecone / Weaviate / FAISS)
//      for the top-k most similar chunks:
//
//        const results = await pineconeIndex.query({
//          vector: queryEmbedding,
//          topK: 5,
//          includeMetadata: true,
//        })
//
//   4. Feed the retrieved chunks into an orchestration framework
//      (LangChain.js / LlamaIndex.TS / Haystack) to build the augmented
//      prompt, e.g. a LangChain `RetrievalQAChain` or `createRetrievalChain`.
//   5. Stream the LLM completion back to the client (e.g. via the Vercel
//      AI SDK's `streamText`) and attach the retrieved source metadata
//      as citations alongside the generated tokens.
//
// The `␟CITATIONS␟<json>` delimiter below is a placeholder wire format for
// this mock — a real implementation would likely use a structured
// streaming protocol (e.g. AI SDK data stream parts) instead.
// ─────────────────────────────────────────────────────────────────────────

const CITATION_DELIMITER = "\n␟CITATIONS␟"

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const messages = Array.isArray(body?.messages) ? body.messages : []
  const lastUserMessage =
    [...messages].reverse().find((m: { role: string }) => m.role === "user")
      ?.content ?? ""

  // Placeholder: real implementation embeds + queries the vector DB here.
  const { content, sources } = getMockResponse(String(lastUserMessage))
  const words = content.split(/(\s+)/)

  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(new TextEncoder().encode(word))
        // Simulated token-generation latency.
        await new Promise((r) => setTimeout(r, 12 + Math.random() * 18))
      }
      controller.enqueue(
        new TextEncoder().encode(
          `${CITATION_DELIMITER}${JSON.stringify(sources)}`,
        ),
      )
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  })
}
