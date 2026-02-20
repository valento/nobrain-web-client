// src/types/content.ts
export interface ContentItem {
  id: number
  title: string
  deck: string | null
  body: string
  author_name: string | null
  created_at: string
  updated_at: string
  metadata: Record<string, any>
  slug: string | null
  content_type: string
  category: string
  tags: string[]
}