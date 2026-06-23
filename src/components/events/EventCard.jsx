import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion'
import { Lock, Star, Camera, Video, Images } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { getImageUrl, formatDateShort } from '../../utils/helpers'

// ─────────────────────────────────────────────
// CARD "EDITION" SYSTEM
// Gold is reserved for featured events (the PRO tier).
// Every other event is deterministically assigned red or silver
// based on its category, so the color is information, not decoration.
// ─────────────────────────────────────────────
const EDITION_GOLD = { hex: '#C8A96E', ring: 'ring-[#C8A96E]/50' }
const EDITION_VARIANTS = [
  { hex: '#C0392B', ring: 'ring-[#C0392B]/40' },
  { hex: '#C8C4BC', ring: 'ring-[#C8C4BC]/40' },
]

function hashCategory(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

function getEdition(category, featured) {
  if (featured) return EDITION_GOLD
  return EDITION_VARIANTS[hashCategory(category) % EDITION_VARIANTS.length]
}

function getDateParts(dateStr) {
  if (!dateStr) return { day: '–', month: '—', yearShort: '' }
  const d = new Date(dateStr)
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    yearShort: String(d.getFullYear()).slice(-2),
  }
}

const springConfig = { stiffness: 260, damping: 22, mass: 0.4 }

