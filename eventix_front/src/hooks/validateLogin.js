export default function validateLogin({ email, password }) {
  const errors = {}
  const e = email.trim()
  if (!e) errors.email = 'Email is required'
  else if (e.length > 254) errors.email = 'Email must be 254 chars or less'
  const p = password
  if (!p) errors.password = 'Password is required'
  else if (p.length > 64) errors.password = 'Password must be <= 64 chars'
  return errors
}