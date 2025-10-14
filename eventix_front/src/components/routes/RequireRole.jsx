// src/components/routes/RequireRole.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RequireRole({ role = 'ADMIN', children }) {
  const { isAuthed, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="card" style={{ textAlign: 'center', marginTop: 80 }}>
      Checking access…
    </div>
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const roles = user?.roles || []
  const hasRole = roles.includes(role) || roles.includes(`ROLE_${role}`)
  if (!hasRole) {
    return <Navigate to="/" replace />
  }

  return children ?? <Outlet />
}

