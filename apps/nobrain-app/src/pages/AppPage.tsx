import Brand from '@/components/widgets/Brand'
import { UserWidget } from '@nx-mono/user-widget'
import { useParams } from 'react-router-dom'
import { appRegistry } from '@/registry/appRegistry'

export const AppPage = () => {

  const { app_name, instance_slug } = useParams()
  const Component = appRegistry[app_name?.concat('Page') || '']

  return (
    <>
      <div className="page-grid">
        <div className="column">
          <div className="brick brick--dual-medium">
            {/*  */}
          </div>
        </div>
        <div className="column">
          <div className="brick"><Brand mode={false} /></div>
          <div><UserWidget /></div>
          
        </div>
        <div className="column" />
      </div>

      {/* ====================================================================== */}
      {/* ===== your full app page here... ================================== */}

      <Component instance_slug={instance_slug} mode='full' />
    </>
  )
}