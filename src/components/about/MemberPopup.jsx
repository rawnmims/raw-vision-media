import { motion, AnimatePresence } from 'framer-motion'
import { X, Instagram } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { getImageUrl } from '../../utils/helpers'

export default function MemberPopup({ member, onClose }) {
  const { isDark } = useTheme()

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-2xl max-h-[88vh] sm:max-h-[85vh] flex flex-col sm:flex-row overflow-y-auto border ${
              isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Square photo — left on desktop, capped height on mobile so it never eats the screen */}
            <div
              className={`w-full sm:w-64 aspect-square sm:aspect-auto max-h-[40vh] sm:max-h-none sm:flex-shrink-0 ${
                isDark ? 'bg-gray-800' : 'bg-raw-cream'
              }`}
            >
              {member && getImageUrl(member.photo) ? (
                <img
                  src={getImageUrl(member.photo)}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-condensed text-6xl text-raw-accent">
                    {member?.name?.[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Info — right */}
            <div className="flex-1 p-5 sm:p-8 flex flex-col justify-center min-w-0">
              <h2
                className={`font-display text-2xl sm:text-4xl font-bold leading-tight ${
                  isDark ? 'text-white' : 'text-raw-ink'
                }`}
              >
                {member?.name}
              </h2>

              <p className="font-oswald text-xs sm:text-sm tracking-widest text-raw-accent uppercase mt-2">
                {member?.role}
              </p>

              {member?.bio && (
                <p
                  className={`font-serif text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {member.bio}
                </p>
              )}

              {(member?.branch || member?.degree_year || member?.mem_of_raw_since) && (
                <div
                  className={`mt-4 sm:mt-5 pt-4 sm:pt-5 border-t space-y-1.5 ${
                    isDark ? 'border-gray-800' : 'border-gray-200'
                  }`}
                >
                  {(member?.branch || member?.degree_year) && (
                    <p
                      className={`font-oswald text-[11px] sm:text-xs tracking-wider uppercase ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {member.branch}
                      {member.branch && member.degree_year ? ' · ' : ''}
                      {member.degree_year}
                    </p>
                  )}
                  {member?.mem_of_raw_since && (
                    <p
                      className={`font-oswald text-[11px] sm:text-xs tracking-wider uppercase ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      Member of RAW since {member.mem_of_raw_since}
                    </p>
                  )}
                </div>
              )}

              {member?.instagram_url && (
                <a
                  href={member.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 sm:mt-6 inline-flex items-center gap-2 self-start font-oswald text-[11px] sm:text-xs tracking-widest uppercase px-4 py-2.5 border transition-colors ${
                    isDark
                      ? 'border-gray-700 text-white hover:border-raw-accent'
                      : 'border-gray-300 text-raw-ink hover:border-raw-ink'
                  }`}
                >
                  <Instagram size={14} /> Instagram
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}