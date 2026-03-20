import Brand from '@/components/widgets/Brand'
import { appRegistry } from '@/registry/appRegistry'
import { UserWidget } from '@nx-mono/user-widget'
import { useParams } from 'react-router-dom'
import { ChordDiagram, NumberTrend } from '../../../../packages/lototech/src/lib/components'

export const AppPage = () => {
  const { app_name } = useParams()
  const Component = appRegistry[app_name || '']

  return (
    <>
    <div className="page-grid">
      <div className="column">
        <div className="brick brick--dual-medium">
        </div>
      </div>
      <div className="column">
        <div className="brick"><Brand mode={false} /></div>
        <div><UserWidget /></div>
        
      </div>
      <div className="column" />
    </div>

    {/* ====================================================================== */}
    {/* ============= Your APP here... ======================================= */}
    <div className="page-grid">
      <div className="column">
        <br />
        {/*  */}
        <NumberTrend number={22} type='hot' />
        {/* <NumberTrend number={12} type='hot' />
        <NumberTrend number={32} type='hot' /> */}
      </div>
      <div className="column center">
        <Component mode='full'/>
      </div>
      <div className="column">
        <ChordDiagram />
      </div>
    </div>
    </>
  )
}