import type { ContentItem } from '@/types'
import SocialBar from './SocialBar'

enum Priority {
  unimportant = 1,
  weak,
  regular,
  important,
  promoted
}

export default function ReadCard({ item }: { item: ContentItem }) {
  return (
    <div className={'widget ' + item.category_slug + ' ' + Priority[item.priority] }>
      
      {/* // <a href={`/read/${item.category}/${item.id}`} className="read-card"> */}
        <div className='timestamp'>{item.category_slug} | {new Date(item.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        <div className="header">
          <h1 onClick={() => window.location.href = `/read/${item.slug || item.id}`}>{item.title}</h1>
          {item.deck && <p>{item.deck}</p>}
        </div>
        {item.body && <div className="body" onClick={() => window.location.href = `/read/${item.slug || item.id}`}>{item.body}</div> }
        <SocialBar url='http://localhost' title='noBrain shared content' />
      {/* // </a> */}

    </div>
  )
}