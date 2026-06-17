import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { VideoGrid } from '../components/videos/VideoCard'
import { useTheme } from '../context/ThemeContext'
import { videoService } from '../services/formService'
import { SAMPLE_VIDEOS } from '../utils/constants'

export default function Videos() {
  const { isDark } = useTheme()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    videoService.getVideos()
      .then(data => setVideos(data.length > 0 ? data : SAMPLE_VIDEOS))
      .catch(() => setVideos(SAMPLE_VIDEOS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <MainLayout>
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>
        {/* Header */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-12 pb-8 px-6`}>
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="section-eyebrow mb-2">Visual Stories</p>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h1 className={`editorial-heading text-5xl md:text-7xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>Videos</h1>
                <p className={`font-serif text-lg italic pb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aftermovies · Reels · Highlights
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <VideoGrid videos={videos} loading={loading} />
        </div>
      </div>
    </MainLayout>
  )
}
