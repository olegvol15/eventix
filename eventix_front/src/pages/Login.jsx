import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import validateLogin from '../hooks/validateLogin'

const errStyle = { color: '#d32f2f', fontSize: 13, marginTop: 6 }

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/saved'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function clearFieldError(name) {
    if (fieldErrors[name]) {
      const next = { ...fieldErrors }
      delete next[name]
      setFieldErrors(next)
    }
  }

  function parseServerError(err) {
    const status = err?.response?.status
    const data = err?.response?.data

    // Problem Details с errors[] (422 или 400)
    if ((status === 422 || status === 400) && Array.isArray(data?.errors)) {
      const fe = {}
      for (const it of data.errors) {
        if (it.field && it.message) fe[it.field] = it.message
      }
      return { fieldErrors: fe }
    }

    if (status === 401) {
      return { formError: 'Invalid email or password' }
    }

    if (data?.detail || data?.message) {
      return { formError: data.detail || data.message }
    }

    return { formError: 'Sign-in failed. Please try again.' }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (pending) return
    setFormError('')

    const local = validateLogin({ email, password })
    setFieldErrors(local)
    if (Object.keys(local).length) return

    try {
      setPending(true)
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      const parsed = parseServerError(err)
      if (parsed.fieldErrors) setFieldErrors(parsed.fieldErrors)
      if (parsed.formError) setFormError(parsed.formError)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 10 }}>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }}
            autoFocus
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'login-email-err' : undefined}
            required
          />
          {fieldErrors.email && (
            <div id="login-email-err" role="alert" style={errStyle}>
              {fieldErrors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearFieldError('password') }}
            autoComplete="current-password"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'login-pass-err' : undefined}
            required
          />
          {fieldErrors.password && (
            <div id="login-pass-err" role="alert" style={errStyle}>
              {fieldErrors.password}
            </div>
          )}
        </div>

        {formError && (
          <div className="card" role="alert" style={{ marginBottom: 12, borderColor: '#d32f2f' }}>
            <span style={{ color: '#d32f2f' }}>{formError}</span>
          </div>
        )}

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



