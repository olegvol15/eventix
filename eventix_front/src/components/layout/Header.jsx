import { useNavigate, NavLink } from 'react-router-dom'
import { User, Heart, LogOut } from 'lucide-react'
import logo from '../../assets/logo.png'
import '../../styles/header.css'
import { useAuth } from '../../context/AuthContext'
import { useSaved } from '../../context/SavedContext'

export default function Header() {
  const nav = useNavigate()
  const { user, isAuthed, logout } = useAuth()
  const { count } = useSaved()

  return (
    <>
      <header className="site-header center-header">
        <div className="site-header__inner container">
          
          <div className="header-side left">
            {isAuthed && (user?.roles || []).some(r => r.endsWith('ADMIN')) && (
              <NavLink to="/admin" className="icon-btn" title="Admin">
                Admin
              </NavLink>
            )}

            {isAuthed && (
              <span className="header-greeting">
                
                Hello,&nbsp;<strong>{user?.email}</strong>
              </span>
            )}
          </div>

          <div className="header-logo" onClick={() => nav('/')}>
            <img src={logo} alt="Eventix" className="header-logo__img" />
          </div>

          <div className="header-side right">
            <NavLink to="/saved" className="icon-btn" title="Saved">
              <Heart size={22} />
              {count > 0 && <span className="saved-badge">{count}</span>}
            </NavLink>

            {isAuthed ? (
              <>
                <button className="icon-btn" title="Profile">
                  <User size={22} />
                </button>
                <button className="icon-btn" onClick={logout} title="Logout">
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <button className="icon-btn" onClick={() => nav('/login')} title="Login">
                <User size={22} />
              </button>
            )}
          </div>

        </div>
      </header>

      <div className="header-glow" />
    </>
  )
}






