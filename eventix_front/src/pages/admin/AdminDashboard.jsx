import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Admin panel</h2>
      <ul style={{ marginTop: 12, listStyle: 'none', padding: 0 , display: 'flex', gap: 12}}>
        <li className='btn-primary'><Link to="/admin/events">Manage events</Link></li>
        <li className='btn-primary'><Link to="/admin/reviews">Manage reviews</Link></li>
      </ul>
    </div>
  )
}
