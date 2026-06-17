import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Calendar, Images } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { formatDateShort } from '../../utils/helpers'

export function ArchiveCard({ event }) {
  const { isDark } = useTheme()
  return (
    <Link to={`/events/${event.id}`} className="group flex gap-4 items-start">
      <div className="w-20 h-16 flex-shrink-0 overflow-hidden">
        <img
          src={event.cover_image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className={`flex-1 border-l-2 pl-3 transition-colors duration-200 group-hover:border-raw-accent ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <span className="font-oswald text-[10px] tracking-widest text-raw-accent uppercase">{event.category}</span>
        <h4 className={`font-display text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-raw-ink'}`}>{event.title}</h4>
        <p className={`font-oswald text-[10px] tracking-wider mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Calendar size={9} className="inline mr-1" />{formatDateShort(event.event_date)}
        </p>
      </div>
    </Link>
  )
}

export function YearSection({ year, events }) {
  const [open, setOpen] = useState(false)
  const { isDark } = useTheme()

  return (
    <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Year Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between py-6 px-0 group transition-colors ${isDark ? 'hover:text-white' : 'hover:text-raw-ink'}`}
      >
        <div className="flex items-baseline gap-6">
          <span className={`font-condensed text-5xl md:text-7xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>{year}</span>
          <div className="text-left">
            <p className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {events.length} Event{events.length !== 1 ? 's' : ''} Covered
            </p>
            <p className={`font-serif text-sm italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {events.map(e => e.category).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).join(' · ')}
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
        </motion.div>
      </button>

      {/* Events List */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ArchiveCard event={event} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
