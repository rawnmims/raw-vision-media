import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from './ThemeToggle'
import { NAV_LINKS } from '../../utils/constants'
import rawLogo from '../../assets/raw-logo.png'
import rawLogoWhite from '../../assets/raw-white-transparent.png'

/* ─── tiny hook: live clock ─── */
function useLiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function formatDate(d) {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
function formatTime(d) {
  const h = String(d.getHours()).padStart(2,'0')
  const m = String(d.getMinutes()).padStart(2,'0')
  const s = String(d.getSeconds()).padStart(2,'0')
  return `${h}:${m}:${s}`
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [scrolled,   setScrolled]       = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, signOut, isAdmin } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()
  const navigate  = useNavigate()
  const now = useLiveClock()

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
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const cream  = isDark ? '#0d0d0d' : '#f5f0e8'
  const ink    = isDark ? '#f0ece4' : '#1a1a1a'
  const muted  = isDark ? '#8a8078' : '#7a7068'
  const rule   = isDark ? '#2e2b26' : '#d4cec6'
  const accent = '#c0392b'

  return (
    <>
      {/* ================================================
          UTILITY BAR — NOT sticky, scrolls away normally
      ================================================ */}
      <div style={{ background: isDark ? '#111' : '#1a1a1a', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#2e2b26'}` }}>
        <div
          className="max-w-7xl mx-auto"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 3vw, 20px)',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: 'clamp(12px, 3.5vw, 24px)',
            paddingRight: 'clamp(12px, 3.5vw, 24px)',
            fontFamily: "'Oswald', sans-serif",
            fontSize: 'clamp(8.5px, 2.2vw, 11px)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9a9088',
          }}
        >
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          NMIMS Shirpur
          <span className="hidden sm:inline"> · Est. 2016</span>
          {' '}· Official Media Club
        </span>
        <div className="flex items-center" style={{ gap: 'clamp(10px, 2.5vw, 20px)', flexShrink: 0 }}>
          {[
            { label: 'Instagram', href: 'https://instagram.com' },
            { label: 'YouTube',   href: 'https://youtube.com'   },
            { label: 'LinkedIn',  href: 'https://linkedin.com'  },
          ].map(({ label, href }, i) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={i === 0 ? '' : 'hidden md:inline'}
              style={{ color: '#9a9088', textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.target.style.color = '#e8d5b0'}
              onMouseLeave={e => e.target.style.color = '#9a9088'}
            >
              {label}
            </a>
          ))}
        </div>
        </div>
      </div>

      {/* ================================================
          STICKY WRAPPER — white masthead + nav strip only
      ================================================ */}
      <div className="sticky top-0 z-50">

        {/* ── DESKTOP NAVBAR ── */}
        <nav
          className="hidden md:block"
          style={{
            background: cream,
            borderBottom: `3px double ${ink}`,
            transition: 'background 0.3s',
            boxShadow: scrolled
              ? isDark ? '0 2px 12px rgba(0,0,0,0.6)' : '0 2px 12px rgba(0,0,0,0.08)'
              : 'none',
          }}
        >
          {/* ── three-column masthead ── */}
          <div
            className="max-w-7xl mx-auto"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              paddingLeft: 'clamp(12px, 3vw, 24px)',
              paddingRight: 'clamp(12px, 3vw, 24px)',
              height: 'clamp(64px, 8vw, 76px)',
            }}
          >
            {/* LEFT – Logo */}
            <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', minWidth: 0 }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img
                  src={isDark ? rawLogoWhite : rawLogo}
                  alt="RAW Vision Media"
                  style={{ height: 'clamp(48px, 7vw, 65px)', width: 'auto', objectFit: 'contain', position: 'relative', zIndex: 1, right: 10 }}
                />
              </div>
            </Link>

            {/* CENTER – Live clock */}
            <div
              style={{
                borderLeft: `1px solid ${rule}`,
                borderRight: `1px solid ${rule}`,
                paddingLeft: 'clamp(14px, 3.5vw, 32px)',
                paddingRight: 'clamp(14px, 3.5vw, 32px)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(9px, 1.1vw, 12px)', letterSpacing: '0.2em', color: muted, textTransform: 'uppercase' }}>
                {formatDate(now)}
              </span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(18px, 2.6vw, 26px)', color: ink, letterSpacing: '-0.01em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(now)}
              </span>
            </div>

            {/* RIGHT – ThemeToggle + User */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', minWidth: 0 }}>
              <ThemeToggle />

              {user ? (
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '7px',
                      paddingTop: 'clamp(4px, 0.8vw, 6px)', paddingBottom: 'clamp(4px, 0.8vw, 6px)',
                      paddingLeft: 'clamp(8px, 1.6vw, 13px)', paddingRight: 'clamp(8px, 1.6vw, 13px)',
                      border: `1px solid ${isDark ? '#3a3530' : '#c8c0b4'}`,
                      background: 'transparent', cursor: 'pointer',
                      fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(11px, 1.5vw, 15px)',
                      letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                      color: isDark ? '#d0c8be' : '#3a3028', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = ink; e.currentTarget.style.color = cream; e.currentTarget.style.borderColor = ink }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#d0c8be' : '#3a3028'; e.currentTarget.style.borderColor = isDark ? '#3a3530' : '#c8c0b4' }}
                  >
                    <User size={13} />
                    <span>{profile?.name?.split(' ')[0] || 'User'}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        style={{
                          position: 'absolute', right: 0, top: '100%', marginTop: '2px',
                          width: '168px',
                          background: isDark ? '#111' : '#faf8f4',
                          border: `1px solid ${isDark ? '#2e2b26' : '#d4cec6'}`,
                          zIndex: 50,
                          boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.1)',
                        }}
                      >
                        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${isDark ? '#2e2b26' : '#e0d8ce'}` }}>
                          <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.16em', textTransform: 'uppercase', color: isDark ? '#d0c8be' : '#3a3028', margin: 0 }}>
                            {profile?.name}
                          </p>
                          <p style={{ fontSize: '12px', color: muted, marginTop: '3px', marginBottom: 0, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em' }}>
                            {profile?.role}
                          </p>
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: isDark ? '#b0a898' : '#5a5048', textDecoration: 'none', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e1b18' : '#f0ece4'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <Settings size={12} /> Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: isDark ? '#b0a898' : '#5a5048', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e1b18' : '#f0ece4'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={12} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(8px, 1vw, 10px)', letterSpacing: '0.22em', textTransform: 'uppercase',
                    paddingTop: 'clamp(5px, 1vw, 7px)', paddingBottom: 'clamp(5px, 1vw, 7px)',
                    paddingLeft: 'clamp(10px, 2vw, 16px)', paddingRight: 'clamp(10px, 2vw, 16px)',
                    border: `1px solid ${ink}`, background: ink, color: cream, textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.borderColor = accent }}
                  onMouseLeave={e => { e.currentTarget.style.background = ink; e.currentTarget.style.borderColor = ink }}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* ── gradient rule ── */}
          <div style={{ height: '2px', background: isDark ? 'linear-gradient(to right, #1a1a1a 0%, #3a3530 30%, #3a3530 70%, #1a1a1a 100%)' : 'linear-gradient(to right, #faf8f4 0%, #1a1a1a 30%, #1a1a1a 70%, #faf8f4 100%)' }} />

          {/* ── nav link strip ── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'center', background: isDark ? '#0d0d0d' : '#f5f0e8' }}>
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  position: 'relative',
                  paddingTop: 'clamp(10px, 1.6vw, 14px)', paddingBottom: 'clamp(10px, 1.6vw, 14px)',
                  paddingLeft: 'clamp(10px, 2.2vw, 20px)', paddingRight: 'clamp(10px, 2.2vw, 20px)',
                  fontSize: 'clamp(11.5px, 1.5vw, 15px)',
                  fontFamily: "'Oswald', sans-serif", letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: isActive(link.path) ? ink : isDark ? '#7a7068' : '#6b6058',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  borderRight: `1px solid ${isDark ? '#2e2b26' : '#e0d8ce'}`,
                  borderLeft: i === 0 ? `1px solid ${isDark ? '#2e2b26' : '#e0d8ce'}` : 'none',
                  fontWeight: isActive(link.path) ? 500 : 400,
                  transition: 'color 0.2s, background 0.2s',
                  display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => { if (!isActive(link.path)) { e.currentTarget.style.color = ink; e.currentTarget.style.background = isDark ? '#1a1714' : '#f0ece4' } }}
                onMouseLeave={e => { if (!isActive(link.path)) { e.currentTarget.style.color = isDark ? '#7a7068' : '#6b6058'; e.currentTarget.style.background = 'transparent' } }}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div layoutId="nav-underline" style={{ position: 'absolute', bottom: 0, left: '10px', right: '10px', height: '2px', background: accent }} />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  paddingTop: 'clamp(12px, 2vw, 18px)', paddingBottom: 'clamp(12px, 2vw, 18px)',
                  paddingLeft: 'clamp(16px, 3vw, 30px)', paddingRight: 'clamp(16px, 3vw, 30px)',
                  fontSize: 'clamp(11.5px, 1.5vw, 15px)', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
                  opacity: isActive('/admin') ? 1 : 0.75, transition: 'opacity 0.2s', borderLeft: `1px solid ${isDark ? '#2e2b26' : '#e0d8ce'}`,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => { if (!isActive('/admin')) e.currentTarget.style.opacity = '0.75' }}
              >
                Admin
              </Link>
            )}
          </div>
        </nav>

        {/* ── MOBILE NAVBAR (wrapped in relative container so dropdown anchors to it) ── */}
        <div style={{ position: 'relative' }}>
          <nav
            className="md:hidden"
            style={{
              background: cream,
              borderBottom: `2px solid ${ink}`,
              transition: 'background 0.3s',
              boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.12)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 'clamp(10px, 4vw, 16px)', paddingRight: 'clamp(10px, 4vw, 16px)', height: '60px' }}>

              {/* Mobile – Logo */}
              <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
                <img src={isDark ? rawLogoWhite : rawLogo} alt="RAW Vision Media" style={{ height: 'clamp(34px, 11vw, 44px)', width: 'auto', objectFit: 'contain' }} />
              </Link>

              {/* Mobile – Live date (center, shrinks/truncates first) */}
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textAlign: 'center', paddingLeft: '6px', paddingRight: '6px' }}>
                <div style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(7px, 2.2vw, 9px)', letterSpacing: '0.16em',
                  color: muted, textTransform: 'uppercase',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {formatDate(now)}
                </div>
              </div>

              {/* Mobile – Right actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <ThemeToggle />
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  style={{ padding: '8px', border: `1px solid ${rule}`, background: 'transparent', cursor: 'pointer', color: ink, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1a1714' : '#f0ece4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {mobileOpen ? <X size={13} /> : <Menu size={13} />}
                </button>
              </div>
            </div>
          </nav>

          {/* ── Mobile slide-down menu — anchored directly under mobile nav ── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 40,
                  paddingTop: '24px', paddingBottom: '32px',
                  paddingLeft: 'clamp(16px, 5vw, 24px)', paddingRight: 'clamp(16px, 5vw, 24px)',
                  background: isDark ? '#0d0d0d' : '#faf8f4',
                  borderBottom: `1px solid ${rule}`,
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        style={{
                          display: 'block', padding: '12px 0',
                          fontFamily: "'Oswald', sans-serif", fontSize: '14px',
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          color: isActive(link.path) ? accent : isDark ? '#d0c8be' : '#3a3028',
                          textDecoration: 'none',
                          borderBottom: `1px solid ${rule}`,
                          fontWeight: isActive(link.path) ? 500 : 300,
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{ display: 'block', padding: '12px 0', fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, textDecoration: 'none', borderBottom: `1px solid ${rule}`, fontWeight: 500 }}
                    >
                      Admin
                    </Link>
                  )}

                  {!user && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                      <Link to="/login" className="btn-ghost flex-1 text-center justify-center">Sign In</Link>
                      <Link to="/signup" className="btn-primary flex-1 text-center justify-center">Sign Up</Link>
                    </div>
                  )}

                  {user && (
                    <button onClick={handleSignOut} className="mt-4 btn-ghost w-full justify-center">
                      <LogOut size={12} /> Sign Out
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </>
  )
}