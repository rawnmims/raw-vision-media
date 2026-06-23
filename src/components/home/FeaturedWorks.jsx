import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { scrapbookService } from '../../services/formService'
import { SAMPLE_SCRAPBOOK } from '../../utils/constants'

/* ─── Fixed mosaic slot definitions for 6 photos ─── */
const FEATURED_SLOTS = [
  { gridColumn: '1 / 3', gridRow: '1 / 3' }, // [0] 2×2 large hero
  { gridColumn: '3 / 4', gridRow: '1 / 2' }, // [1] 1×1 small
  { gridColumn: '4 / 5', gridRow: '1 / 3' }, // [2] 1×2 tall right
  { gridColumn: '3 / 4', gridRow: '2 / 3' }, // [3] 1×1 small
  { gridColumn: '1 / 3', gridRow: '3 / 4' }, // [4] 2×1 wide bottom-left
  { gridColumn: '3 / 5', gridRow: '3 / 4' }, // [5] 2×1 wide bottom-right
]

export function FeaturedWorks() {
  const { isDark } = useTheme()
  const [photos, setPhotos] = useState(
    SAMPLE_SCRAPBOOK.filter(p => p.featured).slice(0, 6)
  )
  const [layoutMode, setLayoutMode] = useState('desktop')

  useEffect(() => {
    scrapbookService.getPhotos({ featured: true })
      .then(data => { if (data.length > 0) setPhotos(data.slice(0, 6)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth < 768) {
        setLayoutMode('mobile')
      } else if (window.innerWidth < 1024) {
        setLayoutMode('tablet')
      } else {
        setLayoutMode('desktop')
      }
    }

    resizeHandler()
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  const ink  = isDark ? '#f0ece4' : '#1a1a1a'
  const rule = isDark ? '#2a2520' : '#d4cec6'
  const bg   = isDark ? '#0d0d0d' : '#F5F0E8'

  return (
    <section style={{ padding: '80px 24px', background: bg }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── section header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: '32px', paddingBottom: '16px', borderBottom: `1px solid ${rule}`,
        }}>
          <div>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '15px', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#c0392b', margin: '0 0 6px' }}>
              Featured
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: ink, margin: 0, lineHeight: 1 }}>
              Selected Works
            </h2>
          </div>
          <Link
            to="/scrapbook"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: isDark ? '#6a6460' : '#9a9088', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = ink}
            onMouseLeave={e => e.currentTarget.style.color = isDark ? '#6a6460' : '#9a9088'}
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {/* ── responsive mosaic grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: layoutMode === 'desktop' ? 'repeat(4, 1fr)' : layoutMode === 'tablet' ? 'repeat(2, minmax(0, 1fr))' : '1fr',
          gridAutoRows: layoutMode === 'desktop' ? '200px' : '220px',
          gap: '8px',
        }}>
          {photos.slice(0, 6).map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.45 }}
              style={{
                ...(layoutMode === 'desktop' ? FEATURED_SLOTS[i] : {}),
                position: 'relative',
                overflow: 'hidden',
                background: bg,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: layoutMode === 'desktop' ? undefined : '220px',
              }}
            >
              <img
                src={photo.image_url}
                alt={photo.caption}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', transition: 'transform 0.7s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />

              {/* caption overlay */}
              <div
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)', opacity: 0, transition: 'opacity 0.35s', display: 'flex', alignItems: 'flex-end', padding: '14px' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                  {photo.caption}
                </p>
              </div>

              {/* featured badge */}
              {photo.featured && (
                <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                  <span style={{ background: '#c0392b', color: '#fff', fontFamily: "'Oswald', sans-serif", fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '2px 7px' }}>
                    Featured
                  </span>
                </div>
              )}

              {/* frame number */}
              <span style={{ position: 'absolute', bottom: '6px', right: '8px', fontFamily: "'Oswald', sans-serif", fontSize: '8px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}