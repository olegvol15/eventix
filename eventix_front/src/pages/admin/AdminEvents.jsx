// src/pages/admin/AdminEvents.jsx
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { adminEventsApi } from '../../api/adminApi'
import { adminTicketsApi } from '../../api/adminApi'
import normalizePage from '../../hooks/normalizePage'
import '../../styles/adminEvents.css'

export default function AdminEvents() {
  const [page, setPage] = useState(0)
  const [events, setEvents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  const [genFor, setGenFor] = useState(null);
  const [genCount, setGenCount] = useState(50);
  const [genCategory, setGenCategory] = useState('STANDARD');
  const [genPending, setGenPending] = useState(false);
  const [genErr, setGenErr] = useState('');


  const loadEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await adminEventsApi.list({ 
        page, 
        size: 10, 
        sort: 'eventDate,asc' 
      })
      setEvents(normalizePage(res))
    } catch (e) {
      console.error('Failed to load events:', e)
      setError('Failed to load events. Please try again.')
      setEvents(normalizePage([]))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  async function handleGenerate() {
    if(!genFor) return 

    try{
      setGenPending(true)
      setGenErr('')
      await adminTicketsApi.generate(genFor.id, {count: Number(genCount), category: genCategory})
    } catch(e) {
      console.error(e)
      setGenErr('Failed to generate tickets')
    } finally {
      setGenPending(false)
    }
  }

  const handleDelete = async (eventId, eventName) => {
    if (!window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      return
    }

    setDeleting(eventId)
    try {
      await adminEventsApi.remove(eventId)
      await loadEvents()
    } catch (e) {
      console.error('Failed to delete event:', e)
      setError('Failed to delete event. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="admin-events">
        <div className="card admin-events-loading">Loading events...</div>
      </div>
    )
  }

  if (error && !events) {
    return (
      <div className="admin-events">
        <div className="card admin-events-error">{error}</div>
      </div>
    )
  }

  const rows = events?.content ?? []
  const totalPages = events?.totalPages ?? 1

  return (
    <div className="admin-events">
      <div className="card">
        <div className="admin-events-header">
          <h2 className="admin-events-title">Events</h2>
          <Link className="admin-events-create-btn" to="/admin/events/new">
            + Create Event
          </Link>
        </div>

        {error && (
          <div className="admin-events-error" role="alert" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <table className="admin-events-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Place</th>
              <th>Category</th>
              <th>Tickets (free / total)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-events-table-empty">
                  No events found. Create your first event!
                </td>
              </tr>
            ) : (
              rows.map(ev => (
                <tr key={ev.id}>
                  <td data-label="ID">{ev.id}</td>
                  <td data-label="Name" className="admin-events-table-name">
                    {ev.name}
                  </td>
                  <td data-label="Date" className="admin-events-table-date">
                    {ev.eventDate ? new Date(ev.eventDate).toLocaleString() : '-'}
                  </td>
                  <td data-label="Place">
                    {ev.placeName ?? ev.place?.name ?? '-'}
                  </td>
                  <td data-label="Category">
                    <span className="admin-events-table-category">
                      {ev.category}
                    </span>
                  </td>
                  <td data-label="Amount">
                    <span className="admin-events-table-amount">
                      {ev.ticketsFree != null ? `${ev.ticketsFree} / ${ev.ticketsTotal}` : ev.ticketsCount}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="admin-events-actions">
                      <button className='admin-events-generate-btn' onClick={() => {setGenFor(ev); setGenCount(50); setGenCategory('STANDARD')}}>
                        Generate
                      </button>
                      <Link 
                        className="admin-events-edit-btn" 
                        to={`/admin/events/${ev.id}/edit`}
                      >
                        Edit
                      </Link>
                      <button
                        className="admin-events-delete-btn"
                        onClick={() => handleDelete(ev.id, ev.name)}
                        disabled={deleting === ev.id}
                      >
                        {deleting === ev.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="admin-events-pagination">
            <button 
              className="admin-events-pagination-btn" 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              aria-label="Previous page"
            >
              ← Previous
            </button>
            <div className="admin-events-pagination-info">
              Page {page + 1} of {totalPages}
            </div>
            <button 
              className="admin-events-pagination-btn" 
              disabled={page + 1 >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}

        {genFor && (
        <div className="modal-backdrop" onClick={() => !genPending && setGenFor(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Generate tickets</h3>
            <div style={{ marginBottom: 10, opacity: 0.8 }}>
              Event: <strong>{genFor.name}</strong>
            </div>

            <div className="col" style={{ gap: 8 }}>
              <label className="row" style={{ gap: 8, alignItems: 'center' }}>
                <span style={{ width: 100 }}>Count</span>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={genCount}
                  onChange={(e) => setGenCount(e.target.value)}
                  style={{ flex: 1 }}
                />
              </label>

              <label className="row" style={{ gap: 8, alignItems: 'center' }}>
                <span style={{ width: 100 }}>Category</span>
                <select
                  className="select"
                  value={genCategory}
                  onChange={(e) => setGenCategory(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="STANDARD">STANDARD</option>
                  <option value="VIP">VIP</option>
                  <option value="ECONOMY">ECONOMY</option>
                </select>
              </label>
            </div>

            {genErr && <div className="card" style={{ marginTop: 8 }}>{genErr}</div>}

            <div className="spread" style={{ marginTop: 14 }}>
              <button className="btn" onClick={() => setGenFor(null)} disabled={genPending}>Cancel</button>
              <button className="btn" onClick={handleGenerate} disabled={genPending || genCount < 1}>
                {genPending ? 'Generating…' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

