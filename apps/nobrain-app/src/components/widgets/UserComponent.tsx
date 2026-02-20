import { useEffect, useState } from 'react'
import { broker, storage } from '@nx-mono/broker'
import type { User } from '@nx-mono/broker'

export default function UserComponent() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const u = storage.getUser()
    const t = storage.getToken()
    setToken(t)
    setUser(u)
  }, [user?.id])

  return (
    <div className="auth-bar">
      <button className="user-trigger" onClick={() => {
        setShowLogin(!showLogin)
        broker.emit('ui:show-login', { visible: !showLogin})
      }}>
        {!token? '🔑' : `👤 ${user?.username}` }
      </button>
      
      <a href="/play">Play</a>
      <a href={"/read/"}>Read</a>
      <a href="/play">Repeat</a>
    </div>
  )
}