import { useEffect, useState } from 'react'
import { broker, storage } from '@nx-mono/broker'
import type { User } from '@nx-mono/broker'

export function LoginWidget() {

  const API_URL = import.meta.env.VITE_API_NET || 'http://localhost:8000'

  const [email, setEmail] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect( () => {
    if (!email.includes('@')) return

    const timer = setTimeout( async () => {
      const result =  await fetch(`${API_URL}/auth/check-email/${email}`)
      const data = await result.json()
      setMode(data.available? 'register' : 'login')

      return () => clearTimeout(timer)
    }, 500)
  }, [email])

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const URL = mode === 'login'? `${API_URL}/auth/login` : `${API_URL}/auth/register`

    try {
        const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (response.ok) {
        const data = await response.json()
        const { access_token, user }: {access_token: string, user: User} = data
        storage.setToken(access_token)
        storage.setUser(user)
        broker.emit('auth:login-success', { token: access_token, user: user })
        // Redirect to dashboard or fetch user info
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      broker.emit('auth:error', { message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <p>{mode === 'login' ? 'Welcome back! (◕‿◕)' : 'Check in... (◕ω◕)'}</p>
      <form className='login-form' onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div className='login-form-space mail'>
          <label>email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className='login-form-space password'>
          <label>password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Log...' : 'Log in'}
        </button>
      </form>
    </>

    
  )
}

export default LoginWidget