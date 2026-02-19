import type { SearchResultItem } from '@/types'

const API_BASE = 'http://localhost:8000'

interface SearchResponse {
  results: SearchResultItem[]
  count: number
  query: string
}

export async function searchContent(query: string): Promise<SearchResultItem[]> {
  const response = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit: 10, threshold: 0.5 })
  })

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`)
  }

  const data: SearchResponse = await response.json()
  return data.results
}