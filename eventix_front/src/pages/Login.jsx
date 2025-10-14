import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/saved'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (pending) return
    setErr('')
    setPending(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch {
      setErr('Invalid email or password')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (err) setErr('') }}
          autoFocus
          autoComplete="email"
          style={{ marginBottom: 10 }}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (err) setErr('') }}
          autoComplete="current-password"
          style={{ marginBottom: 12 }}
          required
        />

        {err && <div className="card" style={{ marginBottom: 12 }}>{err}</div>}

        <button
          className="btn"
          type="submit"
          disabled={pending || !email.trim() || !password}
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div style={{ marginTop: 12, opacity: .8 }}>
        No account? <Link to="/register">Create one</Link>
      </div>
    </div>
  )
}

