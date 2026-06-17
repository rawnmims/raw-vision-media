import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from './ThemeToggle'
import { NAV_LINKS } from '../../utils/constants'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, signOut, isAdmin } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const bg = isDark
    ? scrolled ? 'bg-raw-black border-b border-gray-800' : 'bg-transparent'
    : scrolled ? 'bg-raw-white border-b border-gray-200' : 'bg-transparent'

  return (
    <>
      {/* Utility Bar */}
      <div className={`utility-bar hidden md:block ${isDark ? 'bg-raw-black border-gray-800 text-gray-400' : 'bg-raw-cream border-gray-300 text-gray-500'}`}>
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between">
          <span className="font-oswald text-xs tracking-widest">
            NMIMS SHIRPUR · EST. 2016 · OFFICIAL MEDIA CLUB
          </span>
          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-raw-accent transition-colors">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-raw-accent transition-colors">YouTube</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-raw-accent transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${bg}`}>
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center">
                <span
                  className="font-condensed text-3xl text-white leading-none"
                  style={{ background: '#0A0A0A', padding: '2px 6px' }}
                >
                  R
                </span>
                <span className={`font-condensed text-3xl leading-none ${isDark ? 'text-white' : 'text-raw-black'}`}>
                  AW
                </span>
              </div>
              <div className={`hidden sm:block ml-1 border-l pl-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                <div className={`font-oswald text-xs tracking-widest leading-tight ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  VISION MEDIA
                </div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-0">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-5 font-oswald text-xs tracking-widest uppercase transition-colors duration-200
                    ${isActive(link.path)
                      ? isDark ? 'text-white' : 'text-raw-black'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-raw-black'
                    }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-raw-accent"
                    />
                  )}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-4 py-5 font-oswald text-xs tracking-widest uppercase transition-colors duration-200
                    ${isActive('/admin') ? 'text-raw-accent' : 'text-raw-accent opacity-70 hover:opacity-100'}`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 font-oswald text-xs tracking-wider uppercase px-3 py-2 border transition-all
                      ${isDark ? 'border-gray-700 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-500'}`}
                  >
                    <User size={14} />
                    <span className="hidden sm:block">{profile?.name?.split(' ')[0] || 'User'}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className={`absolute right-0 top-full mt-1 w-44 border z-50
                          ${isDark ? 'bg-raw-black border-gray-700' : 'bg-raw-white border-gray-200'}`}
                      >
                        <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <p className={`font-oswald text-xs tracking-wider uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {profile?.name}
                          </p>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {profile?.role}
                          </p>
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-oswald tracking-wider uppercase transition-colors
                              ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                          >
                            <Settings size={13} /> Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-oswald tracking-wider uppercase transition-colors
                            ${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                          <LogOut size={13} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`font-oswald text-xs tracking-widest uppercase px-4 py-2 border transition-all
                    ${isDark
                      ? 'border-gray-600 text-gray-300 hover:border-white hover:text-white'
                      : 'border-gray-400 text-gray-600 hover:border-raw-black hover:text-raw-black'
                    }`}
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-1.5 ${isDark ? 'text-white' : 'text-raw-black'}`}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-0 left-0 right-0 z-40 pt-20 pb-8 px-6 ${isDark ? 'bg-raw-black' : 'bg-raw-white'} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
            style={{ top: '0', paddingTop: '80px' }}
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-3 font-condensed text-2xl tracking-widest border-b transition-colors
                      ${isDark ? 'border-gray-800 text-gray-200 hover:text-white' : 'border-gray-100 text-gray-700 hover:text-raw-black'}
                      ${isActive(link.path) ? 'text-raw-accent!' : ''}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {isAdmin && (
                <Link to="/admin" className="block py-3 font-condensed text-2xl tracking-widest text-raw-accent border-b border-gray-800">
                  Admin
                </Link>
              )}
              {!user && (
                <div className="flex gap-3 mt-4">
                  <Link to="/login" className="btn-ghost flex-1 text-center justify-center">Sign In</Link>
                  <Link to="/signup" className="btn-primary flex-1 text-center justify-center">Sign Up</Link>
                </div>
              )}
              {user && (
                <button onClick={handleSignOut} className="mt-4 btn-ghost w-full justify-center">
                  <LogOut size={14} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
