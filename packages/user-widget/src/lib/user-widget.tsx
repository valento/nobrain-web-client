import { useState, useEffect } from 'react'
import { broker, storage, User } from '@nx-mono/broker'
import { LoginWidget } from './login-widget'

export function UserWidget() {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const onToggle = ({ visible }: { visible: boolean }) => setShowLogin(visible)
    const saved = storage.getUser()
    if(saved) setUser(saved)
    
    const onLogin = ({ token, user }: { token: string; user: User }) => {
      storage.setToken(token)
      storage.setUser(user)
      setUser(user)
      setShowLogin(false)
    }

    const onLogout = () => {
      storage.clear()
      setUser(null)
      setShowLogin(false)
    }

    broker.on('ui:show-login', onToggle)
    broker.on('auth:login-success', onLogin)
    broker.on('auth:logout', onLogout)
    return () => {
      broker.off('auth:login-success', onLogin)
      broker.off('auth:logout', onLogout)
    }
  }, [])

  // Not logged in — login trigger + dropdown
  if (!user) {
    return (
      <div className="user-widget">
        {showLogin && (
          <div className="user-dropdown">
            <LoginWidget />
          </div>
        )}
      </div>
    )
  }

  // Logged in — avatar + drawer overlay
  return (
    <>
      
      <div className="user-widget">
        
        {/* <button className="user-trigger" onClick={() => setshowLogin(!showLogin)}>
          👤 {user.name}
        </button> */}

        {open && (
          <>
            <div className="drawer-backdrop" onClick={() => setOpen(false)} />
            <nav className="drawer">
              <div className="drawer-header">
                <span>{user.name}</span>
                <button onClick={() => setOpen(false)}>✕</button>
              </div>
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Marketplace</li>
                <li>
                  <button onClick={() => broker.emit('auth:logout')}>
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </>
  )
}