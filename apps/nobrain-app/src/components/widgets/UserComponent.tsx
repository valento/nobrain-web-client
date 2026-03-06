import { useEffect, useState } from 'react'
import { broker, storage } from '@nx-mono/broker'
import type { User } from '@nx-mono/broker'

export default function UserComponent() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showUser, setShowUser] = useState(false)

  useEffect(() => {
    // Set up listener
    const handleSuccess = ({ token, user }:  { token: string; user: User }) => {
      setToken(token)
      setUser(user)
    }
    const handleLogout = () => { setUser(null) }
    
    broker.on('auth:login-success', handleSuccess)
    broker.on('auth:logout', handleLogout)

    const u = storage.getUser()
    const t = storage.getToken()
    
    setToken(t)
    setUser(u)

    return () => {
      broker.off('auth:login-success', handleSuccess )
      broker.off('auth:logout', handleLogout )
    }
  }, [user?.id, token])

  return (
    <div className='menu-bar'>
      
        {!token? 
        <button className="user-trigger" onClick={() => {
            setShowUser(!showUser)
            broker.emit('ui:show-login', { visible: !showUser})
          }}>
            <svg width="1.5rem" height="1.5rem" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path fill="#333333" d="M10,1 C12.7614,1 15,3.23858 15,6 C15,8.76142 12.7614,11 10,11 L6,11 L6,13 L4,13 L4,15 L1,15 L1,12 L5.29737,7.70263 C5.10493,7.1712 5,6.59785 5,6 C5,3.23858 7.23858,1 10,1 Z M10,3 C8.34315,3 7,4.34315 7,6 C7,7.65685 8.34315,9 10,9 C11.6569,9 13,7.65685 13,6 C13,4.34315 11.6569,3 10,3 Z M10.7,4.3 C11.2522,4.3 11.7,4.74772 11.7,5.3 C11.7,5.85229 11.2522,6.3 10.7,6.3 C10.1477,6.3 9.69995,5.85229 9.69995,5.3 C9.69995,4.74772 10.1477,4.3 10.7,4.3 Z"/>
            </svg>
        </button> :
        <button onClick={(e) => {
          e.stopPropagation()
          broker.emit('ui:show-user')
        }  }>
          <div>
            <svg
              fill="#28aae0"
              xmlns="http://www.w3.org/2000/svg" 
              width="1rem"
              height="1rem"
              viewBox="0 0 52 52"
              enable-background="new 0 0 52 52"
            >
              <path d="M50,43v2.2c0,2.6-2.2,4.8-4.8,4.8H6.8C4.2,50,2,47.8,2,45.2V43c0-5.8,6.8-9.4,13.2-12.2
                c0.2-0.1,0.4-0.2,0.6-0.3c0.5-0.2,1-0.2,1.5,0.1c2.6,1.7,5.5,2.6,8.6,2.6s6.1-1,8.6-2.6c0.5-0.3,1-0.3,1.5-0.1
                c0.2,0.1,0.4,0.2,0.6,0.3C43.2,33.6,50,37.1,50,43z M26,2c6.6,0,11.9,5.9,11.9,13.2S32.6,28.4,26,28.4s-11.9-5.9-11.9-13.2
                S19.4,2,26,2z"/>
            </svg>
            <span>{user?.username}</span>
          </div>
        </button>
        }
      
      <div className='menu'>
        <a href="/play">Play</a>
        <a href={"/read/"}>Read</a>
        <a href="/play">Repeat</a>
      </div>
      <div></div>
    </div>
  )
}