import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function CheckoutSuccess() {
  const [params] = useSearchParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const o = localStorage.getItem('last_order_v1')
    if (o) setOrder(JSON.parse(o))
  }, [])

  return (
    <div className="container">
      <h1>Payment successful 🎉</h1>
      <p>Order ID: <strong>{params.get('orderId')}</strong></p>
      {order && (
        <p>
          Items: <strong>{order.itemsCount}</strong> — Total:{' '}
          <strong>${Number(order.total || 0).toFixed(2)}</strong>
        </p>
      )}
      <Link to="/" className="btn-primary">Back to events</Link>
    </div>
  )
}
