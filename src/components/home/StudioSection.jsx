import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Camera, Video, Newspaper, Users,
  Eye, Heart, Play, CheckCircle2, ChevronRight,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { useTheme } from '../../context/ThemeContext'
import JoinRawModal from '../forms/JoinRawModal'

/* ── social media achievements — update values to real numbers ── */
const STATS = [
  { Icon: Eye,   value: '1.2M+', label: 'Total Views',        sub: 'across all platforms'   },
  { Icon: Heart, value: '48K+',  label: 'Highest Reel Likes', sub: 'single post record'     },
  { Icon: Play,  value: '300K+', label: 'Video Plays',        sub: 'on Instagram & YouTube' },
]

/* ── why join points ── */
const JOIN_POINTS = [
  { n: '01', text: 'Get hands-on with professional camera gear and editing suites from day one.' },
  { n: '02', text: 'Build a portfolio that speaks louder than any résumé.' },
  { n: '03', text: 'Cover real events — fests, convocations, guest lectures, sports — not mock shoots.' },
  { n: '04', text: 'Work alongside a team that takes the craft as seriously as you do.' },
  { n: '05', text: 'Your work gets published, shared, and seen by the whole campus.' },
]

export default function StudioSection({ settings }) {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [joinOpen, setJoinOpen] = useState(false)

  const ink    = isDark ? '#f0ece4' : '#0e0e0e'
  const muted  = isDark ? '#6a6460' : '#8a8480'
  const bg     = isDark ? '#0a0a0a' : '#ffffff'
  const rule   = isDark ? '#1e1c18' : '#e4e0da'
  const accent = '#c0392b'

  /* ── same open-check pattern as DynamicFormsBanner ── */
  const handleJoinClick = () => {
    if (!settings?.join_raw_open) {
      Swal.fire({
        icon: 'info',
        title: 'Applications Closed',
        text: 'RAW Vision Media Club recruitment is currently closed.',
        confirmButtonText: 'OK',
      })
      return
    }
    setJoinOpen(true)
  }

  return (
    <section
      ref={ref}
      style={{
        background: bg,
        borderTop: `1px solid ${rule}`,
        borderBottom: `1px solid ${rule}`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >

      <div
        className="max-w-7xl mx-auto"
        style={{ padding: 'clamp(56px, 8vw, 96px) clamp(20px, 5vw, 48px)' }}
      >

        {/* ── TOP ROW: eyebrow + headline + Meet Team CTA ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '32px',
            flexWrap: 'wrap',
            marginBottom: 'clamp(48px, 7vw, 80px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: '680px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '28px', height: '2px', background: accent }} />
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', color: accent }}>
                Who We Are
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(32px, 5vw, 58px)',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: ink,
                marginBottom: '24px',
              }}
            >
              The lens behind<br />
              every story at<br />
              <em style={{ color: accent, fontStyle: 'italic' }}>NMIMS Shirpur.</em>
            </h2>

            <p
              style={{
                fontFamily: "'Georgia', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                lineHeight: 1.75,
                color: muted,
                maxWidth: '540px',
              }}
            >
              RAW Vision Media is the campus media club — a collective of photographers,
              videographers, and storytellers who document life at NMIMS Shirpur.
              From fests to farewells, we make sure nothing goes unrecorded.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ flexShrink: 0 }}
          >
            <Link
              to="/about"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '14px 26px',
                background: ink, color: bg,
                fontFamily: "'Oswald', sans-serif", fontSize: '13px',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                textDecoration: 'none',
                border: `1px solid ${ink}`,
                transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.borderColor = accent }}
              onMouseLeave={e => { e.currentTarget.style.background = ink; e.currentTarget.style.borderColor = ink }}
            >
              <Users size={14} />
              Meet the Team
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>

        {/* ── SOCIAL MEDIA STATS ROW (3 cells) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
            border: `1px solid ${rule}`,
            marginBottom: 'clamp(32px, 5vw, 56px)',
          }}
        >
          {STATS.map(({ Icon, value, label, sub }, i) => (
            <div
              key={label}
              style={{
                padding: 'clamp(20px, 3vw, 36px) clamp(16px, 2.5vw, 32px)',
                borderRight: i < STATS.length - 1 ? `1px solid ${rule}` : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div aria-hidden="true" style={{ position: 'absolute', right: '12px', bottom: '8px', opacity: 0.04, color: ink }}>
                <Icon size={64} strokeWidth={1} />
              </div>

              <Icon size={16} strokeWidth={1.5} style={{ color: accent, flexShrink: 0 }} />

              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: ink,
                  lineHeight: 1,
                }}
              >
                {value}
              </div>

              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(11px, 1.2vw, 13px)', letterSpacing: '0.18em', textTransform: 'uppercase', color: ink, marginBottom: '3px' }}>
                  {label}
                </div>
                <div style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontSize: '12px', color: muted }}>
                  {sub}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── WHY JOIN RAW CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.28 }}
          style={{
            border: `1px solid ${rule}`,
            marginBottom: 'clamp(32px, 5vw, 56px)',
            position: 'relative',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) auto',
            gap: '0',
          }}
        >
          {/* left: content */}
          <div style={{ padding: 'clamp(28px, 4vw, 48px) clamp(24px, 3.5vw, 44px)', borderRight: `1px solid ${rule}` }}>

            {/* eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ width: '20px', height: '2px', background: accent }} />
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: accent }}>
                Why Join RAW
              </span>
            </div>

            {/* heading */}
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(22px, 3vw, 34px)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: ink,
                marginBottom: '28px',
              }}
            >
              More than a club —<br />
              <em style={{ fontStyle: 'italic', color: muted }}>a family you'll carry for life.</em>
            </h3>

            {/* points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {JOIN_POINTS.map(({ n, text }) => (
                <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <CheckCircle2 size={15} style={{ color: accent, flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontFamily: "'Georgia', serif", fontSize: 'clamp(13px, 1.4vw, 15px)', lineHeight: 1.65, color: muted, margin: 0 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA — uses same open-check pattern as DynamicFormsBanner */}
            <button
              onClick={handleJoinClick}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '13px 28px',
                background: accent, color: '#fff',
                fontFamily: "'Oswald', sans-serif", fontSize: '13px',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                border: `1px solid ${accent}`,
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#a93226'; e.currentTarget.style.borderColor = '#a93226' }}
              onMouseLeave={e => { e.currentTarget.style.background = accent; e.currentTarget.style.borderColor = accent }}
            >
              Apply Now
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>

      </div>

      {/* Join RAW modal */}
      <JoinRawModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />

    </section>
  )
}