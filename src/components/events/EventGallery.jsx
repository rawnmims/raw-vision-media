import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { GALLERY_IMAGES } from '../../utils/constants'

const EDITION_GOLD = '#C8A96E'
const EDITION_VARIANTS = ['#C0392B', '#C8C4BC']
function hashCategory(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}
function getEditionHex(category, featured) {
  if (featured) return EDITION_GOLD
  return EDITION_VARIANTS[hashCategory(category) % EDITION_VARIANTS.length]
}

export default function EventGallery({ event }) {
  const { isDark } = useTheme()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const accent = getEditionHex(event?.category, event?.featured)

  // Use sample images as placeholders when no real images exist
  const images = GALLERY_IMAGES.map((url, i) => ({ id: i, url, caption: `${event?.title || 'Event'} — ${i + 1}` }))

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex(i => (i - 1 + images.length) % images.length)
  const next = () => setLightboxIndex(i => (i + 1) % images.length)

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') closeLightbox()
  }

  return (
    <>
      <div className="masonry-grid" onKeyDown={handleKeyDown} tabIndex={0}>
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            className="masonry-item group relative cursor-pointer overflow-hidden border border-black/5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: Math.min(i * 0.04, 0.5) }}
            onClick={() => openLightbox(i)}
          >
            <div className="relative overflow-hidden">
              <img
                src={img.url}
                alt={img.caption}
                loading="lazy"
                className="w-full block transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 0 2px ${accent}` }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-oswald text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  View
                </span>
              </div>
              {/* film-negative frame number */}
              <span
                className="absolute bottom-2 left-2 font-oswald text-[10px] tracking-widest text-white/90 bg-black/50 backdrop-blur-sm px-1.5 py-0.5"
              >
                Nº {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Download Button */}
      {event?.google_drive_folder && (
        <div className="mt-10 text-center">
          <p className={`font-oswald text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Download Full Resolution
          </p>
          <a
            href={event.google_drive_folder}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex"
          >
            <Download size={14} />
            Download Originals
            <ExternalLink size={12} className="opacity-60" />
          </a>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2"
              onClick={(e) => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft size={32} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl max-h-[85vh] mx-auto px-16"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={images[lightboxIndex]?.url}
                alt={images[lightboxIndex]?.caption}
                className="max-w-full max-h-[80vh] object-contain mx-auto block"
              />
              <p className="text-center font-oswald text-xs tracking-widest text-white/50 uppercase mt-4">
                Nº {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')} — {images[lightboxIndex]?.caption}
              </p>
            </motion.div>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-2"
              onClick={(e) => { e.stopPropagation(); next() }}
            >
              <ChevronRight size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}