import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Mail } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import { formService } from '../../services/formService'
import JoinRawModal from '../forms/JoinRawModal'
import CoverageModal from '../forms/CoverageModal'
import rLogo from '../../assets/r.png'
import aLogo from '../../assets/a.png'
import wLogo from '../../assets/w.png'

export default function Footer() {
  const { isDark } = useTheme()
  const [settings, setSettings] = useState({})
  const [mapHeight, setMapHeight] = useState(130)
  const [joinOpen, setJoinOpen] = useState(false)
  const [coverageOpen, setCoverageOpen] = useState(false)

  useEffect(() => {
    formService.getSettings().then(d => { if (d) setSettings(d) }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMapHeight(100)
      } else if (window.innerWidth < 1024) {
        setMapHeight(120)
      } else {
        setMapHeight(130)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleJoinClick = () => {
    if (!settings?.join_raw_open) {
      Swal.fire({ icon: 'info', title: 'Applications Closed', text: 'RAW Vision Media Club recruitment is currently closed.', confirmButtonText: 'OK' })
      return
    }
    setJoinOpen(true)
  }

  const handleCoverageClick = () => {
    if (!settings?.coverage_open) {
      Swal.fire({ icon: 'info', title: 'Coverage Closed', text: 'Coverage requests are currently not being accepted.', confirmButtonText: 'OK' })
      return
    }
    setCoverageOpen(true)
  }

  const accent = '#c0392b'
  const rule   = 'rgba(255,255,255,0.08)'
  const letterVariants = {
    hidden: { opacity: 0, y: 80, skewY: 6 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: {
        duration: 0.9,
        delay: 0.1 + i * 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const NAV_LINKS = [
    { label: 'Home',      to: '/home'      },
    { label: 'Events',    to: '/events'    },
    { label: 'Archive',   to: '/archive'   },
    { label: 'Scrapbook', to: '/scrapbook' },
    { label: 'Videos',    to: '/videos'    },
    { label: 'About',     to: '/about'     },
  ]

  const INVOLVE_LINKS = [
    { label: 'Join RAW',          action: handleJoinClick     },
    { label: 'Request Coverage',  action: handleCoverageClick },
    { label: 'Sign In',           to: '/login'                },
    { label: 'Create Account',    to: '/signup'               },
  ]

  return (
    <footer
      style={{
        background: '#0a0a0a',
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"),
          repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.012) 28px, rgba(255,255,255,0.012) 29px)
        `,
        borderTop: `3px double ${rule}`,
        color: '#a89f94',
        fontFamily: "'Oswald', sans-serif",
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* ── main grid ── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(24px, 5vw, 56px) clamp(16px, 5vw, 40px) clamp(20px, 4vw, 48px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(24px, 6vw, 48px)',
        }}
      >
        {/* ── COL 1: Brand ── */}
        <div style={{ paddingRight: 'clamp(12px, 3vw, 40px)' }}>
          <div>
            <div className="flex items-end gap-0 md:gap-1 mb-3 overflow-hidden">
              {[rLogo, aLogo, wLogo].map((src, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    scale: 1.06,
                    filter: 'brightness(1.15)',
                    transition: { duration: 0.25, ease: 'easeOut' }
                  }}
                  style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
                >
                  <img
                    src={src}
                    alt={['R', 'A', 'W'][i]}
                    className="h-9 sm:h-12 md:h-14 lg:h-15 w-auto object-contain"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex items-center gap-4 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <div className="h-px bg-white/40 w-8 sm:w-12" />
              <span className="font-oswald text-xs sm:text-sm md:text-sm tracking-[0.25em] text-white/80 uppercase">
                Vision Media Club
              </span>
            </motion.div>

            <motion.p
              className="font-serif text-lg sm:text-2xl md:text-xl text-white/90 italic mt-4 mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.75 }}
            >
              Frames Speak Louder.
            </motion.p>
          </div>

          <div style={{ height: '1px', background: rule, marginBottom: '20px' }} />

          <p style={{ fontSize: 'clamp(8px, 2vw, 12px)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 4px' }}>
            NMIMS Shirpur · Est. 2016
          </p>
          <p style={{ fontSize: 'clamp(8px, 2vw, 12px)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            Official Media Club
          </p>
        </div>

        {/* ── COL 2: Navigate ── */}
        <div style={{ padding: 'clamp(8px, 2vw, 36px)' }}>
          <h4 style={{ fontSize: '12px', letterSpacing: '0.34em', textTransform: 'uppercase', color: accent, marginBottom: '20px', paddingBottom: '10px', borderBottom: `1px solid ${rule}` }}>
            Navigate
          </h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {NAV_LINKS.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── COL 3: Get Involved ── */}
        <div style={{ padding: 'clamp(8px, 2vw, 36px)' }}>
          <h4 style={{ fontSize: '12px', letterSpacing: '0.34em', textTransform: 'uppercase', color: accent, marginBottom: '20px', paddingBottom: '10px', borderBottom: `1px solid ${rule}` }}>
            Get Involved
          </h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {INVOLVE_LINKS.map((link, i) => (
              <li key={i}>
                {link.to ? (
                  <Link
                    to={link.to}
                    style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span
                    onClick={link.action}
                    style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
                  >
                    {link.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ── COL 4: Contact + Socials + Map ── */}
        <div style={{ padding: 'clamp(8px, 2vw, 36px)' }}>
          <h4 style={{ fontSize: '12px', letterSpacing: '0.34em', textTransform: 'uppercase', color: accent, marginBottom: '20px', paddingBottom: '10px', borderBottom: `1px solid ${rule}` }}>
            Contact
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <Mail size={13} color="rgba(255,255,255,0.25)" />
            <a
              href={`mailto:${settings.website_email || 'rawvision@nmims.in'}`}
              style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s', wordBreak: 'break-word' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              {settings.website_email || 'rawvision@nmims.in'}
            </a>
          </div>

          <h4 style={{ fontSize: '9px', letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '14px' }}>
            Follow Us
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            <a
              href={settings.instagram || 'https://instagram.com/rawvisionmedia'}
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'rgba(255,255,255,0.38)', transition: 'color 0.2s', flexWrap: 'wrap' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
            >
              <Instagram size={13} />
              <span style={{ fontSize: 'clamp(10px, 1.5vw, 11px)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>RAW Vision Media</span>
            </a>

            <a
              href={settings.instagram_nmims || 'https://instagram.com/nmimshirpur'}
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'rgba(255,255,255,0.38)', transition: 'color 0.2s', flexWrap: 'wrap' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
            >
              <Instagram size={13} />
              <span style={{ fontSize: 'clamp(10px, 1.5vw, 11px)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>NMIMS Shirpur</span>
            </a>

            {(settings.linkedin || true) && (
              <a
                href={settings.linkedin || 'https://linkedin.com'}
                target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'rgba(255,255,255,0.38)', transition: 'color 0.2s', flexWrap: 'wrap' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}
              >
                <Linkedin size={13} />
                <span style={{ fontSize: 'clamp(10px, 1.5vw, 11px)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>LinkedIn</span>
              </a>
            )}
          </div>

          <div style={{ border: `1px solid ${rule}`, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, background: '#0a0a0a', padding: '2px 8px' }}>
              <span style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                NMIMS Shirpur
              </span>
            </div>
            <iframe
              title="NMIMS Shirpur Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.6625384721074!2d74.84441950000001!3d21.2848216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdf2ef04f9a5f9b%3A0xc4e460f10542781b!2sNMIMS%20Shirpur!5e0!3m2!1sen!2sin!4v1782109877234!5m2!1sen!2sin"
              width="100%"
              height={mapHeight}
              style={{ border: 0, display: 'block', filter: 'grayscale(1) invert(0.88) contrast(0.9)', opacity: 0.7 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* ── bottom bar ── */}
      <div style={{ borderTop: `1px solid ${rule}` }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: 'clamp(10px, 2vw, 14px) clamp(16px, 5vw, 40px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#f5f0e8', opacity: 0.75, margin: 0 }}>
            © {new Date().getFullYear()} RAW Vision Media · NMIMS Shirpur
          </p>
        </div>
      </div>

      <JoinRawModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
      <CoverageModal isOpen={coverageOpen} onClose={() => setCoverageOpen(false)} />
    </footer>
  )
}