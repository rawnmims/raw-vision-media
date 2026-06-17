import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useState } from 'react'
import JoinRawModal from '../forms/JoinRawModal'
import CoverageModal from '../forms/CoverageModal'

export function MottoStrip() {
  const { isDark } = useTheme()
  const items = ['Photography', 'Cinematography', 'Editing', 'Graphic Design', 'Documentation', 'Logistics', 'Marketing', 'Data Handling']
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div className={`motto-strip py-3 border-y overflow-hidden ${isDark ? 'bg-raw-black border-gray-800 text-gray-400' : 'bg-raw-cream border-gray-300 text-gray-500'}`}>
      <div className="motto-scroll">
        {repeated.map((item, i) => (
          <span key={i} className="font-condensed text-sm tracking-[0.2em] uppercase mx-6">
            {item}
            <span className="mx-6 text-raw-accent">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function DynamicFormsBanner() {
  const { isDark } = useTheme()
  const [joinOpen, setJoinOpen] = useState(false)
  const [coverageOpen, setCoverageOpen] = useState(false)

  return (
    <>
      <section className={`border-y ${isDark ? 'bg-raw-darkgray border-gray-800' : 'bg-raw-ink border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-700">
            {/* Join RAW */}
            <motion.div
              className={`p-10 ${isDark ? 'bg-raw-darkgray' : 'bg-raw-ink'}`}
              whileHover={{ backgroundColor: isDark ? '#333' : '#222' }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-oswald text-xs tracking-[0.3em] text-raw-accent uppercase mb-3">Now Accepting</p>
              <h3 className="font-display text-3xl text-white font-bold mb-3">Join RAW Vision</h3>
              <p className="font-serif text-gray-400 text-sm leading-relaxed mb-6">
                We're looking for passionate photographers, videographers, designers, and storytellers to join our media family.
              </p>
              <button onClick={() => setJoinOpen(true)} className="font-oswald text-xs tracking-widest uppercase text-white border border-white px-6 py-3 hover:bg-white hover:text-raw-black transition-all">
                Apply Now →
              </button>
            </motion.div>

            {/* Coverage Request */}
            <motion.div
              className={`p-10 ${isDark ? 'bg-raw-black' : 'bg-raw-darkgray'}`}
              whileHover={{ backgroundColor: isDark ? '#1a1a1a' : '#333' }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-oswald text-xs tracking-[0.3em] text-raw-accent uppercase mb-3">Coverage</p>
              <h3 className="font-display text-3xl text-white font-bold mb-3">Request Coverage</h3>
              <p className="font-serif text-gray-400 text-sm leading-relaxed mb-6">
                Need professional photography or videography for your event? Submit a request and our team will capture every moment.
              </p>
              <button onClick={() => setCoverageOpen(true)} className="font-oswald text-xs tracking-widest uppercase text-white border border-white px-6 py-3 hover:bg-white hover:text-raw-black transition-all">
                Submit Request →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <JoinRawModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
      <CoverageModal isOpen={coverageOpen} onClose={() => setCoverageOpen(false)} />
    </>
  )
}

export function QuoteSection() {
  const { isDark } = useTheme()

  return (
    <section className={`py-24 px-6 ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={`font-serif text-8xl leading-none mb-4 ${isDark ? 'text-gray-700' : 'text-gray-200'}`}>"</div>
          <blockquote className={`font-serif text-2xl md:text-4xl leading-relaxed italic ${isDark ? 'text-white' : 'text-raw-ink'} -mt-12`}>
            Photography is the story I fail to put into words.
          </blockquote>
          <div className={`h-px w-16 mx-auto my-6 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
          <cite className="font-oswald text-xs tracking-[0.25em] uppercase text-raw-gray not-italic">
            Destin Sparks · RAW Vision Media
          </cite>
        </motion.div>
      </div>
    </section>
  )
}
