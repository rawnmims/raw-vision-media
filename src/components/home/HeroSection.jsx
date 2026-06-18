import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Camera, Video } from 'lucide-react'
import JoinRawModal from '../forms/JoinRawModal'
import CoverageModal from '../forms/CoverageModal'
import { formService } from '../../services/formService'
import { getGDriveVideoEmbedUrl, getImageUrl, isGoogleDriveUrl } from '../../utils/helpers'
import Swal from 'sweetalert2'

/**
 * HeroSection — video background loaded from website_settings.hero_video
 *
 * HOW TO SET YOUR HERO VIDEO (Admin → Settings → Hero Video URL):
 *
 * Option A — Google Drive video:
 *   1. Upload your video to Google Drive
 *   2. Right-click → Share → "Anyone with the link" → Copy link
 *   3. Paste into Admin → Settings → Hero Video URL
 *   The video will play via Google Drive's embed player.
 *
 * Option B — Direct video file URL (MP4):
 *   Paste any direct .mp4 URL and it plays natively in the browser.
 *
 * Option C — No video:
 *   Leave blank. The hero_image (poster) is shown as a static background.
 *
 * HOW TO SET YOUR HERO BACKGROUND IMAGE:
 *   Same as above — paste a Google Drive sharing link or any direct image URL
 *   into Admin → Settings → Hero Image URL field.
 */
export default function HeroSection() {
  const [joinOpen, setJoinOpen] = useState(false)
  const [coverageOpen, setCoverageOpen] = useState(false)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    formService.getSettings()
      .then(d => { if (d) setSettings(d) })
      .catch(() => {})
  }, [])

  // Resolve hero video source
  const rawVideoUrl = settings?.hero_video || ''
  const isDriveVideo = isGoogleDriveUrl(rawVideoUrl)
  const driveEmbedUrl = isDriveVideo ? getGDriveVideoEmbedUrl(rawVideoUrl) : ''
  const directVideoUrl = !isDriveVideo && rawVideoUrl ? rawVideoUrl : ''

  // Resolve hero background image
  const rawImageUrl = settings?.hero_image ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80'
  const heroImageUrl = getImageUrl(rawImageUrl)

  const heading    = settings?.hero_heading    || 'RAW'
  const subheading = settings?.hero_subheading || 'Frames Speak Louder.'

  return (
    <>
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-raw-black">

        {/* ── Video layer ─────────────────────────────────── */}

        {/* Google Drive video — via iframe embed */}
        {isDriveVideo && driveEmbedUrl && (
          <iframe
            src={driveEmbedUrl}
            className="absolute inset-0 w-full h-full pointer-events-none border-0"
            style={{ transform: 'scale(1.05)' }} // slight zoom to hide letterboxing
            allow="autoplay"
            title="Hero video"
          />
        )}

        {/* Direct MP4 video */}
        {directVideoUrl && (
          <video
            className="video-bg"
            autoPlay
            loop
            muted
            playsInline
            poster={heroImageUrl}
          >
            <source src={directVideoUrl} type="video/mp4" />
          </video>
        )}

        {/* Static background image (fallback or no video) */}
        {!rawVideoUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
        )}

        {/* ── Overlays ────────────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />

        {/* ── Content ─────────────────────────────────────── */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">

          {/* Top badge */}
          <motion.div
            className="absolute top-8 left-6 md:left-12 lg:left-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="font-oswald text-xs tracking-[0.3em] text-white/60 uppercase">
              NMIMS Shirpur · Est. 2016
            </span>
          </motion.div>

          {/* RAW logotype */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-condensed text-[6rem] md:text-[9rem] lg:text-[12rem] leading-none text-white">
                RAW
              </span>
            </div>

            <motion.div
              className="flex items-center gap-4 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="h-px bg-white/40 w-12" />
              <span className="font-oswald text-sm md:text-base tracking-[0.25em] text-white/80 uppercase">
                Vision Media Club
              </span>
            </motion.div>

            <motion.p
              className="font-serif text-2xl md:text-4xl text-white/90 italic mt-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              {subheading}
            </motion.p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button
              onClick={() => {
                if (!settings?.join_raw_open) {
                  Swal.fire({
                    icon: 'info',
                    title: 'Applications Closed',
                    text: 'RAW Vision Media Club recruitment is currently closed.',
                    confirmButtonText: 'OK'
                  })
                  return
                }

                setJoinOpen(true)
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-raw-black font-oswald text-xs tracking-widest uppercase transition-all hover:bg-raw-accent"
            >
              <Camera size={14} /> Join RAW
            </button>
            <button
              onClick={() => {
                if (!settings?.coverage_open) {
                  Swal.fire({
                    icon: 'info',
                    title: 'Coverage Closed',
                    text: 'Coverage requests are currently not being accepted.',
                    confirmButtonText: 'OK'
                  })
                  return
                }

                setCoverageOpen(true)
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-transparent text-white border border-white font-oswald text-xs tracking-widest uppercase transition-all hover:bg-white hover:text-raw-black"
            >
              <Video size={14} /> Request Coverage
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 right-8 md:right-12 lg:right-20 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span
              className="font-oswald text-[10px] tracking-[0.3em] text-white/50 uppercase"
              style={{ writingMode: 'vertical-rl' }}
            >
              Scroll
            </span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown size={16} className="text-white/50" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <JoinRawModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
      <CoverageModal isOpen={coverageOpen} onClose={() => setCoverageOpen(false)} />
    </>
  )
}
