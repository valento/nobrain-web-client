import { useState } from 'react'
import { broker } from '@nx-mono/broker'

export function LoginWidget() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const mockUser = { id: '1', email, name: email.split('@')[0] }
      const mockToken = 'mock-jwt-token'
      broker.emit('auth:login-success', { token: mockToken, user: mockUser })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      broker.emit('auth:error', { message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <label>
        Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>

    
  )
}

export default LoginWidget