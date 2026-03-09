import type { ContentItem } from '@/types'
import SocialBar from './SocialBar'
import { useNavigate } from 'react-router-dom'


export default function ReadCard({ item }: { item: ContentItem }) {

  const navigate = useNavigate()
  
  enum Priority {
    unimportant = 1,
    weak,
    regular,
    important,
    promoted
  }

  return (
    <div className={'widget ' + item.category_slug + ' ' + Priority[item.priority] }>
      
      {/* // <a href={`/read/${item.category}/${item.id}`} className="read-card"> */}
        <div className='timestamp'>{item.category_slug} | {new Date(item.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        <div className="header" onClick={() => navigate(`/read/${item.slug || item.id}`)}>
          <h1>{item.title}</h1>
          {item.deck && <p>{item.deck}</p>}
        </div>
        {item.body &&
          <div className="body" onClick={() => navigate(`/read/${item.slug || item.id}`)} >
            {item.body}
          </div>
        }
        <SocialBar url='http://localhost' title='noBrain shared content' />
      {/* // </a> */}

    </div>
  )
}