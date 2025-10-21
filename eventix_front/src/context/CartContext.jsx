import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartCtx = createContext(null)

const LS_KEY = 'cart_items_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(items)) }, [items])

  function add(item) {
    setItems(prev => {
      const i = prev.findIndex(x => x.reservationId === item.reservationId)
      if (i >= 0) { const cp = [...prev]; cp[i] = item; return cp }
      return [...prev, item]
    })
  }
  function remove(reservationId) { setItems(prev => prev.filter(x => x.reservationId !== reservationId)) }
  function clear() { setItems([]) }

  const value = useMemo(() => ({ items, add, remove, clear }), [items])
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() { return useContext(CartCtx) }
