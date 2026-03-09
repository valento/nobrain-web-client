import { useState, useEffect } from 'react'
import { broker, storage, User } from '@nx-mono/broker'
import { LoginWidget } from './login-widget'

export function UserWidget() {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )

  useEffect(() => {
    const onToggle = ({ visible }: { visible: boolean }) => {
      setShowLogin(visible)
    }

    const onToggleUserWidget = () => {
      console.log('set widget: ', open)
      setOpen(prev => !prev)
    }

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
    broker.on('ui:show-user', onToggleUserWidget)
    broker.on('auth:login-success', onLogin)
    broker.on('auth:logout', onLogout)

    return () => {
      broker.off('auth:login-success', onLogin)
      broker.off('ui:show-user', onToggleUserWidget)
      broker.off('auth:logout', onLogout)
    }
  }, [token])

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
    
    <div className="user-widget">

      {open && (
        <>
          <div className="drawer-backdrop" onClick={() => setOpen(false)} />
          <div className="drawer-link">
            <button onClick={() => setOpen(false)}>
              <svg fill="#333" width="1.3rem" height="1.3rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m20.48 3.512c-2.172-2.171-5.172-3.514-8.486-3.514-6.628 0-12.001 5.373-12.001 12.001 0 3.314 1.344 6.315 3.516 8.487 2.172 2.171 5.172 3.514 8.486 3.514 6.628 0 12.001-5.373 12.001-12.001 0-3.314-1.344-6.315-3.516-8.487zm-1.542 15.427c-1.777 1.777-4.232 2.876-6.943 2.876-5.423 0-9.819-4.396-9.819-9.819 0-2.711 1.099-5.166 2.876-6.943 1.777-1.777 4.231-2.876 6.942-2.876 5.422 0 9.818 4.396 9.818 9.818 0 2.711-1.099 5.166-2.876 6.942z"/><path d="m13.537 12 3.855-3.855c.178-.194.287-.453.287-.737 0-.603-.489-1.091-1.091-1.091-.285 0-.544.109-.738.287l.001-.001-3.855 3.855-3.855-3.855c-.193-.178-.453-.287-.737-.287-.603 0-1.091.489-1.091 1.091 0 .285.109.544.287.738l-.001-.001 3.855 3.855-3.855 3.855c-.218.2-.354.486-.354.804 0 .603.489 1.091 1.091 1.091.318 0 .604-.136.804-.353l.001-.001 3.855-3.855 3.855 3.855c.2.218.486.354.804.354.603 0 1.091-.489 1.091-1.091 0-.318-.136-.604-.353-.804l-.001-.001z"/></svg>
            </button>
            <div>
              <a href=''>
                <svg xmlns="http://www.w3.org/2000/svg"
                  fill="#333"
                  width="1.6rem"
                  height="1.6rem"
                  viewBox="0 0 52 52"
                  enable-background="new 0 0 52 52"
                >
                  <g>
                    <path d="M26.1,19.1c-3.9,0-7,3.1-7,7s3.1,7,7,7s7-3.1,7-7S30,19.1,26.1,19.1z"/>
                    <path d="M47.1,32.4l-3.7-3.1c0.2-1.1,0.3-2.3,0.3-3.4c0-1.1-0.1-2.3-0.3-3.4l3.7-3.1c1.2-1,1.6-2.8,0.8-4.2
                      l-1.6-2.8c-0.6-1-1.7-1.6-2.9-1.6c-0.4,0-0.8,0.1-1.1,0.2l-4.6,1.7c-1.8-1.6-3.8-2.7-5.9-3.4L31,4.6c-0.3-1.6-1.7-2.5-3.3-2.5h-3.2
                      c-1.6,0-3,0.9-3.3,2.5l-0.8,4.6c-2.2,0.7-4.2,1.9-6,3.4l-4.6-1.7c-0.4-0.1-0.7-0.2-1.1-0.2c-1.2,0-2.3,0.6-2.9,1.6l-1.6,2.8
                      c-0.8,1.4-0.5,3.2,0.8,4.2l3.7,3.1c-0.2,1.1-0.3,2.3-0.3,3.4c0,1.2,0.1,2.3,0.3,3.4L5,32.3c-1.2,1-1.6,2.8-0.8,4.2l1.6,2.8
                      c0.6,1,1.7,1.6,2.9,1.6c0.4,0,0.8-0.1,1.1-0.2l4.6-1.7c1.8,1.6,3.8,2.7,5.9,3.4l0.8,4.8c0.3,1.6,1.6,2.7,3.3,2.7h3.2
                      c1.6,0,3-1.2,3.3-2.8l0.8-4.8c2.3-0.8,4.4-2,6.2-3.7l4.3,1.7c0.4,0.1,0.8,0.2,1.2,0.2c1.2,0,2.3-0.6,2.9-1.6l1.5-2.6
                      C48.7,35.2,48.3,33.4,47.1,32.4z M26.1,37.1c-6.1,0-11-4.9-11-11s4.9-11,11-11s11,4.9,11,11S32.2,37.1,26.1,37.1z"/>
                  </g>
                </svg>
              </a>
              <a href=''>
                <svg version="1.1" id="Uploaded to svgrepo.com" xmlns="http://www.w3.org/2000/svg" 
                  width="1.6rem"
                  fill='#333'
                  height="1.6rem"
                  viewBox="0 0 32 32"
                >
                  <path d="M27.857,27.864C27.935,29.572,26.571,31,24.861,31H7.139c-1.71,0-3.075-1.428-2.997-3.136L4.957,9.955
                    C4.981,9.42,5.421,9,5.956,9h20.089c0.535,0,0.975,0.42,0.999,0.955L27.857,27.864z M16.185,1.003C12.787,0.901,10,3.625,10,7v1h2V7
                    c0-2.209,1.791-4,4-4s4,1.791,4,4v1h2V7.252C22,3.966,19.468,1.101,16.185,1.003z"/>
                </svg>
              </a>            
              <button onClick={() => broker.emit('auth:logout')}>
                <svg xmlns="http://www.w3.org/2000/svg"
                  fill="#333" 
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 52 52"
                  enable-background="new 0 0 52 52"
                >
                  <g>
                    <path d="M21,48.5v-3c0-0.8-0.7-1.5-1.5-1.5h-10C8.7,44,8,43.3,8,42.5v-33C8,8.7,8.7,8,9.5,8h10
                      C20.3,8,21,7.3,21,6.5v-3C21,2.7,20.3,2,19.5,2H6C3.8,2,2,3.8,2,6v40c0,2.2,1.8,4,4,4h13.5C20.3,50,21,49.3,21,48.5z"/>
                    <path d="M49.6,27c0.6-0.6,0.6-1.5,0-2.1L36.1,11.4c-0.6-0.6-1.5-0.6-2.1,0l-2.1,2.1c-0.6,0.6-0.6,1.5,0,2.1l5.6,5.6
                      c0.6,0.6,0.2,1.7-0.7,1.7H15.5c-0.8,0-1.5,0.6-1.5,1.4v3c0,0.8,0.7,1.6,1.5,1.6h21.2c0.9,0,1.3,1.1,0.7,1.7l-5.6,5.6
                      c-0.6,0.6-0.6,1.5,0,2.1l2.1,2.1c0.6,0.6,1.5,0.6,2.1,0L49.6,27z"/>
                  </g>
                </svg>
              </button>
              <div></div>
            </div>
          </div>
        </>
      )}
    </div>
    
  )
}