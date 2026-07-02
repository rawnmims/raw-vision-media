import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { VideoGrid } from '../components/videos/VideoCard'
import { useTheme } from '../context/ThemeContext'
import { videoService } from '../services/formService'
import { Helmet } from 'react-helmet-async'

export default function Videos() {
  const { isDark } = useTheme()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    videoService.getVideos()
      .then(data => setVideos(data))
      .catch(err => {
        console.error('Videos fetch error:', err)
        setVideos([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <MainLayout>
      <Helmet>
        <title>Videos | RAW Vision Media</title>

        <meta
          name="description"
          content="Watch official productions, promotional videos and event films created by RAW Vision Media."
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://rawvisionmedia.in/videos"
        />

        <meta property="og:title" content="Videos | RAW Vision Media" />
        <meta property="og:image" content="https://rawvisionmedia.in/og-image.jpg" />
      </Helmet>
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-[#FAFAFA]'}`}>
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-12 pb-8 px-6`}>
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="section-eyebrow mb-2">Visual Stories</p>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h1 className={`editorial-heading text-5xl md:text-7xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                  Videos
                </h1>
                <p className={`font-serif text-lg italic pb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aftermovies · Reels · Highlights
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <VideoGrid videos={videos} loading={loading} />
        </div>
      </div>
    </MainLayout>
  )
}