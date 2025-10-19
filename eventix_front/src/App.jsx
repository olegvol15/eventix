// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Hero from './components/ui/Hero.jsx'
import Events from './pages/Events.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Saved from './pages/Saved.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import RequireAuth from './components/routes/RequireAuth.jsx'
import RequireRole from './components/routes/RequireRole.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminEvents from './pages/admin/AdminEvents.jsx'
import AdminEventForm from './pages/admin/AdminEventForm.jsx'
import AdminReviews from './pages/admin/AdminReviews.jsx'
import HowItWorks from './components/layout/HowItWorks.jsx'
import FeaturedCategories from './components/layout/FeaturedCategories.jsx'
import Cart from './pages/ Cart.jsx'

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <HowItWorks />
                <FeaturedCategories />
                <section id="upcoming" className="container" style={{ paddingTop: 32, paddingBottom: 24 }}>
                  <Events />
                </section>
              </>
            }
          />

          <Route
            path="/event/:id"
            element={
              <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
                <EventDetails />
              </div>
            }
          />

          <Route
            path="/login"
            element={
              <div className="container" style={{ paddingTop: 24 }}>
                <Login />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="container" style={{ paddingTop: 24 }}>
                <Register />
              </div>
            }
          />

          <Route
            path="/saved"
            element={
              <RequireAuth>
                <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
                  <Saved />
                </div>
              </RequireAuth>
            }
          />

          <Route 
            path="/cart"
            element={
              <RequireAuth>
                <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
                  <Cart />
                </div>
              </RequireAuth>
            }>

          </Route>

         
            <Route element={<RequireRole role="ADMIN" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/events/new" element={<AdminEventForm />} />
              <Route path="/admin/events/:id/edit" element={<AdminEventForm />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
            </Route>
        </Routes>
      </main>
    </>
  )
}



