import { Link } from 'react-router-dom'
import { getImageUrl } from '../../utils/helpers'
import { motion } from 'framer-motion'
import { Calendar, Images, ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { formatDateShort } from '../../utils/helpers'

export function EventCard({ event, index = 0 }) {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`editorial-card group ${isDark ? 'border-gray-600' : ''}`}
    >
      <Link to={`/events/${event.id}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3] mb-4">
          <img
            src={getImageUrl(event.cover_image) || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="font-oswald text-[10px] tracking-widest uppercase px-2 py-1 bg-raw-accent text-black">
              {event.category || 'Event'}
            </span>
          </div>
          {event.featured && (
            <div className="absolute top-3 right-3">
              <span className="font-oswald text-[10px] tracking-widest uppercase px-2 py-1 bg-white text-black">
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <p className={`font-oswald text-[10px] tracking-widest flex items-center gap-1.5 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <Calendar size={10} /> {formatDateShort(event.event_date)}
            </p>
            <p className={`font-oswald text-[10px] tracking-widest flex items-center gap-1 uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <Images size={10} /> Gallery
            </p>
          </div>

          <h3 className={`font-display text-lg font-bold leading-tight mb-2 group-hover:text-raw-accent transition-colors ${isDark ? 'text-white' : 'text-raw-ink'}`}>
            {event.title}
          </h3>

          <p className={`font-serif text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {event.description}
          </p>

          <div className={`mt-4 flex items-center gap-2 font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-raw-ink'} transition-colors`}>
            View Gallery <ArrowRight size={12} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function EventGrid({ events, loading }) {
  const { isDark } = useTheme()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className={`animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="aspect-[4/3] bg-gray-300/20 mb-4" />
            <div className="space-y-2 px-1">
              <div className={`h-3 w-1/3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`h-5 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`h-3 w-full rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className={`font-display text-2xl italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No events found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, i) => (
        <EventCard key={event.id} event={event} index={i} />
      ))}
    </div>
  )
}
