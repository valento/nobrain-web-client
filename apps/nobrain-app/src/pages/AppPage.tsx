import { appRegistry } from '@/registry/appRegistry'
import { useParams } from 'react-router-dom'

export const AppPage = () => {
  const { app_name } = useParams()
  const Component = appRegistry[app_name || '']

  return (
    <div className="page-grid">
      <div className="column" />
      <div className="column">
        <Component mode='full'/>
      </div>
      <div className="column" />
    </div>
  )
}