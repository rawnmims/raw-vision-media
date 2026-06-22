import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import JoinRawModal from '../forms/JoinRawModal'
import CoverageModal from '../forms/CoverageModal'
import Swal from 'sweetalert2'
import { formService } from '../../services/formService'

/* ════════════════════════════════════════════════
   SHARED: SPROCKET ROW
════════════════════════════════════════════════ */
function SprocketRow({ count = 60, holeColor = 'rgba(255,255,255,0.15)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 6px', flexShrink: 0 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: '12px', height: '9px', borderRadius: '2px', background: holeColor, flexShrink: 0 }} />
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════
   SHARED: FILM STRIP COMPONENT
   theme='sepia' → sepia/cream  (MottoStrip)
   theme='dark'  → charcoal     (QuoteMottoStrip)
════════════════════════════════════════════════ */
function FilmStrip({ items, speed = 45, theme = 'sepia' }) {
  const FRAME_W  = 320
  const BASE_LEN = items.length / 3

  const isSepiaTheme = theme === 'sepia'

  const filmBg      = isSepiaTheme ? '#1c1309' : '#0f0f0f'
  const sprocketBg  = isSepiaTheme ? '#130e06' : '#1c1c1c'
  const frameBorder = isSepiaTheme ? '#0a0703' : '#000'
  const holeColor   = isSepiaTheme ? 'rgba(235,200,140,0.22)' : 'rgba(255,255,255,0.13)'
  const textColor   = isSepiaTheme ? 'rgba(240,218,168,0.92)' : 'rgba(245,240,232,0.85)'
  const numColor    = isSepiaTheme ? 'rgba(240,210,140,0.22)' : 'rgba(255,255,255,0.15)'
  const dotColor    = '#c0392b'

  return (
    <section style={{ background: filmBg, borderTop: `3px solid ${frameBorder}`, borderBottom: `3px solid ${frameBorder}`, overflow: 'hidden', position: 'relative', userSelect: 'none' }}>

      {/* top sprocket */}
      <div style={{ background: sprocketBg, borderBottom: `1px solid ${frameBorder}`, overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['0px', `-${FRAME_W * BASE_LEN}px`] }}
          transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
          style={{ display: 'flex', padding: '5px 0', width: 'max-content' }}
        >
          <SprocketRow count={90} holeColor={holeColor} />
          <SprocketRow count={90} holeColor={holeColor} />
          <SprocketRow count={90} holeColor={holeColor} />
        </motion.div>
      </div>

      {/* frames */}
      <motion.div
        animate={{ x: ['0px', `-${FRAME_W * BASE_LEN}px`] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', width: 'max-content', background: filmBg }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              minWidth: `${FRAME_W}px`, maxWidth: `${FRAME_W}px`,
              padding: '18px 36px',
              borderRight: `2px solid ${frameBorder}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative', boxSizing: 'border-box',
            }}
          >
            <span style={{ position: 'absolute', top: '6px', left: '10px', fontFamily: "'Oswald', sans-serif", fontSize: '8px', letterSpacing: '0.12em', color: numColor }}>
              {String(i % BASE_LEN + 1).padStart(2, '0')}A
            </span>
            <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(0.95rem, 1.2vw, 1.2rem)', color: textColor, letterSpacing: '0.02em', textAlign: 'center', lineHeight: 1.4, whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {item}
            </span>
            <div style={{ position: 'absolute', bottom: '7px', right: '10px', width: '5px', height: '5px', borderRadius: '50%', background: dotColor, opacity: 0.65 }} />
          </div>
        ))}
      </motion.div>

      {/* bottom sprocket */}
      <div style={{ background: sprocketBg, borderTop: `1px solid ${frameBorder}`, overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['0px', `-${FRAME_W * BASE_LEN}px`] }}
          transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
          style={{ display: 'flex', padding: '5px 0', width: 'max-content' }}
        >
          <SprocketRow count={90} holeColor={holeColor} />
          <SprocketRow count={90} holeColor={holeColor} />
          <SprocketRow count={90} holeColor={holeColor} />
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════
   MOTTO STRIP — sepia/cream film
════════════════════════════════════════════════ */
export function MottoStrip() {
  const BASE_ITEMS = [
    'Shoot. Click. Capture.',
    'Every Frame Tells a Story',
    'RAW Vision Media — Est. 2016',
    'Where Moments Become Legacy',
    'Born from Passion. Built on Precision.',
    'Frames Speak Louder.',
    'The Eye Behind Every Event',
    "NMIMS Shirpur's Visual Voice",
  ]
  const ITEMS = [...BASE_ITEMS, ...BASE_ITEMS, ...BASE_ITEMS]
  return <FilmStrip items={ITEMS} speed={45} theme="sepia" />
}

/* ════════════════════════════════════════════════
   DYNAMIC FORMS BANNER — editorial newspaper UI
════════════════════════════════════════════════ */
export function DynamicFormsBanner() {
  const { isDark } = useTheme()
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [joinOpen,     setJoinOpen]     = useState(false)
  const [coverageOpen, setCoverageOpen] = useState(false)
  const [settings,     setSettings]     = useState({})
  const [columns,      setColumns]      = useState('1fr 1px 1fr')

  useEffect(() => {
    formService.getSettings()
      .then(d => { if (d) setSettings(d) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 768) {
        setColumns('1fr')
      } else {
        setColumns('1fr 1px 1fr')
      }
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  const bg      = isDark ? '#0d0d0d' : '#1a1a1a'
  const rule    = isDark ? '#2a2520' : '#2e2b26'
  const accent  = '#c0392b'

  const panels = [
    {
      tag:   'Now Accepting',
      issue: 'Recruitment · Open Call',
      title: 'Join RAW Vision',
      body:  "We're looking for passionate photographers, videographers, designers, and storytellers to join our media family.",
      cta:   'Apply Now',
      col:   'I',
      openCheck: () => settings?.join_raw_open,
      closedTitle: 'Applications Closed',
      closedText:  'RAW Vision Media Club recruitment is currently closed.',
      onOpen: () => setJoinOpen(true),
    },
    {
      tag:   'Event Coverage',
      issue: 'Assignments · Submit Brief',
      title: 'Request Coverage',
      body:  'Need professional photography or videography for your event? Submit a request and our team will capture every moment.',
      cta:   'Submit Request',
      col:   'II',
      openCheck: () => settings?.coverage_open,
      closedTitle: 'Coverage Closed',
      closedText:  'Coverage requests are currently not being accepted.',
      onOpen: () => setCoverageOpen(true),
    },
  ]

  return (
    <>
      <section
        ref={ref}
        style={{
          background: bg,
          borderTop:    `1px solid ${rule}`,
          borderBottom: `1px solid ${rule}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* background halftone dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* top rule with label */}
        <div style={{ borderBottom: `1px solid ${rule}`, padding: '10px clamp(16px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ height: '1px', flex: 1, minWidth: '24px', background: `linear-gradient(to right, transparent, ${rule})`, transformOrigin: 'left' }}
          />
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 20px', flexShrink: 0 }}>
            RAW VISION MEDIA CLUB · OPEN CALLS
          </span>
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ height: '1px', flex: 1, background: `linear-gradient(to left, transparent, ${rule})`, transformOrigin: 'right' }}
          />
        </div>

        {/* two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 0, width: '100%' }}>

          {panels.map((panel, idx) => (
            <>
              <motion.div
                key={panel.col}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                style={{ padding: 'clamp(28px, 4vw, 52px) clamp(18px, 3vw, 44px) clamp(32px, 4vw, 48px)', position: 'relative' }}
              >
                {/* large ghost column number */}
                <span style={{
                  position: 'absolute', top: 'clamp(12px, 2vw, 20px)', right: 'clamp(14px, 3vw, 24px)',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 900, fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none',
                }}>
                  {panel.col}
                </span>

                {/* tag line */}
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: accent, marginBottom: '8px', marginTop: 0 }}>
                  {panel.tag}
                </p>

                {/* issue/section label */}
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: '20px', marginTop: 0 }}>
                  {panel.issue}
                </p>

                {/* thin rule under label */}
                <div style={{ height: '1px', background: rule, marginBottom: '22px' }} />

                {/* headline */}
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(1.6rem, 2.4vw, 2.4rem)', color: '#f0ece4', lineHeight: 1.1, marginBottom: '18px', marginTop: 0 }}>
                  {panel.title}
                </h3>

                {/* body */}
                <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '32px', marginTop: 0 }}>
                  {panel.body}
                </p>

                {/* CTA button */}
                <button
                  onClick={() => {
                    if (!panel.openCheck()) {
                      Swal.fire({ icon: 'info', title: panel.closedTitle, text: panel.closedText, confirmButtonText: 'OK' })
                      return
                    }
                    panel.onOpen()
                  }}
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: '10px', letterSpacing: '0.26em', textTransform: 'uppercase',
                    color: '#f0ece4',
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'transparent',
                    padding: '11px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.borderColor = accent }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                >
                  {panel.cta}
                  <span style={{ fontSize: '14px', lineHeight: 1 }}>→</span>
                </button>
              </motion.div>

              {/* vertical divider between columns only */}
              {idx === 0 && (
                <motion.div
                  key="divider"
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{
                    background: rule,
                    width: columns === '1fr' ? '100%' : '1px',
                    height: columns === '1fr' ? '1px' : 'auto',
                    justifySelf: 'center',
                  }}
                />
              )}
            </>
          ))}
        </div>

        {/* bottom rule */}
        <div style={{ borderTop: `1px solid ${rule}`, padding: '8px clamp(16px, 4vw, 40px)', display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(7px, 1.2vw, 8px)', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)' }}>
            Est. 2016 · NMIMS Shirpur · rawvisionmediaclub.in
          </span>
        </div>
      </section>

      <JoinRawModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
      <CoverageModal isOpen={coverageOpen} onClose={() => setCoverageOpen(false)} />
    </>
  )
}

