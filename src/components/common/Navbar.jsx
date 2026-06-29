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
import nmimsLogo from '../../assets/nmims-logo.png'
import nmimsLogoWhite from '../../assets/nmims-white.png'

/* ─── dark-circle social icon wrapper (matches the reference design) ─── */
const SocialIcon = ({ label, href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '36px', height: '36px', borderRadius: '50%',
      background: '#2a2a2a',
      color: '#c8c0b8',
      flexShrink: 0,
      transition: 'background 0.2s, color 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#c0392b'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#c8c0b8'; e.currentTarget.style.transform = 'translateY(0)' }}
  >
    {children}
  </a>
)

/* ─── inline SVG social icons ─── */
const InstagramSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
)

const YoutubeSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
  </svg>
)

const LinkedinSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

/* ─── social links — swap hrefs for the real club accounts ─── */
const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramSVG },
  { label: 'YouTube',   href: 'https://youtube.com',   Icon: YoutubeSVG   },
  { label: 'LinkedIn',  href: 'https://linkedin.com',  Icon: LinkedinSVG  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [scrolled,   setScrolled]       = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, signOut, isAdmin } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()
  const navigate  = useNavigate()

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

  // Background is now pure white in light mode, near-black in dark mode
  const cream  = isDark ? '#0d0d0d' : '#ffffff'
  const ink    = isDark ? '#f0ece4' : '#1a1a1a'
  const muted  = isDark ? '#8a8078' : '#7a7068'
  const rule   = isDark ? '#2e2b26' : '#d4cec6'
  const accent = '#c0392b'

  return (
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
        {/* ── masthead ── */}
        <div
          className="max-w-7xl mx-auto"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'clamp(12px, 2vw, 24px)',
            paddingLeft: 'clamp(12px, 3vw, 24px)',
            paddingRight: 'clamp(12px, 3vw, 24px)',
            height: 'clamp(64px, 8vw, 80px)',
          }}
        >
          {/* LEFT — RAW logo · NMIMS logo · tagline */}
          <Link
            to="/home"
            style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 1.6vw, 16px)', textDecoration: 'none', minWidth: 0, overflow: 'hidden' }}
          >
            <img
              src={isDark ? rawLogoWhite : rawLogo}
              alt="RAW Vision Media"
              style={{ height: 'clamp(42px, 6vw, 58px)', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
            />

            <div className="hidden sm:block" style={{ width: '1px', height: 'clamp(26px, 4vw, 36px)', background: rule, flexShrink: 0 }} />

            <img
              src={isDark ? nmimsLogoWhite : nmimsLogo}
              alt="SVKM's NMIMS Shirpur"
              className="hidden sm:block"
              style={{ height: 'clamp(42px, 6vw, 58px)', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
            />

            <div
              className="hidden lg:flex"
              style={{
                flexDirection: 'column',
                gap: '3px',
                minWidth: 0,
                borderLeft: `1px solid ${rule}`,
                paddingLeft: 'clamp(12px, 2vw, 18px)',
              }}
            >
              {/* Playfair Display for the institutional identity text */}
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(13px, 1.8vw, 15px)', letterSpacing: '0.06em', color: ink, whiteSpace: 'nowrap', fontWeight: 600 }}>
                SVKM&apos;s NMIMS Shirpur
              </span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(11px, 1.5vw, 13px)', letterSpacing: '0.05em', color: muted, whiteSpace: 'nowrap', fontStyle: 'italic', fontWeight: 400 }}>
                Est. 2016 · Official Media Club
              </span>
            </div>
          </Link>

          {/* RIGHT — socials · theme toggle · user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 20vw, 22px)', flexShrink: 0 }}>

            <div
              className="hidden lg:flex"
              style={{ alignItems: 'center', gap: '10px', paddingRight: 'clamp(10px, 1.6vw, 16px)', borderRight: `1px solid ${rule}` }}
            >
              {SOCIALS.map(({ label, href, Icon }) => (
                <SocialIcon key={label} label={label} href={href}>
                  <Icon />
                </SocialIcon>
              ))}
            </div>

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
                        background: isDark ? '#111' : '#ffffff',
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
        <div style={{ height: '2px', background: isDark ? 'linear-gradient(to right, #1a1a1a 0%, #3a3530 30%, #3a3530 70%, #1a1a1a 100%)' : 'linear-gradient(to right, #ffffff 0%, #1a1a1a 30%, #1a1a1a 70%, #ffffff 100%)' }} />

        {/* ── nav link strip ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'center', background: isDark ? '#0d0d0d' : '#ffffff' }}>
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
              onMouseEnter={e => { if (!isActive(link.path)) { e.currentTarget.style.color = ink; e.currentTarget.style.background = isDark ? '#1a1714' : '#f5f5f5' } }}
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

      {/* ── MOBILE NAVBAR ── */}
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

            {/* Mobile — RAW logo · NMIMS logo */}
            <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0, minWidth: 0, overflow: 'hidden' }}>
              {/* FIX: use isDark to switch logo on mobile too */}
              <img src={isDark ? rawLogoWhite : rawLogo} alt="RAW Vision Media" style={{ height: 'clamp(32px, 10vw, 40px)', width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ width: '1px', height: '22px', background: rule, flexShrink: 0 }} />
              <img src={isDark ? nmimsLogoWhite : nmimsLogo} alt="SVKM's NMIMS Shirpur" style={{ height: 'clamp(36px, 11vw, 46px)', width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
            </Link>

            {/* Mobile — Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ padding: '8px', border: `1px solid ${rule}`, background: 'transparent', cursor: 'pointer', color: ink, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1a1714' : '#f5f5f5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {mobileOpen ? <X size={13} /> : <Menu size={13} />}
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile slide-down menu ── */}
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
                background: isDark ? '#0d0d0d' : '#ffffff',
                borderBottom: `1px solid ${rule}`,
                overflow: 'hidden',
              }}
            >
              {/* Club identity — tagline + socials */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingBottom: '18px', marginBottom: '18px', borderBottom: `1px solid ${rule}` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                  {/* Playfair Display for the mobile tagline too */}
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '11px', letterSpacing: '0.04em', color: ink, whiteSpace: 'nowrap', fontWeight: 600 }}>
                    SVKM&apos;s NMIMS Shirpur
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '10px', letterSpacing: '0.03em', color: muted, whiteSpace: 'nowrap', fontStyle: 'italic', fontWeight: 400 }}>
                    Est. 2016 · Official Media Club
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <SocialIcon key={label} label={label} href={href}>
                      <Icon />
                    </SocialIcon>
                  ))}
                </div>
              </div>

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
  )
}