import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { ScrapbookGrid } from '../components/scrapbook/ScrapbookGrid'
import { useTheme } from '../context/ThemeContext'
import { scrapbookService } from '../services/formService'
import { SAMPLE_SCRAPBOOK } from '../utils/constants'
import { Helmet } from 'react-helmet-async'

export default function Scrapbook() {
  const { isDark } = useTheme()
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    scrapbookService.getPhotos()
      .then(data => setPhotos(data.length > 0 ? data : SAMPLE_SCRAPBOOK))
      .catch(() => setPhotos(SAMPLE_SCRAPBOOK))
      .finally(() => setLoading(false))
  }, [])

  const displayed = filter === 'featured' ? photos.filter(p => p.featured) : photos

  return (
    <MainLayout>
      <Helmet>
        <title>Scrapbook | RAW Vision Media</title>

        <meta
          name="description"
          content="A collection of candid memories, behind-the-scenes moments and unforgettable experiences captured by RAW Vision Media."
        />
        <link
          rel="canonical"
          href="https://rawvisionmedia.in/scrapbook"
        />

      </Helmet>
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-[#FAFAFA]'}`}>
        {/* Header */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-12 pb-8 px-6`}>
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="section-eyebrow mb-2">Best of RAW</p>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h1 className={`editorial-heading text-5xl md:text-7xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>Scrapbook</h1>
                <p className={`font-serif text-lg italic pb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {displayed.length} photographs
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} px-6 py-4`}>
          <div className="max-w-7xl mx-auto flex gap-3">
            {['all', 'featured'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-oswald text-xs tracking-widest uppercase px-4 py-2 border transition-all
                  ${filter === f
                    ? isDark ? 'bg-white text-black border-white' : 'bg-raw-ink text-white border-raw-ink'
                    : isDark ? 'border-gray-700 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:border-gray-500'
                  }`}
              >
                {f === 'all' ? 'All Photos' : 'Featured'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {loading ? (
            <div className="masonry-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`masonry-item animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} style={{ height: `${200 + Math.random() * 150}px` }} />
              ))}
            </div>
          ) : (
            <ScrapbookGrid photos={displayed} />
          )}
        </div>
      </div>
    </MainLayout>
  )
}
