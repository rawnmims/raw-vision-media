import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { YearSection } from '../components/archive/YearSection'
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
            ? 'repeating-linear-gradient(90deg,rgba(255,255,255,0.6) 0px,rgba(255,255,255,0.6) 1px,transparent 1px,transparent 140px)'
            : 'repeating-linear-gradient(90deg,rgba(0,0,0,0.6) 0px,rgba(0,0,0,0.6) 1px,transparent 1px,transparent 140px)',
        }}
      />
    </div>
  )
}

export default function Archive() {
  const { isDark } = useTheme()
  const [byYear, setByYear] = useState({})
  const [loading, setLoading] = useState(true)
  const yearRefs = useRef({})

  useEffect(() => {
    eventService.getEvents({ visibility: 'public' })
      .then(data => {
        const list = data.length > 0 ? data : SAMPLE_EVENTS
        const grouped = {}
        list.forEach(e => {
          const y = e.year || new Date(e.event_date).getFullYear()
          if (y < CURRENT_YEAR) {
            if (!grouped[y]) grouped[y] = []
            grouped[y].push(e)
          }
        })
        // Demo fallback
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

  function scrollToYear(year) {
    yearRefs.current[year]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <MainLayout>
      <div className={`relative min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-paper'}`}>
        <NewsprintBackdrop isDark={isDark} />

        {/* ── Page Header ── */}
        <div className={`relative border-b ${isDark ? 'border-gray-800' : 'border-gray-300'} pt-12 pb-8 px-6`}>
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <p className="section-eyebrow">The Vault</p>
                <span className="font-oswald text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 border border-raw-accent text-raw-accent rotate-[-1deg]">
                  Est. 2016
                </span>
              </div>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h1 className={`editorial-heading text-5xl md:text-7xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                  Archive
                </h1>
                {!loading && years.length > 0 && (
                  <p className={`font-serif text-lg italic pb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {years.length} year{years.length !== 1 ? 's' : ''} · {Object.values(byYear).reduce((s, e) => s + e.length, 0)} events
                  </p>
                )}
              </div>
              <p className={`font-serif text-base italic mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Every frame we've ever captured
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Year quick-jump pill bar ── */}
        {!loading && years.length > 0 && (
          <div className={`relative border-b ${isDark ? 'border-gray-800' : 'border-gray-300'} px-6 py-3`}>
            <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
              {years.map(year => (
                <motion.button
                  key={year}
                  onClick={() => scrollToYear(year)}
                  whileTap={{ scale: 0.93 }}
                  className={`font-oswald text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors duration-200
                    ${isDark
                      ? 'border-gray-700 text-gray-400 hover:border-raw-accent hover:text-raw-accent'
                      : 'border-gray-300 text-gray-500 hover:border-raw-accent hover:text-raw-accent'
                    }`}
                >
                  {year}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ── Content ── */}
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          {loading ? (
            <div className="py-24 text-center">
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className={`font-condensed text-3xl tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-300'}`}
              >
                Loading archive…
              </motion.div>
            </div>
          ) : years.length === 0 ? (
            <div className="py-24 text-center">
              <p className={`font-display text-2xl italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No archive events yet.
              </p>
            </div>
          ) : (
            years.map((year, i) => (
              <div
                key={year}
                ref={el => { yearRefs.current[year] = el }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                >
                  <YearSection
                    year={year}
                    events={byYear[year]}
                    defaultOpen={i === 0}
                  />
                </motion.div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  )
}