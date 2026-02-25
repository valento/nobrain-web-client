import DynamicForm from '@/components/DynamcForm/DynamicForm'
import Brand from '@/components/widgets/Brand'
import type { ContentItem } from '@/types'
import { storage } from '@nx-mono/broker'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface SchemaProperty {
  type: string
  maxLength?: number
  minimum?: number
  maximum?: number
  enum?: string[]
  items?: {
    type: string
  }
  const?: string
  properties?: Record<string, SchemaProperty>
}

interface ContentWithSchemas {
  id: number
  title: string
  deck: string
  body: string
  slug: string
  author_name: string
  author_id: number
  metadata: Record<string, SchemaProperty>
  created_at: string
  updated_at: string
}

export default function ContentWrapperPage({initialMode='read'}:{initialMode: 'read' | 'edit'}) {

  const { content_id } = useParams()
  console.log(content_id);
  

  const user = storage.getUser()
  const [mode, setMode] = useState(initialMode)
  const [content, setContent] = useState<ContentWithSchemas | null>(null)

  useEffect(() => {
    if (content_id) {
      fetch(`http://localhost:8000/content/${content_id}`)
        .then(res => res.json())
        .then((data: ContentWithSchemas) => setContent(data))
    }
  }, [content_id])

  const isOwner = (content && user) ? content.author_id === Number(user.id) : false

  const style = user?.id && mode == 'edit' ? 'page-grid user' : 'page-grid'

  return (
    <div className={style}>
      
      <div className="column">
        <div className="brick">
          <div className='widget'>
            <div className='timestamp'>services | Oct 01, 2025</div>
            <p>ID: {user?.id}</p>
          </div>
        </div>
      </div>

      <div className="column center">

        <div className="brick"><Brand /></div>
        <div className="brick">
          {(initialMode === 'edit' && !content_id) ?
            // render Creat empty form
            <DynamicForm mode="edit" /> :
            // render Edit content form
            <>
              {content? <DynamicForm mode={mode} data={content} /> : <p>Loading...</p>}
              {mode === 'read' && isOwner && (
                <button onClick={() => setMode('edit')}>Edit</button>
              )}
            </>
            
          }
        </div>
      </div>


      {user?.id && <div className="column">
        <div className="brick">
          <div className='widget number'>
            <div className='timestamp'>services | Oct 01, 2025</div>
          </div>
          <div className='widget number'>
            <div className='timestamp dark'>tech | Nov 21, 2025</div>
          </div>
        </div>
        <div className="brick">
          <div className='widget number'>
            <div className='timestamp'>services | Oct 01, 2025</div>
          </div>
        </div>
      </div>}

    </div>
    
  )
}