/* ════════════════════════════════════════════════
   QUOTE MOTTO STRIP — dark/charcoal film
════════════════════════════════════════════════ */
const QUOTE_BASE_ITEMS = [
  'Est. 2016',
  'Where Moments Become Legacy',
  'Born from Passion. Built on Precision.',
  'Frames Speak Louder.',
  'The Eye Behind Every Event',
  "NMIMS Shirpur's Vision",
  'Shoot. Click. Capture.',
  'Every Frame Tells a Story',
]

/* vintage darkroom / film photography bg */
const BG_IMAGE = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=80&auto=format&fit=crop'

function QuoteMottoStrip() {
  const ITEMS = [...QUOTE_BASE_ITEMS, ...QUOTE_BASE_ITEMS, ...QUOTE_BASE_ITEMS]
  return <FilmStrip items={ITEMS} speed={50} theme="dark" />
}

/* ════════════════════════════════════════════════
   QUOTE SECTION
════════════════════════════════════════════════ */
export function QuoteSection() {
  const { isDark } = useTheme()
  const sectionRef = useRef(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' })

  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  const bgX   = useTransform(springX, [-1, 1], ['-2%', '2%'])
  const bgY   = useTransform(springY, [-1, 1], ['-2%', '2%'])
  const spotX = useTransform(springX, [-1, 1], ['20%', '80%'])
  const spotY = useTransform(springY, [-1, 1], ['20%', '80%'])

  function handleMouseMove(e) {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(((e.clientX - rect.left) / rect.width)  * 2 - 1)
    mouseY.set(((e.clientY - rect.top)  / rect.height) * 2 - 1)
  }

  const accent     = '#c0392b'
  const muted      = 'rgba(255,255,255,0.5)'
  const quoteWords = "They were never just photographers — they were storytellers.".split(' ')

  return (
    <>
      <QuoteMottoStrip />

      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
        style={{ position: 'relative', overflow: 'hidden', padding: '160px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* vintage photography bg with parallax */}
        <motion.div style={{
          position: 'absolute', inset: '-6%',
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          x: bgX, y: bgY,
          filter: 'sepia(0.55) brightness(0.38) contrast(1.1)',
        }} />

        {/* vignette overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)' }} />

        {/* warm sepia tone wash */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(30, 18, 8, 0.55)' }} />

        {/* cross-hatch texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M0 0l100 100M100 0L0 100' stroke='%23ffffff' stroke-width='0.4' opacity='0.04'/%3E%3C/svg%3E")` }} />

        {/* cursor spotlight */}
        <motion.div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: useTransform([spotX, spotY], ([x, y]) => `radial-gradient(circle 320px at ${x} ${y}, rgba(192,57,43,0.1) 0%, transparent 70%)`),
        }} />

        {/* grain */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }} />

        {/* corner marks */}
        {[{ top: 20, left: 20 }, { top: 20, right: 20 }, { bottom: 20, left: 20 }, { bottom: 20, right: 20 }].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            style={{
              position: 'absolute', width: '18px', height: '18px',
              borderColor: 'rgba(255,255,255,0.18)', borderStyle: 'solid', borderWidth: 0,
              ...(pos.top    !== undefined ? { borderTopWidth: '1px' }    : {}),
              ...(pos.bottom !== undefined ? { borderBottomWidth: '1px' } : {}),
              ...(pos.left   !== undefined ? { borderLeftWidth: '1px' }   : {}),
              ...(pos.right  !== undefined ? { borderRightWidth: '1px' }  : {}),
              ...pos,
            }}
          />
        ))}

        {/* content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>

          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1, ease: 'easeInOut' }}
            style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)', marginBottom: '36px', transformOrigin: 'center' }} />

          <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.38em', textTransform: 'uppercase', color: muted, marginBottom: '28px' }}>
            NMIMS Shirpur &bull; Since 2016
          </motion.p>

          <motion.span initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: 'block', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(52px, 8vw, 86px)', color: 'rgba(255,255,255,0.15)', lineHeight: 0.6, marginBottom: '12px', fontWeight: 700 }}>
            "
          </motion.span>

          <blockquote style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, color: '#f0e6d0', fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.3, margin: '0 0 8px 0' }}>
            {quoteWords.map((word, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.55, delay: 0.45 + i * 0.065, ease: 'easeOut' }}
                style={{ display: 'inline-block', marginRight: '0.28em' }}>
                {word}
              </motion.span>
            ))}
          </blockquote>

          <motion.span initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 1.25 }}
            style={{ display: 'block', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(52px, 8vw, 86px)', color: 'rgba(255,255,255,0.15)', lineHeight: 0.85, marginBottom: '28px', fontWeight: 700, textAlign: 'right', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
            "
          </motion.span>

          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.7, delay: 1.35, ease: 'easeInOut' }}
            style={{ width: '48px', height: '2px', background: accent, margin: '0 auto 20px', transformOrigin: 'center' }} />

          <motion.p initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 1.5 }}
            style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: muted, margin: 0 }}>
            RAW Vision Media Club
          </motion.p>

          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
            style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)', marginTop: '36px', transformOrigin: 'center' }} />
        </div>

      </section>
    </>
  )
}