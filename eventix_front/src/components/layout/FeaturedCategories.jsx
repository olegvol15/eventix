// src/components/home/FeaturedCategories.jsx
import { useNavigate } from 'react-router-dom'
import CategoryCard from '../ui/CategoryCard'
import { CATEGORIES } from '../../constants/categories'
import '../../styles/featured-categories.css'


export default function FeaturedCategories() {
  const nav = useNavigate()
  return (
    <section className="container" style={{ padding: '8px 0 24px' }}>
      <div className="spread" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Featured categories</h2>
        <a className="btn" href="#upcoming">Browse all</a>
      </div>

      <div className="fc-grid">
        {CATEGORIES.map(c => (
          <CategoryCard
            key={c.key}
            title={c.title}
            imageUrl={c.imageUrl}
            onClick={() => nav(`/?category=${encodeURIComponent(c.key)}#upcoming`)}
          />
        ))}
      </div>
    </section>
  )
}

