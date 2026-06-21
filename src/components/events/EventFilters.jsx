import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { EVENT_CATEGORIES } from '../../utils/constants'

export default function EventFilters({ selected, onChange }) {
  const { isDark } = useTheme()
  const categories = ['All', ...EVENT_CATEGORIES]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const active = selected === cat || (cat === 'All' && !selected)
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat === 'All' ? '' : cat)}
            whileTap={{ scale: 0.94 }}
            className={`relative font-oswald text-xs tracking-widest uppercase px-4 py-2 border transition-colors duration-200 overflow-hidden
              ${active
                ? isDark
                  ? 'text-black border-white'
                  : 'text-white border-raw-ink'
                : isDark
                  ? 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                  : 'border-gray-300 text-gray-500 hover:border-gray-500 hover:text-raw-ink'
              }`}
          >
            {active && (
              <motion.span
                layoutId="filter-active-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className={`absolute inset-0 -z-10 ${isDark ? 'bg-white' : 'bg-raw-ink'}`}
              />
            )}
            <span className="relative">{cat}</span>
          </motion.button>
        )
      })}
    </div>
  )
}