import { useState } from 'react'
import { getImageUrl } from '../../utils/helpers'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function PhotoCard({ photo, onClick, index }) {
  const { isDark } = useTheme()
  return (
    <motion.div
      className="masonry-item group cursor-pointer relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
    >
      <img
        src={getImageUrl(photo.image_url)}
        alt={photo.caption}
        className="w-full block transition-transform duration-600 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center gap-2">
        <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        {photo.caption && (
          <p className="text-white font-oswald text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity px-3 text-center">
            {photo.caption}
          </p>
        )}
      </div>
      {photo.featured && (
        <div className="absolute top-2 left-2">
          <span className="bg-raw-accent text-black font-oswald text-[9px] tracking-widest uppercase px-1.5 py-0.5">
            Featured
          </span>
        </div>
      )}
    </motion.div>
  )
}

export function ScrapbookGrid({ photos }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const { isDark } = useTheme()

  const prev = () => setLightboxIndex(i => (i - 1 + photos.length) % photos.length)
  const next = () => setLightboxIndex(i => (i + 1) % photos.length)

  if (!photos || photos.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className={`font-display text-2xl italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No photos yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="masonry-grid">
        {photos.map((photo, i) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={i}
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2" onClick={() => setLightboxIndex(null)}>
              <X size={24} />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2" onClick={e => { e.stopPropagation(); prev() }}>
              <ChevronLeft size={32} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-16 max-w-5xl mx-auto"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={photos[lightboxIndex]?.image_url}
                alt={photos[lightboxIndex]?.caption}
                className="max-w-full max-h-[80vh] object-contain mx-auto block"
              />
              {photos[lightboxIndex]?.caption && (
                <p className="text-center font-oswald text-xs tracking-widest text-white/50 uppercase mt-4">
                  {photos[lightboxIndex].caption} · {lightboxIndex + 1}/{photos.length}
                </p>
              )}
            </motion.div>

            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2" onClick={e => { e.stopPropagation(); next() }}>
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
