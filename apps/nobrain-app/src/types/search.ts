export interface SearchResultItem {
  id: number
  title: string
  snippet: string
  metadata: Record<string, unknown>
  semantic_similarity: number
  priority: number
  final_score: number
  url: string
}