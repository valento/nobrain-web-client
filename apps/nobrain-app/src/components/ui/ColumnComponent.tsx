import { useEffect, useState } from 'react'
import BrickComponent from './BrickComponent'
import ReadCard from './ReadCard'
import { chunkIntoBricks } from '@/utils'

import type { ContentItem } from '@/types'

export function ColumnComponent() {
  const [bricks, setBricks] = useState<ContentItem[][]>([])

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch('/api/content?type=read')
      const items: ContentItem[] = await res.json()
      setBricks(chunkIntoBricks(items))
    }
    fetchContent()
  }, [])

  return (
    <div className="column">
      <h1>Order some Bricks here...</h1>
      {bricks.map((group, i) => (
        <BrickComponent key={i}>
          {group.map(item => (
            <ReadCard key={item.id} item={item} />
          ))}
        </BrickComponent>
      ))}
    </div>
  )
}