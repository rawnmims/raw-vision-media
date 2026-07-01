import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, ExternalLink, Lock, Share2, Check } from 'lucide-react'
import { MainLayout } from '../layouts/MainLayout'
import EventGallery from '../components/events/EventGallery'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { eventService } from '../services/eventService'
import { SAMPLE_EVENTS } from '../utils/constants'
import { formatDate } from '../utils/helpers'
import { Helmet } from 'react-helmet-async'

const EDITION_GOLD = '#C8A96E'
const EDITION_VARIANTS = ['#C0392B', '#C8C4BC']
function hashCategory(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}
function getEditionHex(category, featured) {
  if (featured) return EDITION_GOLD
  return EDITION_VARIANTS[hashCategory(category) % EDITION_VARIANTS.length]
}

function NewsprintBackdrop({ isDark }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden grain-overlay">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: isDark
            ? 'repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 140px)'
            : 'repeating-linear-gradient(90deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 140px)',
        }}
      />
    </div>
  )
}

export default function EventDetails() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const { user } = useAuth()
  const isExternal = user?.role === 'external' || !user
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    eventService.getEventById(id)
      .then(data => setEvent(data))
      .catch(() => {
        const fallback = SAMPLE_EVENTS.find(e => e.id === id) || SAMPLE_EVENTS[0]
        setEvent(fallback)
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleShare() {
    if (!event) return
    const shareData = {
      title: event.title,
      text: `${event.title} — Raw Vision Media`,
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // user dismissed the native share sheet — nothing to do
      }
      return
    }
    try {
      await navigator.clipboard.writeText(shareData.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked by browser permissions — fail silently
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0.3, rotate: -4 }}
            animate={{ opacity: [0.3, 0.7, 0.3], rotate: [-4, 4, -4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-16 h-20 rounded-[6px] border-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
            style={{ clipPath: 'polygon(0% 0%, 78% 0%, 100% 12%, 100% 100%, 0% 100%)' }}
          />
          <div className="font-condensed text-2xl tracking-widest text-gray-400">Reading card…</div>
        </div>
      </MainLayout>
    )
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className={`font-display text-2xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>Event not found.</p>
          <Link to="/events" className="btn-ghost text-lg">← Back to Events</Link>
        </div>
      </MainLayout>
    )
  }

  const accent = getEditionHex(event.category, event.featured)
  const eventDay = event.event_date ? new Date(event.event_date).getDate() : null

  return (
    <MainLayout>
      <Helmet>
        <title>{event.title} | RAW Vision Media</title>

        <meta
          name="description"
          content={event.description || `Photography coverage of ${event.title} by RAW Vision Media.`}
        />
      </Helmet>
      <div className={`relative min-h-screen ${isDark ? 'bg-raw-black' : 'bg-[#FAFAFA]'}`}>
        <NewsprintBackdrop isDark={isDark} />

        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img
            src={event.cover_image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80'}
            alt={event.title}
            className="w-full h-full object-cover object-centre"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
            <Link to="/events" className="inline-flex items-center gap-2 font-oswald text-base tracking-widest uppercase text-white/60 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={13} /> All Events
            </Link>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-oswald text-base tracking-[0.25em] uppercase mb-2"
              style={{ color: accent }}
            >
              {event.category || 'Coverage'} — Archive
            </motion.p>
            <motion.h1
              className="font-display text-3xl md:text-5xl text-white font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              {event.title}
            </motion.h1>
          </div>
        </div>

        {/* Meta bar — styled as a "loaded card" stub */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 140, damping: 20 }}
          className={`relative border-b ${isDark ? 'border-gray-800 bg-raw-darkgray' : 'border-gray-300 bg-raw-cream'}`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6">
            {/* mini card swatch */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-11 rounded-[4px] flex items-center justify-center font-condensed text-lg text-white flex-shrink-0"
                style={{ backgroundColor: accent, clipPath: 'polygon(0% 0%, 72% 0%, 100% 18%, 100% 100%, 0% 100%)' }}
              >
                {''}
              </div>
              <div className="flex items-center gap-1">
                <Lock size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                <span className="font-oswald text-[12px] tracking-[0.2em] uppercase text-gray-400">Raw Vision Media</span>
              </div>
            </div>

            <span className={`hidden sm:block w-px h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

            <span className={`flex items-center gap-1.5 font-oswald text-base tracking-widest uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Calendar size={15} /> {formatDate(event.event_date)}
            </span>
            <span className="flex items-center gap-1.5 font-oswald text-base tracking-widest uppercase" style={{ color: accent }}>
              <Tag size={15} /> {event.category}
            </span>
            <div className="flex items-center gap-5 ml-auto">
              <motion.button
                onClick={handleShare}
                whileTap={{ scale: 0.92 }}
                className={`flex items-center gap-1.5 font-oswald text-xs tracking-widest uppercase transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-raw-ink'}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="flex items-center gap-1.5"
                      style={{ color: accent }}
                    >
                      <Check size={12} /> Copied
                    </motion.span>
                  ) : (
                    <motion.span
                      key="share"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="flex items-center gap-1.5 text-sm"
                    >
                      <Share2 size={15} /> Share
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {!isExternal && event.google_drive_folder && (
                <a
                  href={event.google_drive_folder}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-1.5 font-oswald text-sm tracking-widest uppercase ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-raw-ink'}`}
                >
                  <ExternalLink size={15} /> Drive Folder
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {event.description && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`font-serif text-3xl leading-relaxed max-w-3xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {event.description}
            </motion.p>
          )}
        </div>

        {/* Divider */}
        <div className="relative max-w-7xl mx-auto px-6 mb-8">
          <div className={`flex items-center gap-4 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
            <p className="section-eyebrow text-base">Gallery</p>
          </div>
        </div>

        {/* Gallery */}
        <div className="relative max-w-7xl mx-auto px-6 pb-20">
          <EventGallery event={event} />
        </div>
      </div>
    </MainLayout>
  )
}