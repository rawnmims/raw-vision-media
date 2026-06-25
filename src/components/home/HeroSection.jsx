import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Video, ArrowRight } from 'lucide-react'
import Swal from 'sweetalert2'
import JoinRawModal from '../forms/JoinRawModal'
import CoverageModal from '../forms/CoverageModal'
import { formService } from '../../services/formService'
import heroVideo from '../../assets/hero-video.mp4'
import rLogo from '../../assets/r.png'
import aLogo from '../../assets/a.png'
import wLogo from '../../assets/w.png'

export default function HeroSection() {
  const [joinOpen, setJoinOpen] = useState(false)
  const [coverageOpen, setCoverageOpen] = useState(false)
  const [joinHover, setJoinHover] = useState(false)
  const [coverageHover, setCoverageHover] = useState(false)
  const [settings, setSettings] = useState({})

  useEffect(() => {
    formService.getSettings()
      .then(d => { if (d) setSettings(d) })
      .catch(() => {})
  }, [])

  const handleJoinClick = () => {
    if (!settings?.join_raw_open) {
      Swal.fire({ icon: 'info', title: 'Applications Closed', text: 'RAW Vision Media Club recruitment is currently closed.', confirmButtonText: 'OK' })
      return
    }
    setJoinOpen(true)
  }

  const handleCoverageClick = () => {
    if (!settings?.coverage_open) {
      Swal.fire({ icon: 'info', title: 'Coverage Closed', text: 'Coverage requests are currently not being accepted.', confirmButtonText: 'OK' })
      return
    }
    setCoverageOpen(true)
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 80, skewY: 6 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: {
        duration: 0.9,
        delay: 0.1 + i * 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <>
      <section className="
        relative
        w-full
        h-[75vh]
        md:h-screen
        min-h-[520px]
        md:min-h-[600px]
        overflow-hidden
        bg-raw-black
      ">

        {/* ── Video ───────────────────────────────────────── */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* ── Overlays ────────────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/88" />
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 28%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0) 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" style={{ height: '30%' }} />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />

        {/* ── Content ─────────────────────────────────────── */}
        <div className="relative z-10 h-full flex flex-col justify-end md:justify-end pb-4 md:pb-20 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto">
          {/* Top badge */}
          <motion.div
            className="absolute top-8 left-6 md:left-12 lg:left-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="font-oswald text-lg tracking-[0.3em] text-white/60 uppercase">
              NMIMS Shirpur · Est. 2016
            </span>
          </motion.div>

          {/* RAW logotype */}
          <div>
            <div className="flex items-end gap-0 md:gap-1 mb-3 overflow-hidden">
              {[rLogo, aLogo, wLogo].map((src, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    scale: 1.06,
                    filter: 'brightness(1.15)',
                    transition: { duration: 0.25, ease: 'easeOut' }
                  }}
                  style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
                >
                  <img
                    src={src}
                    alt={['R', 'A', 'W'][i]}
                    className="h-12 sm:h-16 md:h-20 lg:h-20 w-auto object-contain"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex items-center gap-4 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
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
              transition={{ duration: 1, delay: 0.75 }}
            >
              Frames Speak Louder.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
          >
            {/* Join RAW */}
            <button
              onClick={handleJoinClick}
              onMouseEnter={() => setJoinHover(true)}
              onMouseLeave={() => setJoinHover(false)}
              className="relative overflow-hidden flex items-center justify-between gap-3 px-5 md:px-7 py-3 md:py-4 font-oswald text-base sm:text-lg tracking-widest uppercase w-full sm:w-[220px]"
              style={{ background: '#f5f0e8', color: '#0A0A0A' }}
            >
              <motion.span
                className="absolute inset-0 bg-raw-accent"
                initial={{ x: '-100%' }}
                animate={{ x: joinHover ? '0%' : '-100%' }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ zIndex: 0 }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                <Camera size={14} />
                Join RAW
              </span>
              <motion.span
                className="relative z-10"
                animate={{ x: joinHover ? 4 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowRight size={13} />
              </motion.span>
            </button>

            {/* Request Coverage */}
            <button
              onClick={handleCoverageClick}
              onMouseEnter={() => setCoverageHover(true)}
              onMouseLeave={() => setCoverageHover(false)}
              className="relative overflow-hidden flex items-center justify-between gap-3 px-5 md:px-7 py-3 md:py-4 font-oswald text-base sm:text-lg tracking-widest uppercase border border-white text-white w-full sm:w-[270px]"
            >
              <motion.span
                className="absolute inset-0 bg-[#f5f0e8]"
                initial={{ x: '100%' }}
                animate={{ x: coverageHover ? '0%' : '100%' }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ zIndex: 0 }}
              />
              <motion.span
                className="relative z-10 flex items-center gap-2.5"
                animate={{ color: coverageHover ? '#0A0A0A' : '#ffffff' }}
                transition={{ duration: 0.2, delay: coverageHover ? 0.1 : 0 }}
              >
                <Video size={14} />
                Request Coverage
              </motion.span>
              <motion.span
                className="relative z-10"
                animate={{
                  x: coverageHover ? 4 : 0,
                  color: coverageHover ? '#f5f0e8' : '#ffffff'
                }}
                transition={{ duration: 0.25 }}
              >
                <ArrowRight size={13} />
              </motion.span>
            </button>
          </motion.div>
        </div>
      </section>

      <JoinRawModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
      <CoverageModal isOpen={coverageOpen} onClose={() => setCoverageOpen(false)} />
    </>
  )
}