export default function Stars({ value, interactive = false, onChange = null, size = 'default' }) {
  const full = Math.round(value)
  
  const handleClick = (rating) => {
    if (interactive && onChange) {
      onChange(rating)
    }
  }

  const starClass = `stars ${interactive ? 'stars--interactive' : ''} ${size === 'large' ? 'stars--large' : ''}`

  return (
    <span 
      className={starClass}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`star ${interactive ? `star--interactive ${i > value ? 'star--inactive' : ''}` : ''}`}
          onClick={() => handleClick(i)}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={(e) => {
            if (interactive && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              handleClick(i)
            }
          }}
        >
          {i <= full ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}