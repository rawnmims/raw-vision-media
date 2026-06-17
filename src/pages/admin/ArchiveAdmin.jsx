import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Archive, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { eventService } from '../../services/eventService'
import { SAMPLE_EVENTS, CURRENT_YEAR } from '../../utils/constants'
import { formatDateShort } from '../../utils/helpers'

export default function ArchiveAdmin() {
  const { isDark } = useTheme()
  const [byYear, setByYear] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventService.getEvents()
      .then(data => {
        const list = data.length > 0 ? data : SAMPLE_EVENTS
        const grouped = {}
        list.forEach(e => {
          const y = e.year || new Date(e.event_date).getFullYear()
          if (!grouped[y]) grouped[y] = []
          grouped[y].push(e)
        })
        setByYear(grouped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)
  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="section-eyebrow mb-1">Historical</p>
          <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Archive</h1>
          <p className={`font-serif text-sm italic mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Events are automatically archived by year. Manage them from the Events section.
          </p>
        </div>

        <div className={`p-5 border ${cardBg} flex items-start gap-3`}>
          <Archive size={15} className="text-raw-accent mt-0.5 flex-shrink-0" />
          <p className={`font-sans text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Events from previous years are automatically shown in the Archive page. To edit or delete archived events, go to the{' '}
            <Link to="/admin/events" className="text-raw-accent underline underline-offset-2">Events admin page</Link>.
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <div className={`font-condensed text-xl animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {years.map((year, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`border ${cardBg}`}
              >
                <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="flex items-baseline gap-3">
                    <span className={`font-condensed text-3xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>{year}</span>
                    <span className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {byYear[year].length} event{byYear[year].length !== 1 ? 's' : ''}
                    </span>
                    {year === CURRENT_YEAR && (
                      <span className="font-oswald text-[10px] tracking-widest uppercase px-2 py-0.5 bg-raw-accent text-black">Current</span>
                    )}
                  </div>
                </div>
                <div className="divide-y divide-gray-800/50">
                  {byYear[year].slice(0, 5).map(event => (
                    <div key={event.id} className={`flex items-center gap-4 px-5 py-3 ${isDark ? 'hover:bg-gray-900/40' : 'hover:bg-gray-50'}`}>
                      {event.cover_image && (
                        <img src={event.cover_image} alt="" className="w-10 h-8 object-cover hidden sm:block flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-display text-sm font-bold truncate ${isDark ? 'text-gray-200' : 'text-raw-ink'}`}>{event.title}</p>
                      </div>
                      <span className={`font-oswald text-[10px] tracking-widest uppercase hidden md:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{event.category}</span>
                      <span className={`font-oswald text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{formatDateShort(event.event_date)}</span>
                    </div>
                  ))}
                  {byYear[year].length > 5 && (
                    <div className={`px-5 py-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      <p className="font-oswald text-xs tracking-widest uppercase">+{byYear[year].length - 5} more events</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
