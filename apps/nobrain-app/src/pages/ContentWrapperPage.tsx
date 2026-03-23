import DynamicForm from '@/components/DynamcForm/DynamicForm'
import AuthorBar from '@/components/ui/AuthorBar'
import Brand from '@/components/widgets/Brand'
import type { ContentWithSchemas } from '@/types/content'
import { broker, storage, type User } from '@nx-mono/broker'
import { UserWidget } from '@nx-mono/user-widget'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ContentWrapperPage({initialMode='read'}:{initialMode: 'read' | 'edit' | 'view'}) {

  const API_URL = import.meta.env.VITE_API_NET || 'http://localhost:8000'  

  const { content_id } = useParams()
  const token = storage.getToken()

  const [mode, setMode] = useState<'read'|'view'|'edit'>(initialMode)
  const [content, setContent] = useState<ContentWithSchemas | null>(null)
  const [user, setUser] = useState(storage.getUser())

  useEffect(() => {
    if (content_id) {
      fetch(`${API_URL}/content/${content_id}`)
        .then(res => res.json())
        .then((data: ContentWithSchemas) => setContent(data))
    }
    if(token && !content_id ) {
      fetch(`${API_URL}/content/${content_id}/view`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    }
  }, [content_id])

  useEffect(() => {
    const onLogin = ({ user }: { token: string; user: User }) => setUser(user)
    const onLogout = () => {
      setUser(null)
      setMode('read')
    }

    broker.on('auth:login-success', onLogin)
    broker.on('auth:logout', onLogout)
    return () => {
      broker.off('auth:login-success', onLogin)
      broker.off('auth:logout', onLogout)
    }
    
  }, [token])

  const isOwner = (content && user && content.author_id === Number(user?.id)) ? true  : false
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

        <div className="brick"><Brand mode={true} /></div>
        <div><div><UserWidget /></div></div>
        <div className="brick">
          {(mode === 'edit' && !content_id) ?
            // render Creat empty form
            <DynamicForm onSaveSuccess={() => setMode('read')} mode="edit" /> :
            // render Edit content form
            <>
              <div className='author'>
                {isOwner && <AuthorBar mode={mode} onEdit={setMode} /> }
                {content? <DynamicForm onSaveSuccess={() => setMode('read')} mode={mode} data={content} /> : 
                  user && content? <p>Loading...</p> : <p>You are not logged in...</p> }
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