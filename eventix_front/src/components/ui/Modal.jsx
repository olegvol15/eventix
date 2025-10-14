import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../../styles/modal.css'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="md-backdrop" onMouseDown={onClose}>
      <div className="md-panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="md-header">
          <h3 className="md-title">{title}</h3>
          <button className="md-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  )
}


