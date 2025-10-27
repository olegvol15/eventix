export default function validateRegister({ email, password }) {
  const errors = {}
  const e = email.trim()
  if (!e) errors.email = 'Email is required'
  else if (e.length > 254) errors.email = 'Email must be 254 chars or less'
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) errors.email = 'Invalid email'

  const p = password
  if (!p) errors.password = 'Password is required'
  else if (p.length < 8) errors.password = 'Password must be at least 8 chars'
  return errors
}