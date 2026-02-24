import { useEffect, useState } from 'react'
import { broker, storage } from '@nx-mono/broker'
import type { User } from '@nx-mono/broker'

export default function UserComponent() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    // Set up listener
    const handleSuccess = ({ token, user }:  { token: string; user: User }) => {
      setToken(token)
      setUser(user)
    }
    broker.on('auth:login-success', handleSuccess)

    const u = storage.getUser()
    const t = storage.getToken()
    
    setToken(t)
    setUser(u)

    return () => broker.off('auth:login-success', handleSuccess )
  }, [user?.id, token])

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