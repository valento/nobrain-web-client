import type { ContentItem } from '@/types'

export default function ReadCard({ item }: { item: ContentItem }) {
  return (
    <a href={`/read/${item.category}/${item.id}`} className="read-card">
      <h3>{item.title}</h3>
      {item.deck && <p className="deck">{item.deck}</p>}
      <span className="date">
        {new Date(item.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </span>
      {item.tags.length > 0 && (
        <div className="tag-list">
          {item.tags.map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
        </div>
      )}
    </a>
  )
}