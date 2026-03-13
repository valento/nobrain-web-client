import { useEffect, useState } from 'react'
import { broker, storage } from '@nx-mono/broker'
import type { User } from '@nx-mono/broker'
import { Link } from 'react-router-dom'

export default function UserComponent({mode=false}: {mode:boolean}) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showUser, setShowUser] = useState(mode)

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
      
      <div className={mode? 'menu icon-mode' : 'menu'}>
        <Link to="/play">
          {mode ?
          <svg version="1.1"
            id="Uploaded to svgrepo.com"
            xmlns="http://www.w3.org/2000/svg"
            width="2.3rem"
            height="2.3rem"
            fill="#333"
            viewBox="0 0 32 32"
          >
          <style type="text/css"></style>
          <path d="M30.838,18.634h0.002l-2.107-9.173C28.081,7.458,26.221,6,24,6c-1.63,0-3.065,0.792-3.977,2h-8.045
            C11.065,6.792,9.63,6,8,6C5.779,6,3.919,7.458,3.267,9.461L1.16,18.633h0.002C1.06,19.073,1,19.529,1,20c0,3.314,2.686,6,6,6
            c2.611,0,4.827-1.671,5.651-4h6.698c0.825,2.329,3.04,4,5.651,4c3.314,0,6-2.686,6-6C31,19.529,30.94,19.073,30.838,18.634z M10,16
            H9v1c0,0.552-0.447,1-1,1s-1-0.448-1-1v-1H6c-0.553,0-1-0.448-1-1s0.447-1,1-1h1v-1c0-0.552,0.447-1,1-1s1,0.448,1,1v1h1
            c0.553,0,1,0.448,1,1S10.553,16,10,16z M23,17c-0.552,0-1-0.448-1-1s0.448-1,1-1s1,0.448,1,1S23.552,17,23,17z M23,14
            c-0.552,0-1-0.448-1-1s0.448-1,1-1s1,0.448,1,1S23.552,14,23,14z M26,17c-0.552,0-1-0.448-1-1s0.448-1,1-1s1,0.448,1,1
            S26.552,17,26,17z M26,14c-0.552,0-1-0.448-1-1s0.448-1,1-1s1,0.448,1,1S26.552,14,26,14z"/>
          </svg>:
         'Play'}
        </Link>
        <Link to={"/read/"}>
          {mode ? 
          <svg fill="#333"
            width="3rem"
            height="3rem"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M1,13 C0.44771525,13 0,12.5522847 0,12 C0,11.4477153 0.44771525,11 1,11 L1.41604369,11 C2.18760031,9.23409522 3.94968096,8 6,8 C7.82440303,8 9.42058775,8.97711876 10.2937745,10.4365766 C10.7845275,10.1580384 11.3764731,10 12,10 C12.6235269,10 13.2154725,10.1580384 13.7062255,10.4365766 C14.5794122,8.97711876 16.175597,8 18,8 C20.050319,8 21.8123997,9.23409522 22.5839563,11 L23,11 C23.5522847,11 24,11.4477153 24,12 C24,12.5522847 23.5522847,13 23,13 C23,15.7614237 20.7614237,18 18,18 C15.2385763,18 13,15.7614237 13,13 C13,12.8312503 13.0083597,12.6644531 13.0246876,12.5 L13,12.5 C13,12.2965729 12.6045695,12 12,12 C11.3954305,12 11,12.2965729 11,12.5 L10.9753124,12.5 C10.9916403,12.6644531 11,12.8312503 11,13 C11,15.7614237 8.76142375,18 6,18 C3.23857625,18 1,15.7614237 1,13 Z M6,16 C7.65685425,16 9,14.6568542 9,13 C9,11.3431458 7.65685425,10 6,10 C4.34314575,10 3,11.3431458 3,13 C3,14.6568542 4.34314575,16 6,16 Z M18,16 C19.6568542,16 21,14.6568542 21,13 C21,11.3431458 19.6568542,10 18,10 C16.3431458,10 15,11.3431458 15,13 C15,14.6568542 16.3431458,16 18,16 Z"/>
          </svg> :
         'Read'}
        </Link>
        <Link to="/repeat">
          {mode ? 
          <svg version="1.1"
            id="svg2"
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 1200 1200"
            enable-background="new 0 0 1200 1200"
          >
          <path id="path18745" inkscape:connector-curvature="0" d="M600,0C268.629,0,0,268.629,0,600s268.629,600,600,600
            c222.411,0,416.39-121.104,520.02-300.879L908.79,777.612C847.217,884.405,732.127,956.47,600,956.47
            c-196.873,0-356.47-159.597-356.47-356.47S403.127,243.53,600,243.53c84.387,0,161.732,29.521,222.729,78.589L665.186,434.18
            L1200,612.524V53.613l-174.17,123.926C917.124,67.952,766.553,0,600,0z"/>
          </svg> :
          'Repeat'}
        </Link>
      </div>
      <div></div>
    </div>
  )
}