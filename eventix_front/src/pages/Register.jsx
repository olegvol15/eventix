import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setPending(true); setErr('')
      await register(email.trim(), password)
      nav('/', { replace: true })
    } catch {
      setErr('Registration failed (email may be taken)')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2 style={{ marginTop: 0 }}>Create account</h2>
      <form onSubmit={handleSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ marginBottom: 10 }} />
        <input className="input" type="password" placeholder="Password (min 6)" value={password} onChange={e=>setPassword(e.target.value)} style={{ marginBottom: 12 }} />
        {err && <div className="card" style={{ marginBottom: 12 }}>{err}</div>}
        <button className="btn" disabled={pending}>{pending ? 'Creating…' : 'Register'}</button>
      </form>

      <div style={{ marginTop: 12, opacity:.8 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  )
}
