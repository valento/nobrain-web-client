import { useEffect, useState } from 'react'
import BrickComponent from './BrickComponent'
import ReadCard from './ReadCard'
import type { BrickFeedResponse, BrickItem } from '@/types'

export default function ColumnComponent() {

  const API_URL = import.meta.env.VITE_API_NET || 'http://localhost:8000'

  const [bricks, setBricks] = useState<BrickItem[]>([])

  useEffect(() => {
    fetch(`${API_URL}/content/feed`)
      .then(r => r.json())
      .then((data: BrickFeedResponse) => setBricks(data.center))
  }, [])

  return (
    <div className="column">
      {bricks.map((brick, i) => (
        <BrickComponent key={i} brickType={brick.brick_type} >
          {brick.items.map(item => (
            <ReadCard key={item.id} item={item} />
          ))}
        </BrickComponent>
      ))}
    </div>
  )
}