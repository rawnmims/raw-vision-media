import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ProtectedRoute } from '../components/common/ThemeToggle'

// Public pages
const Home = lazy(() => import('../pages/Home'))
const Events = lazy(() => import('../pages/Events'))
const EventDetails = lazy(() => import('../pages/EventDetails'))
const Archive = lazy(() => import('../pages/Archive'))
const Scrapbook = lazy(() => import('../pages/Scrapbook'))
const Videos = lazy(() => import('../pages/Videos'))
const About = lazy(() => import('../pages/About'))

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'))
const Signup = lazy(() => import('../pages/auth/Signup'))

// Admin pages
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const EventsAdmin = lazy(() => import('../pages/admin/EventsAdmin'))
const ArchiveAdmin = lazy(() => import('../pages/admin/ArchiveAdmin'))
const ScrapbookAdmin = lazy(() => import('../pages/admin/ScrapbookAdmin'))
const VideosAdmin = lazy(() => import('../pages/admin/VideosAdmin'))
const ApplicationsAdmin = lazy(() => import('../pages/admin/ApplicationsAdmin'))
const CoverageAdmin = lazy(() => import('../pages/admin/CoverageAdmin'))
const UsersAdmin = lazy(() => import('../pages/admin/UsersAdmin'))
const AnalyticsAdmin = lazy(() => import('../pages/admin/AnalyticsAdmin'))
const SettingsAdmin = lazy(() => import('../pages/admin/SettingsAdmin'))
const AboutAdmin = lazy(() => import('../pages/admin/AboutAdmin'))
const FormsAdmin = lazy(() => import('../pages/admin/FormsAdmin'))

export default function AppRoutes() {
  return (
    <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    }
  >
    <Routes>
      {/* Root → login */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Public */}
      <Route path="/home" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:slug" element={<EventDetails />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/scrapbook" element={<Scrapbook />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/about" element={<About />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin — protected + admin-only */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute adminOnly><EventsAdmin /></ProtectedRoute>} />
      <Route path="/admin/archive" element={<ProtectedRoute adminOnly><ArchiveAdmin /></ProtectedRoute>} />
      <Route path="/admin/scrapbook" element={<ProtectedRoute adminOnly><ScrapbookAdmin /></ProtectedRoute>} />
      <Route path="/admin/videos" element={<ProtectedRoute adminOnly><VideosAdmin /></ProtectedRoute>} />
      <Route path="/admin/applications" element={<ProtectedRoute adminOnly><ApplicationsAdmin /></ProtectedRoute>} />
      <Route path="/admin/coverage" element={<ProtectedRoute adminOnly><CoverageAdmin /></ProtectedRoute>} />
      <Route path="/admin/forms" element={<ProtectedRoute adminOnly><FormsAdmin /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><UsersAdmin /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AnalyticsAdmin /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute adminOnly><SettingsAdmin /></ProtectedRoute>} />
      <Route path="/admin/about" element={<ProtectedRoute adminOnly><AboutAdmin /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      
    </Routes>
    </Suspense>
  )
}