import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Archive, Image, Video, Users,
  FileText, Mail, BarChart2, Settings, Menu, X, LogOut,
  ChevronRight, Camera, Inbox
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/common/ThemeToggle'

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Archive', path: '/admin/archive', icon: Archive },
  { label: 'Scrapbook', path: '/admin/scrapbook', icon: Image },
  { label: 'Videos', path: '/admin/videos', icon: Video },
  { label: 'Applications', path: '/admin/applications', icon: FileText },
  { label: 'Coverage Requests', path: '/admin/coverage', icon: Inbox },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  { label: 'About', path: '/admin/about', icon: Users },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const { isDark } = useTheme()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => path === '/admin' ? location.pathname === path : location.pathname.startsWith(path)

  const sidebarBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
  const mainBg = isDark ? 'bg-raw-black' : 'bg-gray-50'

  const Sidebar = () => (
    <div className={`w-60 flex-shrink-0 border-r ${sidebarBg} flex flex-col h-screen sticky top-0`}>
      {/* Brand */}
      <div className={`px-5 py-5 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <Link to="/" className="flex items-center gap-2">
          <span className="font-condensed text-2xl text-white" style={{ background: '#000', padding: '1px 5px' }}>R</span>
          <span className={`font-condensed text-2xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>AW</span>
          <span className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'} border-l pl-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)}
            className={`admin-sidebar-link ${isActive(path) ? 'active' : ''}`}
            style={isActive(path) ? { color: isDark ? '#fff' : '#1A1A1A', borderLeftColor: '#C8A96E', background: 'rgba(200,169,110,0.08)' } : {}}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className={`px-5 py-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-raw-cream'}`}>
            <span className="font-condensed text-sm text-raw-accent">{profile?.name?.[0] || 'A'}</span>
          </div>
          <div>
            <p className={`font-oswald text-xs tracking-wide ${isDark ? 'text-white' : 'text-raw-ink'}`}>{profile?.name}</p>
            <p className={`font-oswald text-[10px] tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Administrator</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-2 w-full font-oswald text-xs tracking-wider uppercase transition-colors
            ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-raw-black' : 'bg-gray-50'}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className={`sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Menu size={20} className={isDark ? 'text-white' : 'text-raw-ink'} />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5">
              <Link to="/admin" className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}>
                Admin
              </Link>
              {location.pathname !== '/admin' && (
                <>
                  <ChevronRight size={12} className="text-gray-400" />
                  <span className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                    {NAV.find(n => location.pathname.startsWith(n.path) && n.path !== '/admin')?.label || ''}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/" className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-raw-ink'}`}>
              ← View Site
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}