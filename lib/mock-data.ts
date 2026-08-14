import type {
  ModelOption,
  KnowledgeDocument,
  VectorDb,
  Orchestrator,
} from "@/lib/types"

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "muse-glimmer", label: "Muse-Glimmer-30B", provider: "Meta" },
  { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  { id: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "llama-3", label: "LLaMA-3 70B", provider: "Meta" },
  { id: "mistral", label: "Mistral Large", provider: "Mistral AI" },
]

export const VECTOR_DB_OPTIONS: {
  id: VectorDb
  label: string
  description: string
}[] = [
  {
    id: "pinecone",
    label: "Pinecone",
    description: "Managed, low-latency vector search at scale.",
  },
  {
    id: "weaviate",
    label: "Weaviate",
    description: "Open-source vector DB with hybrid search.",
  },
  {
    id: "faiss",
    label: "FAISS",
    description: "In-process similarity search library by Meta AI.",
  },
]

export const ORCHESTRATOR_OPTIONS: {
  id: Orchestrator
  label: string
  description: string
}[] = [
  {
    id: "langchain",
    label: "LangChain",
    description: "Composable chains, agents, and retrievers.",
  },
  {
    id: "llamaindex",
    label: "LlamaIndex",
    description: "Data framework for LLM context augmentation.",
  },
  {
    id: "haystack",
    label: "Haystack",
    description: "End-to-end NLP pipelines for search & QA.",
  },
]

export const MOCK_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "doc_1",
    name: "company_policy.pdf",
    type: "pdf",
    size: "2.4 MB",
    status: "indexed",
    chunks: 184,
    uploadedAt: "2026-08-01",
  },
  {
    id: "doc_2",
    name: "q3_financials.csv",
    type: "csv",
    size: "890 KB",
    status: "indexed",
    chunks: 96,
    uploadedAt: "2026-08-03",
  },
  {
    id: "doc_3",
    name: "onboarding_handbook.pdf",
    type: "pdf",
    size: "5.1 MB",
    status: "indexed",
    chunks: 312,
    uploadedAt: "2026-08-04",
  },
  {
    id: "doc_4",
    name: "support_macros.csv",
    type: "csv",
    size: "410 KB",
    status: "processing",
    chunks: 0,
    uploadedAt: "2026-08-06",
  },
  {
    id: "doc_5",
    name: "product_spec_v2.pdf",
    type: "pdf",
    size: "3.8 MB",
    status: "indexed",
    chunks: 227,
    uploadedAt: "2026-08-07",
  },
]

export const STATS = {
  totalDocuments: 128,
  totalEmbeddings: 48213,
  apiLatencyMs: 214,
  indexHealth: 99.2,
}

const CANNED_RESPONSES = [
  {
    trigger: /refund|return|policy/i,
    content:
      "Based on the indexed policy documents, refunds are approved within **30 days** of purchase, provided the item is unused and in its original packaging. Digital goods are non-refundable unless defective.\n\nKey points:\n- Standard window: 30 days\n- Exchanges: allowed within 45 days\n- Digital products: final sale, except for verified defects",
    sources: [
      { source: "company_policy.pdf", index: "Pinecone Index", score: 0.94 },
      { source: "onboarding_handbook.pdf", index: "Pinecone Index", score: 0.81 },
    ],
  },
  {
    trigger: /onboard|new hire|handbook/i,
    content:
      "New hires complete onboarding in **3 phases**: account provisioning, compliance training, and team shadowing. Most employees finish within their first two weeks.\n\n```txt\nPhase 1 — Day 1-2:  Account + hardware setup\nPhase 2 — Day 3-5:  Compliance & security training\nPhase 3 — Week 2:   Team shadowing & first tasks\n```",
    sources: [
      { source: "onboarding_handbook.pdf", index: "Pinecone Index", score: 0.97 },
    ],
  },
  {
    trigger: /revenue|financial|q3|earnings/i,
    content:
      "Q3 revenue grew **12.4% quarter-over-quarter**, driven primarily by expansion in enterprise accounts. Gross margin held steady at 68%.\n\n| Metric | Q2 | Q3 |\n|---|---|---|\n| Revenue | $4.1M | $4.6M |\n| Gross Margin | 67.8% | 68.1% |\n| New Logos | 41 | 58 |",
    sources: [
      { source: "q3_financials.csv", index: "Weaviate Index", score: 0.89 },
    ],
  },
]

const DEFAULT_RESPONSE = {
  content:
    "I looked through the indexed knowledge base and found a few relevant passages. Here's a synthesized answer based on the retrieved context — let me know if you'd like me to go deeper on any part of it.\n\n> Retrieved context has been condensed for clarity. Ask a follow-up for more detail.",
  sources: [
    { source: "product_spec_v2.pdf", index: "Pinecone Index", score: 0.76 },
  ],
}

export function getMockResponse(userMessage: string) {
  const match = CANNED_RESPONSES.find((r) => r.trigger.test(userMessage))
  return match ?? DEFAULT_RESPONSE
}
