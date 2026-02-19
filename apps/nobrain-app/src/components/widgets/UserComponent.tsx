import { broker } from '@nx-mono/broker'
import { useEffect, useState } from 'react'

export default function UserComponent() {
  const [user, setUser] = useState<string | null>(null)
  const [id, setId] = useState<number | null>()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    setUser(localStorage.getItem('tolken'))
  }, [user])

  return (
    <div className="auth-bar">
      <button className="user-trigger" onClick={() => {
        setShowLogin(!showLogin)
        broker.emit('ui:show-login', { visible: !showLogin})
      }}>
        {!user? '🔑' : ''
}      </button>
      {/* <button className="user-trigger" onClick={() => setOpen(!open)}>
        👤 {user}
      </button> */}
      <a href="/play">Play</a>
      <a href={"/create/"+id}>Read</a>
      <a href="/play">Repeat</a>
    </div>
  )
}