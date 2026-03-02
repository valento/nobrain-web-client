import DynamicForm from '@/components/DynamcForm/DynamicForm'
import AuthorBar from '@/components/ui/AuthorBar'
import Brand from '@/components/widgets/Brand'
import type { ContentWithSchemas } from '@/types/content'
import { storage } from '@nx-mono/broker'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ContentWrapperPage({initialMode='read'}:{initialMode: 'read' | 'edit' | 'view'}) {

  const { content_id } = useParams()
  const token = storage.getToken()
  // console.log(content_id);
  

  const user = storage.getUser()
  const [mode, setMode] = useState<'read'|'view'|'edit'>(initialMode)
  const [content, setContent] = useState<ContentWithSchemas | null>(null)

  useEffect(() => {
    if (content_id) {
      fetch(`http://localhost:8000/content/${content_id}`)
        .then(res => res.json())
        .then((data: ContentWithSchemas) => setContent(data))
    }
    if(token && !content_id ) {  // Only for logged-in users
      fetch(`http://localhost:8000/content/${content_id}/view`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
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
          {(mode === 'edit' && !content_id) ?
            // render Creat empty form
            <DynamicForm onSaveSuccess={() => setMode('read')} mode="edit" /> :
            // render Edit content form
            <>
              <div className='author'>
                {isOwner &&   ( <AuthorBar mode={mode} onEdit={setMode} /> )}
                {content? <DynamicForm onSaveSuccess={() => setMode('read')} mode={mode} data={content} /> : <p>Loading...</p>}
              </div>
            </>
            
          }
        </div>
      </div>


      {user?.id && <div className="column">
        <div className="brick">
          <div className='widget .theme-sport'>
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