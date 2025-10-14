import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Admin panel</h2>
      <ul style={{ marginTop: 12 }}>
        <li><Link to="/admin/events">Manage events</Link></li>
      </ul>
    </div>
  )
}
