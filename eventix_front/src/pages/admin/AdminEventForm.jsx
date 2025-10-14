import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminEventsApi, adminPlacesApi } from '../../api/adminApi'
function toLocalInputValue(iso) {
  if (!iso) return ''
  const d = iso.replace('Z', '') 
  return d.slice(0, 16) 
}

function fromLocalInputValue(local) {
  if (!local) return ''
  return local.length === 16 ? `${local}:00` : local
}

const CATEGORIES = ['CONCERT', 'SPORT', 'THEATRE', 'FESTIVAL', 'COMEDY']

export default function AdminEventForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '',
    eventDate: '',
    category: 'CONCERT',
    placeId: '',
    imageUrl: ''
  })
  const [places, setPlaces] = useState([])
  const [err, setErr] = useState('')
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setErr('')

        const placesRes = await adminPlacesApi.list({ page: 0, size: 200, sort: 'name,asc' })
        if (!ignore) setPlaces(placesRes?.content ?? placesRes ?? [])

        if (isEdit) {
          const e = await adminEventsApi.get(id)
          if (!ignore) {
            setForm({
              name: e.name ?? '',
              eventDate: toLocalInputValue(e.eventDate), 
              category: e.category ?? 'CONCERT',
              placeId: e.placeId ?? '',
              imageUrl: e.imageUrl ?? ''
            })
          }
        }
      } catch (e) {
        console.error(e)
        if (!ignore) setErr('Failed to load data')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [id, isEdit])

  async function submit(e) {
    e.preventDefault()
    setPending(true)
    setErr('')
    try {

      if (!form.name.trim()) throw new Error('Name is required')
      if (!form.placeId) throw new Error('Place is required')
      if (!form.eventDate) throw new Error('Date & time is required')

      const payload = {
        name: form.name.trim(),
        eventDate: fromLocalInputValue(form.eventDate), 
        category: form.category,
        placeId: Number(form.placeId),
        imageUrl: form.imageUrl?.trim() || null
      }

      if (isEdit) await adminEventsApi.update(id, payload)
      else await adminEventsApi.create(payload)

      nav('/admin/events', { replace: true })
    } catch (e) {
      console.error(e)
      setErr(e?.message || 'Save failed')
    } finally {
      setPending(false)
    }
  }

  const placeOptions = useMemo(
    () => (places || []).map(p => ({ value: p.id, label: p.name })),
    [places]
  )

  if (loading) return <div className="card">Loading…</div>

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{isEdit ? 'Edit event' : 'Create event'}</h2>

      <form onSubmit={submit} className="col" style={{ gap: 10 }}>
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />

        <input
          className="input"
          type="datetime-local"
          value={form.eventDate}
          onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))}
        />

        <select
          className="select"
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="select"
          value={form.placeId}
          onChange={e => setForm(f => ({ ...f, placeId: e.target.value }))}
        >
          <option value="">Select place…</option>
          {placeOptions.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Image URL"
          value={form.imageUrl || ''}
          onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
        />

        {err && <div className="card" style={{ marginTop: 6 }}>{err}</div>}

        <button className="btn" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}

