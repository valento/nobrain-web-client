import { useEffect, useState } from 'react'
import { broker } from '@nx-mono/broker'

import user_icon from '@/assets/user.svg'

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
        {!user? <img src={user_icon} alt="user" width={24} height={24} /> : <img src={user_icon} alt="user" width={24} height={24} />}
      </button>

      <a href="/play">Play</a>
      <a href={"/create/"+id}>Read</a>
      <a href="/play">Repeat</a>
    </div>
  )
}