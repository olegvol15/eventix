import { useSaved } from '../context/SavedContext'
import { useNavigate } from 'react-router-dom'
import '../styles/saved.css'

const CATEGORY_IMG = {
  CONCERT:  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
  SPORT:    'https://images.unsplash.com/photo-1517649763962-0c623066013b',
  THEATRE:  'https://img.freepik.com/premium-vector/happy-sad-theater-masks-theatrical-scene-with-red-curtains-illustration_302982-43.jpg',
  COMEDY:   'https://images.unsplash.com/photo-1515165562835-c3b8c8e0c9a0',
  FESTIVAL: 'https://www.visit.alsace/wp-content/uploads/2018/11/festival-decibulles-2017-laurent-khram-longvixay-1-1600x900.jpg',
}
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980'

export default function Saved() {
  const { saved, remove, clear } = useSaved()
  const nav = useNavigate()

  if (saved.length === 0) {
    return (
      <div className="saved-empty">
        <h2>No saved events yet</h2>
        <p>Click “Save for later” on any event to add it here.</p>
      </div>
    )
  }

  return (
    <div className="saved-container">
      <div className="saved-header">
        <h2>Saved events</h2>
        <button className="btn" onClick={clear}>Clear all</button>
      </div>

      <div className="saved-grid">
        {saved.map((e) => {
          const id = e.eventId ?? e.id
          return (
            <div key={id} className="saved-card" onClick={() => nav(`/event/${id}`)}>
              <img
                src={e.imageUrl || 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1200&q=80&auto=format&fit=crop'}
                alt={e.name}
                onError={(ev) => { ev.currentTarget.src = 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1200&q=80&auto=format&fit=crop' }}
              />
              <div className="saved-card-content">
                <h3>{e.name}</h3>
                <p>{e.placeName || 'Unknown location'}</p>
                <button className="btn" onClick={(evn) => { evn.stopPropagation(); remove(id) }}>
                  Remove
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

