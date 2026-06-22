import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Download, ExternalLink, FolderOpen, AlertCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { GALLERY_IMAGES } from '../../utils/constants'
import { extractGDriveFolderId } from '../../utils/helpers'

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

function getDriveEmbedUrl(driveUrl) {
  const folderId = extractGDriveFolderId(driveUrl)
  if (!folderId) return null
  let url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`
  const resourceKeyMatch = driveUrl?.match(/[?&]resourcekey=([^&]+)/)
  if (resourceKeyMatch) url += `&resourcekey=${resourceKeyMatch[1]}`
  return url
}

export default function EventGallery({ event }) {
  const { isDark } = useTheme()
  const accent = getEditionHex(event?.category, event?.featured)
  const embedUrl = event?.google_drive_folder ? getDriveEmbedUrl(event.google_drive_folder) : null

  if (event?.google_drive_folder) {
    return (
      <div>
        <div className={`rounded-[8px] overflow-hidden border-2 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 border-b-2"
            style={{ borderColor: accent, backgroundColor: isDark ? '#1A1A1A' : '#F5F0E8' }}
          >
            <div className="flex items-center gap-2">
              <FolderOpen size={14} style={{ color: accent }} />
              <span className={`font-oswald text-[11px] tracking-[0.2em] uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Live from Drive — click any folder to browse inside it
              </span>
            </div>
            <a
              href={event.google_drive_folder}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-1 font-oswald text-[10px] tracking-widest uppercase whitespace-nowrap ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
            >
              Open in Drive <ExternalLink size={10} />
            </a>
          </div>

          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${event.title} — Drive folder`}
              className="w-full"
              style={{ height: '70vh', minHeight: 480, border: 0, display: 'block' }}
              loading="lazy"
            />
          ) : (
            <p className={`p-4 font-serif italic text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Couldn&apos;t read a folder ID from that link.
            </p>
          )}

          <p className={`flex items-center gap-1.5 px-4 py-2 font-oswald text-[10px] tracking-widest uppercase ${isDark ? 'text-gray-600 bg-raw-black' : 'text-gray-400 bg-raw-white'}`}>
            <AlertCircle size={11} />
            Not loading? Some browsers block embedded folders — use &quot;Open in Drive&quot; above instead.
          </p>
        </div>

        <div className="mt-8 text-center">
          <a href={event.google_drive_folder} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
            <Download size={14} />
            Download Originals
            <ExternalLink size={12} className="opacity-60" />
          </a>
        </div>
      </div>
    )
  }

  return <SampleGallery event={event} accent={accent} isDark={isDark} />
}

function SampleGallery({ event, accent, isDark }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)
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
      <p className={`font-oswald text-[10px] tracking-widest uppercase mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        No Drive folder linked yet — showing sample photos
      </p>
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
              <span className="absolute bottom-2 left-2 font-oswald text-[10px] tracking-widest text-white/90 bg-black/50 backdrop-blur-sm px-1.5 py-0.5">
                Nº {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

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
            <button className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2" onClick={closeLightbox}>
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
                {lightboxIndex + 1} / {images.length} — {images[lightboxIndex]?.caption}
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