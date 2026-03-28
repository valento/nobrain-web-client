import { PollsApp } from './polls-app'

export function PollsAppPage () {
  return (
      <div className="page-grid">
      <div className="column">
        ...
      </div>
      <div className="column">
        <PollsApp contentSlug={'bg-ellections'} mode = 'full' />
      </div>
      <div className="column">
        ...
      </div>
    </div>
  )
}