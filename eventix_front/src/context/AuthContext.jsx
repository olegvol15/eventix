// src/context/AuthContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi'
import axiosClient from '../api/axiosClients'

const AuthContext = createContext(null)
const LS_TOKEN = 'accessToken'
const LS_USER  = 'auth_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN) || '')
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_USER) || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (token) axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`
    else delete axiosClient.defaults.headers.common.Authorization
  }, [token])

  useEffect(() => {
    let ignore = false
    ;(async () => {
      if (!token) { setUser(null); setLoading(false); return }
      try {
        setLoading(true)
        const me = await authApi.me();
        if (!ignore && me?.authenticated) {
          const u = { email: me.name, roles: me.authorities?.map(String) || [] }
          setUser(u)
          localStorage.setItem(LS_USER, JSON.stringify(u))
        }
      } catch {
        doLogout()
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [token]) 

  const doLogin = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password }) 
    const t = res.token
    localStorage.setItem(LS_TOKEN, t)
    setToken(t)
    setLoading(true)
    return res
  }, [])

  const doRegister = useCallback(async (email, password) => {
    const res = await authApi.register({ email, password }) 
    const t = res.token
    localStorage.setItem(LS_TOKEN, t)
    setToken(t)
    setLoading(true)
    return res
  }, [])

  const doLogout = useCallback(() => {
    localStorage.removeItem(LS_TOKEN)
    localStorage.removeItem(LS_USER)
    setToken('')
    setUser(null)
    delete axiosClient.defaults.headers.common.Authorization
  }, [])

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthed: Boolean(token),
    login: doLogin,
    register: doRegister,
    logout: doLogout,
  }), [user, token, loading, doLogin, doRegister, doLogout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

