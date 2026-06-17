import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, ExternalLink } from 'lucide-react'
import { MainLayout } from '../layouts/MainLayout'
import EventGallery from '../components/events/EventGallery'
import { useTheme } from '../context/ThemeContext'
import { eventService } from '../services/eventService'
import { SAMPLE_EVENTS } from '../utils/constants'
import { formatDate } from '../utils/helpers'

export default function EventDetails() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventService.getEventById(id)
      .then(data => setEvent(data))
      .catch(() => {
        const fallback = SAMPLE_EVENTS.find(e => e.id === id) || SAMPLE_EVENTS[0]
        setEvent(fallback)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="font-condensed text-2xl tracking-widest text-gray-400 animate-pulse">Loading...</div>
        </div>
      </MainLayout>
    )
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className={`font-display text-2xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>Event not found.</p>
          <Link to="/events" className="btn-ghost">← Back to Events</Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>
        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img
            src={event.cover_image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
            <Link to="/events" className="inline-flex items-center gap-2 font-oswald text-xs tracking-widest uppercase text-white/60 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={13} /> All Events
            </Link>
            <motion.h1
              className="font-display text-3xl md:text-5xl text-white font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {event.title}
            </motion.h1>
          </div>
        </div>

        {/* Meta bar */}
        <div className={`border-b ${isDark ? 'border-gray-800 bg-raw-darkgray' : 'border-gray-200 bg-raw-cream'}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6">
            <span className={`flex items-center gap-1.5 font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Calendar size={12} /> {formatDate(event.event_date)}
            </span>
            <span className="flex items-center gap-1.5 font-oswald text-xs tracking-widest uppercase text-raw-accent">
              <Tag size={12} /> {event.category}
            </span>
            {event.google_drive_folder && (
              <a
                href={event.google_drive_folder}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-1.5 font-oswald text-xs tracking-widest uppercase ml-auto ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-raw-ink'}`}
              >
                <ExternalLink size={12} /> Drive Folder
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {event.description && (
            <p className={`font-serif text-lg leading-relaxed max-w-3xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {event.description}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className={`max-w-7xl mx-auto px-6 mb-8`}>
          <div className={`flex items-center gap-4 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className="section-eyebrow">Gallery</p>
            <div className="flex-1 h-px bg-current opacity-10" />
            <p className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Click to view · Download from Drive
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <EventGallery event={event} />
        </div>
      </div>
    </MainLayout>
  )
}
