import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import axiosClient from '../api/axiosClients'
import Modal from '../components/ui/Modal'
import { reserveTickets, getAvailability } from '../api/ticketsApi'
import { useSaved } from '../context/SavedContext'
import { useAuth } from '../context/AuthContext'
import '../styles/eventDetails.css'
import Reviews from '../components/layout/Reviews'
import { addToCart } from '../utils/cartStorage'

export default function EventDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const { isAuthed } = useAuth()
  const { saved, add, remove } = useSaved()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('STANDARD')
  const [qty, setQty] = useState(1)
  const [email, setEmail] = useState('')
  const [availability, setAvailability] = useState([])

  const [reserveState, setReserveState] = useState({ pending: false, result: null, err: '' })

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const ev = await axiosClient.get(`/events/${id}`)
        if (ignore) return
        setEvent(ev)
        try {
          const av = await getAvailability(id)
          if (ignore) return
          setAvailability(Array.isArray(av) ? av : [])
          const firstAvailable = (av || []).find(a => a.free > 0)?.category
          if (firstAvailable) setCategory(firstAvailable)
        } catch {
          if (!ignore) setAvailability([])
        }
      } catch {
        if (!ignore) setError('Failed to load event')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [id])

  const isSaved = useMemo(
    () => (event ? saved.some(e => (e.eventId ?? e.id) === event.id) : false),
    [saved, event]
  )

  const priceFrom = useMemo(() => {
    if (event?.priceFrom != null) return event.priceFrom
    if (!event) return null
    return event.category === 'FESTIVAL' ? 99 : 49
  }, [event])

  const selectedAvailability = useMemo(
    () => availability.find(a => a.category === category) || null,
    [availability, category]
  )
  const selectedFree = selectedAvailability?.free ?? null
  const notEnough = selectedFree != null && qty > selectedFree
  const categoryDisabled = selectedFree === 0

  async function handleReserve() {
    if (categoryDisabled) {
      setReserveState({ pending: false, result: null, err: 'No tickets in this category' })
      return
    }
    if (notEnough) {
      setReserveState({ pending: false, result: null, err: 'Selected quantity exceeds availability' })
      return
    }
    try {
      setReserveState({ pending: true, result: null, err: '' })
      const res = await reserveTickets({
        eventId: Number(id),
        category,
        quantity: qty,
        customerEmail: email
      })
      setReserveState({ pending: false, result: res, err: '' })
    } catch {
      setReserveState({ pending: false, result: null, err: 'Reservation failed' })
    }
  }

  function addToCartAndGo() {
    if (!reserveState.result || !event) return
    addToCart({
      reservationId: reserveState.result.reservationId,
      eventId: Number(id),
      eventName: event.name,
      placeName: event.placeName,
      eventDate: event.eventDate,
      imageUrl: event.imageUrl || '',
      category,
      quantity: qty,
      total: reserveState.result.total ?? 0,
      expiresAt: reserveState.result.expiresAt,
      addedAt: new Date().toISOString(),
    })
    setOpen(false)
    nav('/cart')
  }

  function toggleSaved() {
    if (!event) return
    if (!isAuthed) { nav('/login'); return }
    if (isSaved) remove(event.id)
    else add(event)
  }

  if (loading) {
    return (
      <div className="event-details">
        <div className="ed-banner"><div className="skeleton-box" /></div>
        <div className="container ed-layout">
          <div className="ed-main">
            <div className="card ed-card skeleton" style={{ height: 160 }} />
            <div className="card ed-card skeleton" style={{ height: 220 }} />
          </div>
          <aside className="ed-aside">
            <div className="ed-sticky skeleton" style={{ height: 180 }} />
          </aside>
        </div>
      </div>
    )
  }

  if (error) return <div className="card ed-card ed-msg">{error}</div>
  if (!event) return null

  const bannerSrc =
    event.imageUrl ||
    'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1600&q=80&auto=format&fit=crop'

  return (
    <div className="event-details">
      <div className="ed-banner">
        <img
          src={bannerSrc}
          alt={event.name}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1600&q=80&auto=format&fit=crop'
          }}
        />
        <div className="ed-banner__overlay" />
        <div className="ed-banner__top container">
          <button type="button" className="btn-ghost" onClick={() => nav(-1)}>Back</button>
        </div>
        <div className="ed-banner__content container">
          <h1 className="ed-title">{event.name}</h1>
          <div className="ed-meta">
            <span>{new Date(event.eventDate).toLocaleString()}</span>
            <span className="dot">•</span>
            <span>{event.placeName}</span>
            <span className="dot">•</span>
            <span className="badge">{event.category}</span>
          </div>
        </div>
      </div>

      <div className="container ed-layout">
        <main className="ed-main">
          <div className="card ed-card">
            <h3>About</h3>
            <p>
              Enjoy an unforgettable experience. Doors open 60 minutes before the show.
              Mobile e-tickets, official partner, 24/7 support.
            </p>
            <h4>Venue</h4>
            <p>{event.placeName}</p>
            <h4>Date & time</h4>
            <p>{new Date(event.eventDate).toLocaleString()}</p>
            <h4>Info</h4>
            <ul className="ed-list">
              <li>Mobile e-tickets</li>
              <li>Official partner</li>
              <li>24/7 support</li>
            </ul>
          </div>

          <div className="ed-grid">
            <div className="card ed-card">
              <h3>Getting there</h3>
              <p>Public transport and parking info will be provided with your tickets.</p>
            </div>
            <div className="card ed-card">
              <h3>Refunds & support</h3>
              <p>Refund policy depends on the organizer. You can contact support any time.</p>
            </div>
          </div>

          <Reviews eventId={Number(id)} />
        </main>

        <aside className="ed-aside">
          <div className="ed-sticky">
            <div className="ed-price-row">
              <div>
                <div className="label">From</div>
                <div className="price">{priceFrom != null ? `$${priceFrom}` : '—'}</div>
              </div>
              <div className="secure">Secure checkout</div>
            </div>

            <button type="button" className="btn-primary big" onClick={() => setOpen(true)}>
              Buy ticket
            </button>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="button" className="btn-ghost" onClick={toggleSaved}>
                <Heart size={16} style={{ marginRight: 6 }} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved' : 'Save for later'}
              </button>
              <button type="button" className="btn-muted" onClick={() => nav('/')}>More events</button>
            </div>

            <div className="smallprint">
              By continuing you agree to the Terms and Refund policy.
            </div>
          </div>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Buy tickets">
        <div className="md-content">
          <div className="ed-modal-head">
            <h3 style={{ margin: 0 }}>Buy tickets</h3>
            <span className="kbd">ESC</span>
          </div>

          <div className="ed-controls">
            <select
              className="md-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setQty(1)
                setReserveState({ pending: false, result: null, err: '' })
              }}
            >
              {availability.length
                ? availability.map(a => (
                    <option key={a.category} value={a.category} disabled={a.free === 0}>
                      {a.category} — {a.free ?? 0} / {a.total ?? 0}
                    </option>
                  ))
                : (
                  <>
                    <option value="STANDARD">STANDARD</option>
                    <option value="VIP">VIP</option>
                  </>
                )
              }
            </select>

            <div className="qty">
              <button
                type="button"
                className="md-icon"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                aria-label="Decrease"
              >
                −
              </button>
              <span className="qty-box">{qty}</span>
              <button
                type="button"
                className="md-icon"
                onClick={() => setQty(q => Math.min(99, q + 1))}
                aria-label="Increase"
              >
                +
              </button>
            </div>
          </div>

          {selectedAvailability && (
            <div className="smallprint" style={{ marginTop: 8 }}>
              Available in {selectedAvailability.category}: {selectedAvailability.free ?? 0} / {selectedAvailability.total ?? 0}
            </div>
          )}

          <input
            className="md-input"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {categoryDisabled && <div className="card ed-msg">No tickets in this category</div>}
          {notEnough && !categoryDisabled && <div className="card ed-msg">Selected quantity exceeds availability</div>}
          {reserveState.err && <div className="card ed-msg">{reserveState.err}</div>}

          {reserveState.result && (
            <div className="card ed-summary">
              <div className="ed-summary-row">
                <div>Total:</div>
                <strong>{reserveState.result.total}$</strong>
              </div>
              <div className="ed-summary-row">
                <div>Expires:</div>
                <strong>{new Date(reserveState.result.expiresAt).toLocaleTimeString()}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="md-footer">
          {!reserveState.result ? (
            <div className="ed-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={handleReserve}
                disabled={reserveState.pending || !email || categoryDisabled || notEnough}
              >
                {reserveState.pending ? 'Processing…' : 'Reserve'}
              </button>
              <button type="button" className="btn-muted" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          ) : (
            <div className="ed-actions">
              <button type="button" className="btn-primary" onClick={addToCartAndGo}>
                Go to cart
              </button>
              <button type="button" className="btn-muted" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}








