import { appRegistry } from '@/registry/appRegistry'
import type { ContentItem } from '@/types'

export function AppCard({ item }: { item: ContentItem }) {
  const Component = appRegistry[item.component_name || '']
  if (!Component) return <div className="app-card">Unknown app</div>

  return (
    <div className="app-card widget">
      <Component />
    </div>
  )
}