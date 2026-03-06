export interface ContentItem {
  id: number
  title: string
  deck: string | null
  body: string
  author_id: number | null
  author_username: string | null
  parent_id: number | null
  created_at: string
  updated_at: string
  slug: string | null
  content_type: string
  category: string
  category_id: number | null   // added
  category_slug: string | null // was string, nullable for safety
  priority: number
  widget_size: string
  widget_vertical: boolean
  view_count: number
  social_score: number
  price: number
  metadata: Record<string, any>
  tags: string[]
  sequence_order: number | null
}

export interface ContentWithSchemas {
  id: number
  title: string
  deck: string | null
  body: string
  slug: string | null
  author_id: number | null
  author_username: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  parent_id: number | null
  widget_size: string
  widget_vertical: boolean
  content_type: string
  category_id: number | null   // added
  category_slug: string | null // added
  price: number
}

export interface BrickItem {
  brick_type: 'xlarge' | 'large_small' | 'dual_medium' | 'quad_small'
  items: ContentItem[]
}

export interface BrickFeedResponse {
  center: BrickItem[]
  left: BrickItem[]
  right: BrickItem[]
}

export interface Category {
  id: number
  name: string
  slug: string
  parent_id: number | null
}