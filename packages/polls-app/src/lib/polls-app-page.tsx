import { PollsApp } from './polls-app'

interface ContentItem {
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
  component_name: string | null
  route_path: string | null
  app_config: Record<string, any>
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

export function PollsAppPage ({instance_slug}: { instance_slug: string}) {
  return (
    <div className="page-grid">
      <div className="column">
        <div>...</div>
      </div>
      <div className="column center">
        <PollsApp instance_slug={instance_slug} mode = 'full' />
      </div>
      <div className="column">
        ...
      </div>
    </div>
  )
}