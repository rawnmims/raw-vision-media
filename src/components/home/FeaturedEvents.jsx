import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { SAMPLE_EVENTS, SAMPLE_SCRAPBOOK, SAMPLE_VIDEOS } from '../../utils/constants'
import { eventService } from '../../services/eventService'
import { scrapbookService } from '../../services/formService'
import { EventCard } from '../events/EventCard'

export function FeaturedEvents() {
  const { isDark } = useTheme()
  const [events, setEvents] = useState(SAMPLE_EVENTS.filter(e => e.featured).slice(0, 4))

  useEffect(() => {
    eventService.getEvents({ featured: true, limit: 4 })
      .then(data => { if (data.length > 0) setEvents(data) })
      .catch(() => {})
  }, [])

  return (
    <section className={`relative py-20 px-6 overflow-hidden grain-overlay ${isDark ? 'bg-raw-black' : 'bg-raw-paper'}`}>
      {/* newsprint column rules */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: isDark
            ? 'repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 140px)'
            : 'repeating-linear-gradient(90deg, rgba(0,0,0,0.6) 0px, rgba(0,0,0,0.6) 1px, transparent 1px, transparent 140px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className={`flex items-end justify-between mb-10 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
          <div>
            <p className="section-eyebrow mb-1">Latest Coverage</p>
            <h2 className={`editorial-heading text-4xl md:text-5xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>
              Recent Events
            </h2>
          </div>
          <Link to="/events" className={`font-oswald text-xs tracking-widest uppercase flex items-center gap-2 transition-colors
            ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-raw-ink'}`}>
            All Events <ArrowRight size={14} />
          </Link>
        </div>

        {/* Memory-card grid — same EventCard used on the Events page */}
        {events.length === 0 ? (
          <p className="text-gray-400 font-oswald tracking-wider">No events yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function FeaturedWorks() {
  const { isDark } = useTheme()
  const [photos, setPhotos] = useState(SAMPLE_SCRAPBOOK.filter(p => p.featured).slice(0, 6))

  useEffect(() => {
    scrapbookService.getPhotos({ featured: true })
      .then(data => { if (data.length > 0) setPhotos(data.slice(0, 6)) })
      .catch(() => {})
  }, [])

  return (
    <section className={`py-20 px-6 ${isDark ? 'bg-raw-darkgray' : 'bg-raw-cream'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`flex items-end justify-between mb-10 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div>
            <p className="section-eyebrow mb-1">Featured</p>
            <h2 className={`editorial-heading text-4xl md:text-5xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>
              Selected Works
            </h2>
          </div>
          <Link
            to="/scrapbook"
            className={`font-oswald text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-widest uppercase flex items-center gap-1 sm:gap-2
  ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-raw-ink'}`}
          >
            View All <ArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="group relative overflow-hidden"
              style={{ aspectRatio: i === 0 || i === 5 ? '4/5' : '1/1' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <img
                src={photo.image_url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-oswald text-xs tracking-wider text-white uppercase">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}