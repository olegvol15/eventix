import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { favoritesApi } from '../api/favoritesApi'

const SavedContext = createContext(null)

export function SavedProvider({ children }) {
  const { isAuthed, user, token } = useAuth()
  const [saved, setSaved] = useState([])    
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    ;(async () => {
      if (!isAuthed || !user?.email) { setSaved([]); return }
      try {
        setLoading(true); setError('')
        const list = await favoritesApi.list()
        if (!ignore) setSaved(Array.isArray(list) ? list : [])
      } catch {
        if (!ignore) { setError('Failed to load saved'); setSaved([]) }
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [isAuthed, user?.email, token])

  const add = useCallback(async (evOrId) => {
    if (!isAuthed || !user?.email) return
    const eventId = typeof evOrId === 'object' ? evOrId.id : evOrId
    try {
      await favoritesApi.add(eventId)
      if (typeof evOrId === 'object' && !saved.some(e => e.eventId === eventId)) {
        const e = evOrId
        setSaved(prev => [{ 
            eventId: e.id, name: e.name, eventDate: e.eventDate, 
            category: e.category, placeName: e.placeName, imageUrl: e.imageUrl 
          }, ...prev])
      } else {
      }
    } catch {}
  }, [isAuthed, user?.email, saved])

  const remove = useCallback(async (eventId) => {
    if (!isAuthed || !user?.email) return
    try {
      await favoritesApi.remove(eventId)
      setSaved(prev => prev.filter(e => (e.eventId ?? e.id) !== eventId))
    } catch {}
  }, [isAuthed, user?.email])

  const clear = useCallback(async () => {
    if (!isAuthed || !user?.email) return
    await Promise.all(saved.map(e => favoritesApi.remove(e.eventId ?? e.id)))
    setSaved([])
  }, [isAuthed, user?.email, saved])

  const value = useMemo(() => ({
    saved,
    loading,
    error,
    add,
    remove,
    clear,
    isEmpty: saved.length === 0,
  }), [saved, loading, error, add, remove, clear])

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
}

export function useSaved() {
  const ctx = useContext(SavedContext)
  if (!ctx) throw new Error('useSaved must be used within <SavedProvider>')
  return ctx
}

