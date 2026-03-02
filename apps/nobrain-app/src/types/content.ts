// src/types/content.ts
export interface ContentItem {
  id: number
  title: string
  deck: string | null
  body: string
  author_id: number | null
  author_username: string | null
  parent_id: number | null
  sequence_order: number | null
  created_at: string
  updated_at: string
  metadata: Record<string, any>
  slug: string | null
  content_type: string
  category: string
  tags: string[]
}

interface SchemaProperty {
  type: string
  maxLength?: number
  minimum?: number
  maximum?: number
  enum?: string[]
  items?: {
    type: string
  }
  const?: string
  properties?: Record<string, SchemaProperty>
}
export interface ContentWithSchemas {
  id: number
  title: string
  deck: string
  body: string
  slug: string
  author_id: number | null
  author_username: string
  metadata: Record<string, SchemaProperty>
  created_at: string
  updated_at: string
  parent_id: number
  widget_size: string
  // widget_vertical: boolean
  content_type: string
  price: number
}