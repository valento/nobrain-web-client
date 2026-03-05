import type { ContentItem } from '@/types'

export default function ReadCard({ item }: { item: ContentItem }) {
  return (
    <div className={'widget '+item.category_slug} onClick={() => window.location.href = `/read/${item.slug || item.id}`}>
      
      {/* // <a href={`/read/${item.category}/${item.id}`} className="read-card"> */}
        <div className='timestamp'>{item.category_slug} | {new Date(item.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        <div className="header">
          <h1>{item.title}</h1>
          {item.deck && <p>{item.deck}</p>}
        </div>
        {item.body && <div className="body">{item.body}</div> }
      {/* // </a> */}

    </div>
  )
}