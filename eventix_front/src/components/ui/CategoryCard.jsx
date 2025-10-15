import '../../styles/category-card.css'

export default function CategoryCard({ title, imageUrl, onClick }) {
  return (
    <div className="cards_categories" onClick={onClick}>
      <figure className="card_category" style={{ backgroundImage: `url(${imageUrl})` }}>
          <figcaption className="card_title_category">{title}</figcaption>
      </figure>
    </div>
  )
}