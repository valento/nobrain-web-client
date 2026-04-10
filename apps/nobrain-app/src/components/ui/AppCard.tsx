import { appRegistry } from '@/registry/appRegistry'
import type { ContentItem } from '@/types'

export function AppCard({ item, key }: { item: ContentItem, key: number }) {
  const Component = appRegistry[item.component_name || '']
  if (!Component) return <div className="app-card">Unknown app</div>

  return (
    <div className="app-card widget">
      <Component mode='widget' item = {item} />
    </div>
  )
}