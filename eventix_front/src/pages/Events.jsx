import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../api/axiosClients'
import EventCard from '../components/ui/EventCard'
import useDebounce from '../hooks/useDebounce'

export default function Events() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  const size = 6
  const sort = 'eventDate,asc'
  const debouncedQ = useDebounce(q, 300)

  useEffect(() => {
    let ignore = false

    ;(async () => {
      try {
        if (!data) setLoading(true)
        else setFetching(true)

        const params = { page, size, sort }
        if (debouncedQ) params.name = debouncedQ
        if (category) params.category = category

        const res = await axiosClient.get('/events', { params })
        if (!ignore) setData(res)
      } catch {
        if (!ignore) setError('Failed to load events')
      } finally {
        if (!ignore) {
          setLoading(false)
          setFetching(false)
        }
      }
    })()

    return () => { ignore = true }
  }, [page, debouncedQ, category])

  if (loading && !data) return <div className="card">Loading…</div>
  if (error) return <div className="card">{error}</div>

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: 16 }}>Upcoming Events</h2>

      <div className="row" style={{ marginBottom: 20, alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            className="input"
            placeholder="Search by name"
            value={q}
            onChange={(e) => {
              setPage(0)
              setQ(e.target.value)
            }}
          />
          {fetching && (
            <span
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 12,
                opacity: 0.7,
              }}
            >
              loading…
            </span>
          )}
        </div>

        <select
          className="select"
          value={category}
          onChange={(e) => {
            setPage(0)
            setCategory(e.target.value)
          }}
          style={{ maxWidth: 220 }}
        >
          <option value="">All categories</option>
          <option value="CONCERT">Concert</option>
          <option value="SPORT">Sport</option>
          <option value="THEATRE">Theatre</option>
          <option value="FESTIVAL">Festival</option>
          <option value="COMEDY">Comedy</option>
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {data.content.map((ev) => (
          <Link key={ev.id} to={`/event/${ev.id}`} style={{ textDecoration: 'none' }}>
            <EventCard event={ev} />
          </Link>
        ))}
      </div>

      <div className="spread" style={{ marginTop: 24 }}>
        <button className="btn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <div>
          Page {page + 1} / {data.totalPages}
        </div>
        <button
          className="btn"
          disabled={page + 1 >= data.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}




