// src/pages/Cart.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadCart, removeFromCart, clearCart } from '../utils/cartStorage'

export default function Cart() {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(loadCart())
  }, [])

  const total = items.reduce((s, i) => s + (Number(i.total) || 0), 0)

  if (!items.length) {
    return (
      <div className="container">
        <h2>Cart</h2>
        <div className="card ed-card ed-msg">Your cart is empty.</div>
        <Link to="/" className="btn-primary" style={{ marginTop: 16 }}>Browse events</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Cart</h2>

      <div className="card ed-card" style={{ display:'flex', gap:12, flexDirection:'column' }}>
        {items.map(i => (
          <div key={i.reservationId} className="spread" style={{ alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{i.eventName}</div>
              <div className="smallprint">
                {new Date(i.eventDate).toLocaleString()} • {i.placeName} • {i.category} × {i.quantity}
              </div>
            </div>
            <div className="spread" style={{ gap:12, alignItems:'center' }}>
              <div style={{ fontWeight:700 }}>${i.total}</div>
              <button className="btn-muted" onClick={() => setItems(removeFromCart(i.reservationId))}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <hr/>
        <div className="spread" style={{ alignItems:'center' }}>
          <div style={{ fontWeight:700 }}>Total</div>
          <div style={{ fontWeight:700 }}>${total}</div>
        </div>
        <div className="spread">
          <button className="btn-muted" onClick={() => { clearCart(); setItems([]) }}>Clear cart</button>
          <button className="btn-primary">Pay now</button>
        </div>
      </div>
    </div>
  )
}

