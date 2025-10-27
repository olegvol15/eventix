import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadCart, removeFromCart, clearCart } from '../utils/cartStorage'
import { confirmTickets } from '../api/ticketsApi'

export default function Cart() {
  const nav = useNavigate()

  const [items, setItems] = useState([])
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    setItems(loadCart())
  }, [])

  const grandTotal = useMemo(
    () => items.reduce((s, it) => s + Number(it.total || 0), 0),
    [items]
  )

  async function handlePayNow() {
    if (!items.length) return
    setPaying(true)
    try {
      // подтверждаем каждую резервацию
      for (const it of items) {
        await confirmTickets({
          reservationId: it.reservationId,
          paymentToken: 'demo-ok',
        })
      }
      const orderId = crypto.randomUUID()
      localStorage.setItem(
        'last_order_v1',
        JSON.stringify({ orderId, itemsCount: items.length, total: grandTotal })
      )
      clearCart()
      setItems([])
      nav(`/checkout/success?orderId=${orderId}`)
    } catch (e) {
      console.error(e)
      alert('Payment failed. Try again.')
    } finally {
      setPaying(false)
    }
  }

  function handleRemove(id) {
    removeFromCart(id)
    setItems(loadCart())
  }

  function handleClear() {
    clearCart()
    setItems([])
  }

  if (!items.length) {
    return (
      <div className="container">
        <h2>Cart</h2>
        <div className="card ed-card ed-msg">Your cart is empty.</div>
        <Link to="/" className="btn-primary" style={{ marginTop: 16 }}>
          Browse events
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Cart</h2>

      <div className="card ed-card" style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        {items.map((i) => (
          <div key={i.reservationId} className="spread" style={{ alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{i.eventName}</div>
              <div className="smallprint">
                {new Date(i.eventDate).toLocaleString()} • {i.placeName} • {i.category} × {i.quantity}
              </div>
            </div>
            <div className="spread" style={{ gap: 12, alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>${Number(i.total || 0).toFixed(2)}</div>
              <button className="btn-muted" onClick={() => handleRemove(i.reservationId)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        <hr />

        <div className="spread" style={{ alignItems: 'center' }}>
          <div style={{ fontWeight: 700 }}>Total</div>
          <div style={{ fontWeight: 700 }}>${grandTotal.toFixed(2)}</div>
        </div>

        <div className="spread">
          <button className="btn-muted" onClick={handleClear}>
            Clear cart
          </button>
          <button className="btn-primary" disabled={paying} onClick={handlePayNow}>
            {paying ? 'Processing…' : 'Pay now'}
          </button>
        </div>
      </div>
    </div>
  )
}


