import DynamicForm from '@/components/DynamcForm/DynamicForm'
import Brand from '@/components/widgets/Brand'
import { useParams } from 'react-router-dom'

function ContentPage() {
  const { contentType, category, id } = useParams<{
    contentType: string
    category: string
    id: string
  }>()

  return (
    <div className='page-grid'>
      
      <div className="column">
        <div className="brick">
          <div className='widget'>
            <div className='timestamp'>services | Oct 01, 2025</div>
            <p>{contentType}/ {category} / {id}</p>
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
      </div>

      <div className="column center">
        <div className="brick"><Brand /></div>
        <div className="brick">
          {id? <DynamicForm contentId={parseInt(id)} mode='read'/>:
            <div>No page</div>
          }
        </div>
      </div>

      <div className="column">
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
      </div>

    </div>
    
  )
}

export default ContentPage