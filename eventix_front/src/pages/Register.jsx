import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import validateRegister from '../hooks/validateRegister'


export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()
    if (pending) return
    setFormError('')
    const errs = validateRegister({ email, password })
    setFieldErrors(errs)
    if (Object.keys(errs).length) return

    try {
      setPending(true)
      await register(email.trim(), password)
      nav('/', { replace: true })
    } catch (err) {

      const status = err?.response?.status
      const data = err?.response?.data
      if (status === 422 && Array.isArray(data?.errors)) {
        const fe = {}
        for (const it of data.errors) {
          if (it.field && it.message) fe[it.field] = it.message
        }
        setFieldErrors(fe)
      } else if (status === 409) {
        setFieldErrors({ email: 'Email already in use' })
      } else {
        setFormError('Registration failed. Please try again.')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2 style={{ marginTop: 0 }}>Create account</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 10 }}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>{ setEmail(e.target.value); if (fieldErrors.email) setFieldErrors({...fieldErrors, email: undefined}) }}
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'reg-email-err' : undefined}
          />
          {fieldErrors.email && (
            <div id="reg-email-err" role="alert" style={{ color: '#b00020', fontSize: 13, marginTop: 6 }}>
              {fieldErrors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            className="input"
            type="password"
            placeholder="Password (min 8)"
            value={password}
            onChange={(e)=>{ setPassword(e.target.value); if (fieldErrors.password) setFieldErrors({...fieldErrors, password: undefined}) }}
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'reg-pass-err' : undefined}
          />
          {fieldErrors.password && (
            <div id="reg-pass-err" role="alert" style={{ color: '#b00020', fontSize: 13, marginTop: 6 }}>
              {fieldErrors.password}
            </div>
          )}
        </div>

        {formError && (
          <div className="card" role="alert" style={{ marginBottom: 12 }}>
            {formError}
          </div>
        )}

        <button className="btn" disabled={pending}>
          {pending ? 'Creating…' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: 12, opacity:.8 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  )
}

