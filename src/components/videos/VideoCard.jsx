import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Instagram } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { getVideoEmbedUrl, getImageUrl, detectVideoType } from '../../utils/helpers'

/**
 * VideoCard — supports YouTube, Instagram Reels, and Google Drive videos.
 * Admin just pastes any link — detection is automatic.
 *
 * For Instagram:
 *   - Paste the Reel/Post URL from Instagram (the "Copy Link" URL)
 *   - Embeds work on real domains only (not localhost)
 *   - On localhost, Instagram shows a "View on Instagram" fallback
 */
export function VideoCard({ video, index = 0, featured = false }) {
  const { isDark } = useTheme()
  const [playing, setPlaying] = useState(false)

  const videoType = detectVideoType(video.video_url)
  const embedUrl  = getVideoEmbedUrl(video.video_url)
  const thumbUrl  = getImageUrl(video.thumbnail)

  const isInstagram = videoType === 'instagram'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={`group ${featured ? 'col-span-full' : ''}`}
    >
      {/* Thumbnail / click-to-play */}
      <div
        className={`relative overflow-hidden cursor-pointer ${featured ? 'aspect-[21/9]' : 'aspect-video'}`}
        onClick={() => setPlaying(true)}
      >
        <img
          src={thumbUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center"
          >
            <Play size={24} className="text-white ml-1" fill="white" />
          </motion.div>
          {/* Platform badge */}
          {isInstagram && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
              <Instagram size={12} className="text-white" />
              <span className="font-oswald text-[10px] tracking-widest text-white uppercase">Instagram Reel</span>
            </div>
          )}
          {videoType === 'youtube' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded-full">
              <span className="font-oswald text-[10px] tracking-widest text-white uppercase">YouTube</span>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className={`mt-4 border-t-2 pt-3 ${isDark ? 'border-gray-700' : 'border-gray-200'} group-hover:border-raw-accent transition-colors`}>
        <h3 className={`font-display ${featured ? 'text-xl' : 'text-base'} font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
          {video.title}
        </h3>
      </div>

      {/* Lightbox player */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(false)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
              onClick={() => setPlaying(false)}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`w-full mx-auto px-4 ${isInstagram ? 'max-w-sm' : 'max-w-5xl'}`}
            >
              {isInstagram ? (
                /* Instagram embed — portrait ratio */
                <div style={{ paddingBottom: '177%', position: 'relative' }}>
                  <iframe
                    src={`${embedUrl}?autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title={video.title}
                  />
                </div>
              ) : (
                /* YouTube / Drive / direct — 16:9 */
                <div className="aspect-video">
                  <iframe
                    src={videoType === 'youtube' ? `${embedUrl}?autoplay=1` : embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                </div>
              )}

              <p className="text-center font-oswald text-sm tracking-widest text-white/60 uppercase mt-4">
                {video.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function VideoGrid({ videos, loading }) {
  const { isDark } = useTheme()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="aspect-video bg-gray-300/20 mb-4" />
            <div className={`h-4 w-3/4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className={`font-display text-2xl italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No videos yet.</p>
      </div>
    )
  }

  const [featured, ...rest] = videos

  return (
    <div className="space-y-10">
      {featured && <VideoCard video={featured} featured />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
      </div>
    </div>
  )
}
