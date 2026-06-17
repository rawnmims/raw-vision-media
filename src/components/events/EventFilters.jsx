import { useTheme } from '../../context/ThemeContext'
import { EVENT_CATEGORIES } from '../../utils/constants'

export default function EventFilters({ selected, onChange }) {
  const { isDark } = useTheme()
  const categories = ['All', ...EVENT_CATEGORIES]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat === 'All' ? '' : cat)}
          className={`font-oswald text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-200
            ${(selected === cat || (cat === 'All' && !selected))
              ? isDark
                ? 'bg-white text-black border-white'
                : 'bg-raw-ink text-white border-raw-ink'
              : isDark
                ? 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                : 'border-gray-300 text-gray-500 hover:border-gray-500 hover:text-raw-ink'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
