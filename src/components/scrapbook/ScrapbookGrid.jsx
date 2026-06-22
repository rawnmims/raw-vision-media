import { useState } from 'react'
import { getImageUrl } from '../../utils/helpers'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/* ─── Repeating mosaic span pattern (4-col grid) ─── */
const SPAN_PATTERN = [
  { col: 'span 2', row: 'span 2' }, // large
  { col: 'span 1', row: 'span 1' }, // small
  { col: 'span 1', row: 'span 2' }, // tall
  { col: 'span 1', row: 'span 1' }, // small
  { col: 'span 1', row: 'span 1' }, // small
  { col: 'span 2', row: 'span 1' }, // wide
  { col: 'span 1', row: 'span 1' }, // small
  { col: 'span 1', row: 'span 2' }, // tall
  { col: 'span 2', row: 'span 1' }, // wide
  { col: 'span 1', row: 'span 1' }, // small
  { col: 'span 1', row: 'span 1' }, // small
  { col: 'span 1', row: 'span 2' }, // tall
]

export function PhotoCard({ photo, onClick, index }) {
  const span = SPAN_PATTERN[index % SPAN_PATTERN.length]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      onClick={onClick}
      style={{
        gridColumn: span.col,
        gridRow: span.row,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#111',
      }}
    >
      <img
        src={getImageUrl(photo.image_url)}
        alt={photo.caption}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
        loading="lazy"
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />

      {/* hover overlay */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '16px' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0'}
      >
        <ZoomIn size={18} color="white" style={{ marginBottom: '8px' }} />
        {photo.caption && (
          <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'center', margin: 0 }}>
            {photo.caption}
          </p>
        )}
      </div>

      {/* featured badge */}
      {photo.featured && (
        <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
          <span style={{ background: '#c0392b', color: '#fff', fontFamily: "'Oswald', sans-serif", fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '2px 7px' }}>
            Featured
          </span>
        </div>
      )}

      {/* frame number */}
      <span style={{ position: 'absolute', bottom: '6px', right: '8px', fontFamily: "'Oswald', sans-serif", fontSize: '8px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
        {String(index + 1).padStart(2, '0')}
      </span>
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
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: '1.5rem', color: isDark ? '#555' : '#aaa' }}>
          No photos yet.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ── mosaic grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '180px', gap: '4px' }}>
        {photos.map((photo, i) => (
          <PhotoCard key={photo.id} photo={photo} index={i} onClick={() => setLightboxIndex(i)} />
        ))}
      </div>

      {/* ── lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* close */}
            <button
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
              onClick={() => setLightboxIndex(null)}
            >
              <X size={24} />
            </button>

            {/* prev */}
            <button
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '8px' }}
              onClick={e => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft size={28} />
            </button>

            {/* image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ padding: '0 72px', maxWidth: '1000px', width: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              {/* editorial top bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  RAW Vision Media
                </span>
                <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)' }}>
                  {String(lightboxIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                </span>
              </div>

              <img
                src={photos[lightboxIndex]?.image_url}
                alt={photos[lightboxIndex]?.caption}
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', margin: '0 auto', display: 'block' }}
              />

              {photos[lightboxIndex]?.caption && (
                <p style={{ textAlign: 'center', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '16px' }}>
                  {photos[lightboxIndex].caption}
                </p>
              )}
            </motion.div>

            {/* next */}
            <button
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '8px' }}
              onClick={e => { e.stopPropagation(); next() }}
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}