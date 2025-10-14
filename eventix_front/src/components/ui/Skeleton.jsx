export default function Skeleton() {
  return (
    <div className="event-page">
      <div className="banner skeleton" />
      <div className="container layout">
        <main className="content">
          <div className="card skeleton-box" />
          <div className="card skeleton-box" />
        </main>
        <aside className="aside">
          <div className="card skeleton-box" style={{ height: 220 }} />
        </aside>
      </div>
    </div>
  )
}