import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { EventGrid } from '../components/events/EventCard'
import EventFilters from '../components/events/EventFilters'
import { useTheme } from '../context/ThemeContext'
import { eventService } from '../services/eventService'
import { SAMPLE_EVENTS, CURRENT_YEAR } from '../utils/constants'

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

export default function Events() {
  const { isDark } = useTheme()
  const [events, setEvents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventService.getEvents({ year: CURRENT_YEAR, visibility: 'public' })
      .then(data => {
        const list = data.length > 0 ? data : SAMPLE_EVENTS.filter(e => e.year === CURRENT_YEAR || true)
        setEvents(list)
        setFiltered(list)
      })
      .catch(() => {
        setEvents(SAMPLE_EVENTS)
        setFiltered(SAMPLE_EVENTS)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(category ? events.filter(e => e.category === category) : events)
  }, [category, events])

  return (
    <MainLayout>
      <div className={`relative min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-paper'}`}>
        <NewsprintBackdrop isDark={isDark} />

        {/* Page Header */}
        <div className={`relative border-b ${isDark ? 'border-gray-800' : 'border-gray-300'} pt-12 pb-8 px-6`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.08 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <p className="section-eyebrow">{CURRENT_YEAR} Coverage</p>
                <span className="font-oswald text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 border border-raw-accent text-raw-accent rotate-[-2deg]">
                  Vol. {CURRENT_YEAR}
                </span>
              </div>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h1 className={`editorial-heading text-5xl md:text-7xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                  Events
                </h1>
                <p className={`font-serif text-lg italic pb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filtered.length} event{filtered.length !== 1 ? 's' : ''} this year
                </p>
              </div>
              <div className={`mt-4 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`} />
              <p className={`font-oswald text-[10px] tracking-widest uppercase mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Every card below holds the full-resolution archive — tap to load
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className={`relative border-b ${isDark ? 'border-gray-800' : 'border-gray-300'} px-6 py-4`}>
          <div className="max-w-7xl mx-auto">
            <EventFilters selected={category} onChange={setCategory} />
          </div>
        </div>

        {/* Grid */}
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <EventGrid events={filtered} loading={loading} />
        </div>
      </div>
    </MainLayout>
  )
}
