export type ModelId = "muse-glimmer" | "gpt-4o" | "claude-3.5-sonnet" | "llama-3" | "mistral"

export interface ModelOption {
  id: ModelId
  label: string
  provider: string
}

export interface Citation {
  source: string
  index: string
  score: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: Citation[]
  model?: ModelId
  createdAt: number
}

export type VectorDb = "pinecone" | "weaviate" | "faiss"
export type Orchestrator = "langchain" | "llamaindex" | "haystack"

export interface KnowledgeDocument {
  id: string
  name: string
  type: "pdf" | "csv" | "docx" | "txt"
  size: string
  status: "indexed" | "processing" | "failed"
  chunks: number
  uploadedAt: string
}
