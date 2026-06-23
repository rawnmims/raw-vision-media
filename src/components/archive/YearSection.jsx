import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { EventCard } from '../events/EventCard'

export function YearSection({ year, events, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const { isDark } = useTheme()

  // Unique categories for the subline
  const uniqueCats = [...new Set(events.map(e => e.category).filter(Boolean))].slice(0, 4)

  return (
    <div className={`border-b-2 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>

      {/* ── Year accordion header ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left py-7 group"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-4">

          {/* Left — edition stamp */}
          <div className="flex items-end gap-5 min-w-0">
            {/* Big year numeral */}
            <div className="relative flex-shrink-0">
              <span
                className={`font-condensed leading-none select-none transition-colors duration-300
                  text-[72px] md:text-[96px]
                  ${open
                    ? 'text-raw-accent'
                    : isDark ? 'text-white group-hover:text-raw-accent' : 'text-raw-ink group-hover:text-raw-accent'
                  }`}
              >
                {year}
              </span>
              {/* thin rule under the year */}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-500 ${open ? 'w-full bg-raw-accent' : 'w-0 bg-raw-accent'}`}
              />
            </div>

            {/* Meta — event count + categories */}
            <div className="pb-2 min-w-0">
              <p className={`font-oswald text-[11px] tracking-[0.25em] uppercase mb-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Vol. {year} &nbsp;·&nbsp; {events.length} Event{events.length !== 1 ? 's' : ''}
              </p>
              {uniqueCats.length > 0 && (
                <p className={`font-serif italic text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {uniqueCats.join(' · ')}
                </p>
              )}
            </div>
          </div>

          {/* Right — chevron */}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="flex-shrink-0"
          >
            <ChevronDown
              size={22}
              className={`transition-colors ${open ? 'text-raw-accent' : isDark ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`}
            />
          </motion.div>
        </div>
      </button>

      {/* ── Expanded card grid ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="grid"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}