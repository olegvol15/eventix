const DEFAULT_IMG = 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980'

export default function EventCard({ event }) {
  if (!event) return null

  const {
    name,
    eventDate,
    placeName,
    category,
    imageUrl,
  } = event

  const bg = imageUrl || DEFAULT_IMG

  return (
    <div className="card" style={{ padding: 18 }}>
      <div
        style={{
          aspectRatio: '16 / 9',
          width: '100%',
          borderRadius: 10,
          background: `center/cover no-repeat url("${bg}")`,
          marginBottom: 12,
        }}
      />
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
        {name}
      </div>
      <div style={{ opacity: 0.8, marginBottom: 4 }}>
        {eventDate ? new Date(eventDate).toLocaleString() : '—'}
      </div>
      <div style={{ opacity: 0.6 }}>
        {placeName || '—'} • {category || '—'}
      </div>
    </div>
  )
}

