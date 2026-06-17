import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { SAMPLE_EVENTS, SAMPLE_SCRAPBOOK, SAMPLE_VIDEOS } from '../../utils/constants'
import { formatDateShort } from '../../utils/helpers'
import { eventService } from '../../services/eventService'
import { scrapbookService } from '../../services/formService'

export function FeaturedEvents() {
  const { isDark } = useTheme()
  const [events, setEvents] = useState(SAMPLE_EVENTS.filter(e => e.featured).slice(0, 4))

  useEffect(() => {
    eventService.getEvents({ featured: true, limit: 4 })
      .then(data => { if (data.length > 0) setEvents(data) })
      .catch(() => {})
  }, [])

  const [main, ...rest] = events

  return (
    <section className={`py-20 px-6 ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`flex items-end justify-between mb-10 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
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

        {/* Grid */}
        {events.length === 0 ? (
          <p className="text-gray-400 font-oswald tracking-wider">No events yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main feature */}
            {main && (
              <motion.div
                className="lg:col-span-2 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link to={`/events/${main.id}`} className="block">
                  <div className="relative overflow-hidden aspect-[16/10] mb-4">
                    <img
                      src={main.cover_image}
                      alt={main.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="cinematic-overlay absolute inset-0" />
                    <div className="absolute bottom-4 left-4">
                      <span className={`font-oswald text-xs tracking-widest uppercase px-2 py-1 ${isDark ? 'bg-raw-accent text-black' : 'bg-raw-accent text-black'}`}>
                        {main.category}
                      </span>
                    </div>
                  </div>
                  <div className={`border-t-2 pt-4 ${isDark ? 'border-white' : 'border-raw-ink'} group-hover:border-raw-accent transition-colors`}>
                    <p className={`font-oswald text-xs tracking-wider flex items-center gap-1.5 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Calendar size={11} /> {formatDateShort(main.event_date)}
                    </p>
                    <h3 className={`font-display text-2xl md:text-3xl font-bold leading-tight ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                      {main.title}
                    </h3>
                    <p className={`font-serif text-sm mt-2 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {main.description?.slice(0, 100)}...
                    </p>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Side events */}
            <div className="flex flex-col gap-6">
              {rest.slice(0, 3).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Link to={`/events/${event.id}`} className={`flex gap-4 pb-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                      <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 border-l-2 pl-4 transition-colors duration-200 group-hover:border-raw-accent" style={{ borderColor: isDark ? '#333' : '#ddd' }}>
                      <span className="font-oswald text-[10px] tracking-widest uppercase text-raw-accent">{event.category}</span>
                      <h4 className={`font-display text-sm font-bold leading-tight mt-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                        {event.title}
                      </h4>
                      <p className={`font-oswald text-[10px] tracking-wider mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatDateShort(event.event_date)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
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
          <Link to="/scrapbook" className={`font-oswald text-xs tracking-widest uppercase flex items-center gap-2
            ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-raw-ink'}`}>
            View All <ArrowRight size={14} />
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
