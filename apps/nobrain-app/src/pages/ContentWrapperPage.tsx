import DynamicForm from '@/components/DynamcForm/DynamicForm'
import Brand from '@/components/widgets/Brand'
import { useParams } from 'react-router-dom'

export default function ContentWrapperPage({mode='read'}:{mode: 'read' | 'edit'}) {
  const { user_id, id, contentType, category } = useParams<{
    user_id?: string
    id?: string
    contentType?: string
    category?: string

  }>()

  const style = user_id && mode == 'edit' ? 'page-grid user' : 'page-grid'

  return (
    <div className={style}>
      
      <div className="column">
        <div className="brick">
          <div className='widget'>
            <div className='timestamp'>services | Oct 01, 2025</div>
            <p>ID: {user_id}</p>
          </div>
        </div>
      </div>

      <div className="column center">
        <div className="brick"><Brand /></div>
        <div className="brick">
          {user_id || id? <DynamicForm contentId={id? Number(id) :  undefined} mode={mode}/>: <div>No page</div>}
        </div>
      </div>

      {id&& <div className="column">
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