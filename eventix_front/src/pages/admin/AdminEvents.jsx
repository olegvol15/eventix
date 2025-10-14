// src/pages/admin/AdminEvents.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminEventsApi } from '../../api/adminApi'

function normalizePage(res) {
  const data = res?.data ?? res

  if (data && Array.isArray(data.content)) return data

  if (Array.isArray(data)) {
    return {
      content: data,
      totalPages: 1,
      totalElements: data.length,
      number: 0,
      size: data.length,
    }
  }
  return { content: [], totalPages: 1, totalElements: 0, number: 0, size: 0 }
}

export default function AdminEvents() {
  const [page, setPage] = useState(0)
  const [pg, setPg] = useState(null)  
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        setLoading(true); setErr('')
        const res = await adminEventsApi.list({ page, size: 10, sort: 'eventDate,asc' })
        if (!ignore) setPg(normalizePage(res))
      } catch (e) {
        console.error(e)
        if (!ignore) setErr('Failed to load events')
        if (!ignore) setPg(normalizePage([]))
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [page])

  if (loading) return <div className="card">Loading…</div>
  if (err) return <div className="card">{err}</div>

  const rows = pg?.content ?? []
  const totalPages = pg?.totalPages ?? 1

  return (
    <div className="card">
      <div className="spread" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Events</h2>
        <Link className="btn" to="/admin/events/new">Create</Link>
      </div>

      <table className="table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Date</th><th>Place</th><th>Category</th><th/></tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={6}>No events</td></tr>
          ) : rows.map(ev => (
            <tr key={ev.id}>
              <td>{ev.id}</td>
              <td>{ev.name}</td>
              <td>{ev.eventDate ? new Date(ev.eventDate).toLocaleString() : '-'}</td>
              <td>{ev.placeName ?? ev.place?.name ?? '-'}</td>
              <td>{ev.category}</td>
              <td className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
                <Link className="btn" to={`/admin/events/${ev.id}/edit`}>Edit</Link>
                <button
                  className="btn"
                  onClick={async () => {
                    if (!confirm('Delete?')) return
                    await adminEventsApi.remove(ev.id)
                    const res = await adminEventsApi.list({ page, size: 10, sort: 'eventDate,asc' })
                    setPg(normalizePage(res))
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="spread" style={{ marginTop: 12 }}>
        <button className="btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
        <div>Page {page + 1} / {totalPages}</div>
        <button className="btn" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  )
}


