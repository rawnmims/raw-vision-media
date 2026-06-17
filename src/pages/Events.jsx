import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { EventGrid } from '../components/events/EventCard'
import EventFilters from '../components/events/EventFilters'
import { useTheme } from '../context/ThemeContext'
import { eventService } from '../services/eventService'
import { SAMPLE_EVENTS, CURRENT_YEAR } from '../utils/constants'

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
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>
        {/* Page Header */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-12 pb-8 px-6`}>
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="section-eyebrow mb-2">{CURRENT_YEAR} Coverage</p>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h1 className={`editorial-heading text-5xl md:text-7xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                  Events
                </h1>
                <p className={`font-serif text-lg italic pb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {filtered.length} event{filtered.length !== 1 ? 's' : ''} this year
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} px-6 py-4`}>
          <div className="max-w-7xl mx-auto">
            <EventFilters selected={category} onChange={setCategory} />
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <EventGrid events={filtered} loading={loading} />
        </div>
      </div>
    </MainLayout>
  )
}
