import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="card" style={{ textAlign: 'center', marginTop: 80 }}>
      Checking session…
    </div>
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

