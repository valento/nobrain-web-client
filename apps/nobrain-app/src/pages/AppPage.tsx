import Brand from '@/components/widgets/Brand'
import { appRegistry } from '@/registry/appRegistry'
import { UserWidget } from '@nx-mono/user-widget'
import { useParams } from 'react-router-dom'
import { NumberTrend } from '../../../../packages/lototech/src/lib/components'

export const AppPage = () => {
  const { app_name } = useParams()
  const Component = appRegistry[app_name || '']

  return (
    <div className="page-grid">
      <div className="column">
        <div className="brick brick--dual-medium">
          <NumberTrend number={22} type='hot' />
        </div>
      </div>
      <div className="column">
        <div className="brick"><Brand mode={false} /></div>
        <div><UserWidget /></div>
        
        <Component mode='full'/>
      </div>
      <div className="column" />
    </div>
  )
}