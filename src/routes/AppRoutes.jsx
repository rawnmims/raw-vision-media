import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ProtectedRoute } from '../components/common/ThemeToggle'

// Public pages
import Home from '../pages/Home'
import Events from '../pages/Events'
import EventDetails from '../pages/EventDetails'
import Archive from '../pages/Archive'
import Scrapbook from '../pages/Scrapbook'
import Videos from '../pages/Videos'
import About from '../pages/About'

// Auth pages
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'

// Admin pages
import Dashboard from '../pages/admin/Dashboard'
import EventsAdmin from '../pages/admin/EventsAdmin'
import ArchiveAdmin from '../pages/admin/ArchiveAdmin'
import ScrapbookAdmin from '../pages/admin/ScrapbookAdmin'
import VideosAdmin from '../pages/admin/VideosAdmin'
import ApplicationsAdmin from '../pages/admin/ApplicationsAdmin'
import CoverageAdmin from '../pages/admin/CoverageAdmin'
import UsersAdmin from '../pages/admin/UsersAdmin'
import AnalyticsAdmin from '../pages/admin/AnalyticsAdmin'
import SettingsAdmin from '../pages/admin/SettingsAdmin'

export default function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      {/* Root Route */}
      <Route
        path="/"
        element={
          user
            ? <Navigate to="/home" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Public */}
      <Route path="/home" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/scrapbook" element={<Scrapbook />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/about" element={<About />} />

      {/* Admin — protected + admin-only */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute adminOnly><EventsAdmin /></ProtectedRoute>} />
      <Route path="/admin/archive" element={<ProtectedRoute adminOnly><ArchiveAdmin /></ProtectedRoute>} />
      <Route path="/admin/scrapbook" element={<ProtectedRoute adminOnly><ScrapbookAdmin /></ProtectedRoute>} />
      <Route path="/admin/videos" element={<ProtectedRoute adminOnly><VideosAdmin /></ProtectedRoute>} />
      <Route path="/admin/applications" element={<ProtectedRoute adminOnly><ApplicationsAdmin /></ProtectedRoute>} />
      <Route path="/admin/coverage" element={<ProtectedRoute adminOnly><CoverageAdmin /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><UsersAdmin /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AnalyticsAdmin /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute adminOnly><SettingsAdmin /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
