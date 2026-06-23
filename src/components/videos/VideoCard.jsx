import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Instagram } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import {
  getVideoEmbedUrl,
  detectVideoType,
  getVideoThumbnail,
  getYouTubeThumbnailFallbackUrl,
} from '../../utils/helpers'

// ─────────────────────────────────────────────
// Single portrait card — same format for all videos
// ─────────────────────────────────────────────
export function VideoCard({ video, index = 0, onClick }) {
  const videoType = detectVideoType(video.video_url)
  const thumbSrc = getVideoThumbnail(video)

  const handleImgError = (e) => {
    // YouTube: try hqdefault if maxresdefault 404s
    if (videoType === 'youtube') {
      const fallback = getYouTubeThumbnailFallbackUrl(video.video_url)
      if (fallback && e.target.src !== fallback) {
        e.target.src = fallback
        return
      }
    }
    e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className="relative flex-none cursor-pointer group"
      style={{ width: '240px', aspectRatio: '3/4' }}
    >
      <div className="relative w-full h-full overflow-hidden rounded-xl">
        {/* Thumbnail */}
        <img
          src={thumbSrc}
          alt={video.title}
          onError={handleImgError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Play — top right */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/50 bg-black/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <Play size={12} className="text-white ml-0.5" fill="white" />
        </div>

        {/* Platform badge — top left */}
        {videoType === 'instagram' && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
            <Instagram size={9} className="text-white" />
            <span className="text-[9px] tracking-widest text-white uppercase font-medium">Reel</span>
          </div>
        )}
        {videoType === 'youtube' && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-600 rounded-full">
            <span className="text-[9px] tracking-widest text-white uppercase font-medium">YouTube</span>
          </div>
        )}

        {/* Text — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {video.category && (
            <p className="text-[9px] tracking-widest uppercase text-white/55 mb-1.5">
              {video.category}
            </p>
          )}
          <h3 className="text-base font-black text-white leading-tight uppercase tracking-wide line-clamp-2">
            {video.title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Horizontal scrolling grid + lightbox
// ─────────────────────────────────────────────
export function VideoGrid({ videos, loading }) {
  const { isDark } = useTheme()
  const [activeVideo, setActiveVideo] = useState(null)

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-none rounded-xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
            style={{ width: '240px', aspectRatio: '3/4' }}
          />
        ))}
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className={`font-display text-2xl italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No videos yet.
        </p>
      </div>
    )
  }

  const videoType = activeVideo ? detectVideoType(activeVideo.video_url) : null
  const embedUrl = activeVideo ? getVideoEmbedUrl(activeVideo.video_url) : null
  const isInstagram = videoType === 'instagram'

  return (
    <>
      {/* Horizontal scroll strip */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        <div className="no-scrollbar flex gap-4">
          {videos.map((v, i) => (
            <VideoCard
              key={v.id}
              video={v}
              index={i}
              onClick={() => setActiveVideo(v)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
              onClick={() => setActiveVideo(null)}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full mx-auto px-4 ${isInstagram ? 'max-w-sm' : 'max-w-5xl'}`}
            >
              {isInstagram ? (
                <div style={{ paddingBottom: '177%', position: 'relative' }}>
                  <iframe
                    src={`${embedUrl}?autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title={activeVideo.title}
                  />
                </div>
              ) : (
                <div className="aspect-video">
                  <iframe
                    src={videoType === 'youtube' ? `${embedUrl}?autoplay=1` : embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={activeVideo.title}
                  />
                </div>
              )}
              <p className="text-center font-oswald text-sm tracking-widest text-white/60 uppercase mt-4">
                {activeVideo.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}