import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { YearSection } from '../components/archive/YearSection'
import { useTheme } from '../context/ThemeContext'
import { eventService } from '../services/eventService'
import { SAMPLE_EVENTS, CURRENT_YEAR } from '../utils/constants'

export default function Archive() {
  const { isDark } = useTheme()
  const [byYear, setByYear] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventService.getEvents({ visibility: 'public' })
      .then(data => {
        const list = data.length > 0 ? data : SAMPLE_EVENTS
        // Group by year, exclude current year
        const grouped = {}
        list.forEach(e => {
          const y = e.year || new Date(e.event_date).getFullYear()
          if (y < CURRENT_YEAR) {
            if (!grouped[y]) grouped[y] = []
            grouped[y].push(e)
          }
        })
        // Add some fake archive data for demo
        if (Object.keys(grouped).length === 0) {
          const archiveYears = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016]
          archiveYears.forEach(y => {
            grouped[y] = SAMPLE_EVENTS.map((e, i) => ({
              ...e,
              id: `${y}-${i}`,
              year: y,
              title: `${e.title} ${y}`,
            }))
          })
        }
        setByYear(grouped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  return (
    <MainLayout>
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>
        {/* Header */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-12 pb-8 px-6`}>
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="section-eyebrow mb-2">The Vault</p>
              <h1 className={`editorial-heading text-5xl md:text-7xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>Archive</h1>
              <p className={`font-serif text-lg italic mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Every frame we've ever captured — Est. 2016
              </p>
            </motion.div>
          </div>
        </div>

        {/* Archive by Year */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {loading ? (
            <div className="py-20 text-center">
              <div className={`font-condensed text-2xl tracking-widest animate-pulse ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Loading archive...</div>
            </div>
          ) : years.length === 0 ? (
            <div className="py-20 text-center">
              <p className={`font-display text-2xl italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No archive events yet.</p>
            </div>
          ) : (
            <div>
              {years.map((year, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <YearSection year={year} events={byYear[year]} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
