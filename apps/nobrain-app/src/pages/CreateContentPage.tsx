import DynamicForm from '@/components/DynamcForm/DynamicForm'
import Brand from '@/components/widgets/Brand'
import { useParams } from 'react-router-dom'

export default function CreateContentPage({mode='read'}:{mode: 'read' | 'edit'}) {
  const { user_id } = useParams<{
    user_id: string
  }>()

  return (
    <div className='page-grid user'>
      
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
          {user_id? <DynamicForm mode={mode}/>: <div>No page</div>}
        </div>
      </div>

    </div>
    
  )
}