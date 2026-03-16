import BrickComponent from './BrickComponent'
import { AppCard } from './AppCard'
import ReadCard from './ReadCard'
import type { BrickItem } from '@/types'

export default function ColumnComponent({ bricks }: { bricks: BrickItem[]}) {

  return (
    <div className="column">
      {bricks.length && bricks.map((brick, i) => (
        <BrickComponent key={i} brickType={brick.brick_type} >
          {brick.items.map(item => (
            item.content_type === 'app'
            ? <><AppCard item={item}/><div /></>
            : <ReadCard key={item.id} item={item} />
          ))}
          
        </BrickComponent>
      ))}
    </div>
  )
}