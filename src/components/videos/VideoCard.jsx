// VideoCard.jsx — complete replacement

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Instagram } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { getVideoEmbedUrl, getImageUrl, detectVideoType } from '../../utils/helpers'

export function VideoCard({ video, index = 0, onClick }) {
  const { isDark } = useTheme()
  const thumbUrl = getImageUrl(video.thumbnail)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="relative flex-none cursor-pointer group"
      style={{ width: '260px', aspectRatio: '3/4' }}
      onClick={onClick}
    >
      <div className="relative w-full h-full overflow-hidden rounded-xl">
        <img
          src={thumbUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Play button top-right */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Play size={12} className="text-white ml-0.5" fill="white" />
        </div>

        {/* Platform badge */}
        {video.video_url && detectVideoType(video.video_url) === 'instagram' && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
            <Instagram size={10} className="text-white" />
            <span className="text-[9px] tracking-widest text-white uppercase font-medium">Reel</span>
          </div>
        )}

        {/* Text bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {(video.category || video.tag) && (
            <p className="text-[9px] tracking-widest uppercase text-white/55 mb-1.5">
              {video.category || video.tag}
            </p>
          )}
          <h3 className="text-lg font-black text-white leading-tight uppercase tracking-wide">
            {video.title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
}

export function VideoGrid({ videos, loading }) {
  const { isDark } = useTheme()
  const [activeVideo, setActiveVideo] = useState(null)

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`flex-none rounded-xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
            style={{ width: '260px', aspectRatio: '3/4' }}
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
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        {videos.map((v, i) => (
          <VideoCard
            key={v.id}
            video={v}
            index={i}
            onClick={() => setActiveVideo(v)}
          />
        ))}
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
              onClick={e => e.stopPropagation()}
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