export function EventCard({ event, index = 0 }) {
  const { isDark } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const cardRef = useRef(null)

  const edition = getEdition(event.category, event.featured)
  const { day, month, yearShort } = getDateParts(event.event_date)
  const yearBadge = event.year ? String(event.year).slice(-2) : yearShort

  // ── 3D tilt + glare, driven by cursor position ──
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], shouldReduceMotion ? [0, 0] : [9, -9]),
    springConfig
  )
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], shouldReduceMotion ? [0, 0] : [-9, 9]),
    springConfig
  )
  const glareX = useTransform(mouseX, (v) => `${v * 100}%`)
  const glareY = useTransform(mouseY, (v) => `${v * 100}%`)
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35), transparent 55%)`

  function handleMouseMove(e) {
    if (shouldReduceMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }
  function handleMouseLeave() {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 36, rotate: index % 2 === 0 ? -3 : 3 }
      }
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: Math.min(index * 0.06, 0.6), type: 'spring', stiffness: 130, damping: 18 }}
      style={{ perspective: 1000 }}
      className="group"
    >
      <Link
        to={`/events/${event.id}`}
        className="block"
        aria-label={`${event.title} — ${event.category || 'event'} coverage, ${formatDateShort(event.event_date)}`}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={shouldReduceMotion ? {} : { y: -8 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className={`relative aspect-[3/4] rounded-[8px] overflow-hidden flex flex-col
            [clip-path:polygon(0%_0%,82%_0%,100%_9%,100%_100%,0%_100%)]
            shadow-[0_10px_34px_rgba(0,0,0,0.28)] ring-1 ${edition.ring}
            ${isDark ? 'bg-raw-black' : 'bg-raw-ink'}`}
        >
          {/* ── PHOTO / LABEL-ART ZONE ── */}
          <div className="relative h-[58%] overflow-hidden">
            <img
              src={getImageUrl(event.cover_image) || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
              alt={event.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: 'grayscale(30%) contrast(1.05) brightness(0.9)' }}
            />
            <div
              className="absolute inset-0 mix-blend-color"
              style={{ backgroundColor: edition.hex, opacity: 0.22 }}
            />
            <div className="absolute inset-0 grain-overlay" />
            <div className="cinematic-overlay absolute inset-0" />

            <div className="relative z-30 h-full flex flex-col justify-between p-2.5 sm:p-3 md:p-4">
              {/* brand row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Lock size={9} className="text-white/70 sm:w-[10px] sm:h-[10px]" />
                  <span className="font-oswald text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-white/90">
                    Raw
                  </span>
                </div>
                {event.featured && (
                  <span className="flex items-center gap-1 bg-raw-accent text-black px-1.5 sm:px-2 py-0.5 rounded-full">
                    <Star size={8} className="fill-black sm:w-[9px] sm:h-[9px]" />
                    <span className="font-oswald text-[8px] sm:text-[9px] font-bold tracking-widest uppercase">
                      Pro
                    </span>
                  </span>
                )}
              </div>

              {/* category / specs / big date */}
              <div>
                <p
                  className="font-display font-bold italic text-lg sm:text-xl md:text-2xl leading-tight mb-1 sm:mb-1.5 truncate"
                  style={{ color: edition.hex }}
                >
                  {event.category || 'Coverage'}
                </p>

                {/* Year badge + camera icon — tablets and up only.
                    Hidden on phones (small + large) to keep the card uncluttered. */}
                <div className="hidden sm:flex items-center gap-2 mb-3">
                  <div
                    className="w-9 h-9 rounded-full border flex items-center justify-center font-oswald text-[13px] font-semibold flex-shrink-0"
                    style={{ borderColor: edition.hex, color: edition.hex }}
                  >
                    {yearBadge || '—'}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/15">
                    <Camera size={18} className="text-white/80" />
                  </div>
                </div>

                <div className="flex items-end gap-1.5 sm:gap-2" title={formatDateShort(event.event_date)}>
                  <span
                    className="font-condensed text-3xl sm:text-4xl md:text-5xl leading-[0.8] text-white"
                    style={{ textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}
                  >
                    {day}
                  </span>
                  <div className="font-oswald text-[9px] sm:text-[10px] tracking-widest uppercase text-white/85 leading-tight pb-1">
                    <div>{month}</div>
                    <div>&apos;{yearBadge}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── LABEL ZONE (printed headline) ── */}
          <div
            className={`flex-1 px-2.5 py-2.5 sm:px-4 sm:py-4 md:px-5 md:py-5 flex flex-col justify-center
  ${isDark ? 'bg-raw-darkgray' : 'bg-raw-paper'}`}
          >
            <h3
              className={`
      font-display
      font-bold
      tracking-[-0.02em]
      text-sm
      sm:text-base
      md:text-xl
      lg:text-2xl
      xl:text-3xl
      leading-tight
      line-clamp-2
      mb-1
      sm:mb-1.5
      group-hover:opacity-80
      transition-opacity
      ${isDark ? 'text-white' : 'text-raw-ink'}
    `}
            >
              {event.title}
            </h3>

            {event.description && (
              <p
                className={`
        font-serif
        italic
        text-[11px]
        sm:text-xs
        md:text-sm
        lg:text-base
        xl:text-lg
        leading-relaxed
        line-clamp-2
        ${isDark ? 'text-gray-400' : 'text-gray-500'}
      `}
              >
                {event.description}
              </p>
            )}
          </div>

          {/* ── BRAND STRIP ── */}
          <div className="h-7 sm:h-8 md:h-9 bg-raw-red flex items-center justify-center gap-1.5 sm:gap-2 border-t border-black/10 flex-shrink-0">
            <span className="font-oswald text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-white">
              Raw
            </span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="hidden sm:inline font-oswald text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-white/70">
              Vision Media
            </span>
          </div>

          {/* keying notch */}
          <div className={`absolute -bottom-px left-1/2 -translate-x-1/2 w-7 h-2.5 rounded-t-full z-20 ${isDark ? 'bg-raw-black' : 'bg-raw-paper'}`} />

          {/* cursor-tracked glare */}
          {!shouldReduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: glareBg, mixBlendMode: 'overlay' }}
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  )
}

function SkeletonCard({ isDark }) {
  return (
    <div
      className={`aspect-[3/4] rounded-[8px] overflow-hidden flex flex-col animate-pulse
        [clip-path:polygon(0%_0%,82%_0%,100%_9%,100%_100%,0%_100%)]
        ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
    >
      <div className={`h-[58%] ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
      <div className="flex-1 px-2.5 sm:px-3.5 py-2.5 sm:py-3 space-y-2">
        <div className={`h-3 w-2/3 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
        <div className={`h-3 w-full rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
      </div>
      <div className={`h-7 sm:h-8 md:h-9 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
    </div>
  )
}

export function EventGrid({ events, loading }) {
  const { isDark } = useTheme()

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonCard key={i} isDark={isDark} />
        ))}
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="py-16 sm:py-24 flex flex-col items-center text-center gap-3">
        <div className={`flex items-center justify-center w-14 h-14 rounded-full border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-600' : 'border-gray-300 text-gray-400'}`}>
          <Images size={20} />
        </div>
        <p className={`font-display text-xl sm:text-2xl italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No cards in this slot.
        </p>
        <p className="font-oswald text-[11px] tracking-widest uppercase text-gray-400">
          Try another category
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
      {events.map((event, i) => (
        <EventCard key={event.id} event={event} index={i} />
      ))}
    </div>
  )
}