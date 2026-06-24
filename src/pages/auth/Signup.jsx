import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from '../../components/common/ThemeToggle'
import heroVideo from '../../assets/hero-video.mp4'
import rLogo from '../../assets/r.png'
import aLogo from '../../assets/a.png'
import wLogo from '../../assets/w.png'
import rBlackLogo from '../../assets/r-black.png'
import aBlackLogo from '../../assets/a-black.png'
import wBlackLogo from '../../assets/w-black.png'

const ROLES = [
  { value: 'student',  label: 'Student',       domain: '@nmims.in', placeholder: 'yourname@nmims.in' },
  { value: 'faculty',  label: 'Faculty',        domain: '@nmims.edu', placeholder: 'yourname@nmims.edu' },
  { value: 'external', label: 'External User',  domain: '@gmail.com', placeholder: 'yourname@gmail.com' },
]

export default function Signup() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', role: 'student', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp }  = useAuth()
  const { isDark }  = useTheme()
  const navigate    = useNavigate()

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signUp(form)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const formBg     = isDark ? 'bg-raw-black text-white' : 'bg-raw-white text-raw-ink'
  const inputBorder = isDark
    ? 'border-gray-700 text-white placeholder-gray-600 focus:border-white'
    : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-ink'

  // Current role info for dynamic hints
  const currentRole    = ROLES.find(r => r.value === form.role)
  const emailPlaceholder = currentRole?.placeholder || 'your@email.com'
  const domainHint       = currentRole?.domain || ''

  const letterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.1 + i * 0.08, ease: 'easeOut' },
    }),
  }

  return (
    <div className={`min-h-screen flex ${formBg}`}>

      {/* Left — Cinematic Video Panel (desktop only) */}
      <div className="hidden lg:flex fixed left-0 top-0 w-1/2 h-screen overflow-hidden bg-raw-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay loop muted playsInline preload="auto"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/45 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <p className="font-oswald text-xs tracking-[0.3em] text-white/50 uppercase">NMIMS Shirpur · Est. 2016</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
            <div className="flex items-end gap-0 mb-4">
              {[rLogo, aLogo, wLogo].map((src, i) => (
                <motion.div
                  key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible"
                  whileHover={{ scale: 1.06, filter: 'brightness(1.15)', transition: { duration: 0.25, ease: 'easeOut' } }}
                  style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
                >
                  <img src={src} alt={['R', 'A', 'W'][i]} className="h-24 md:h-25 lg:h-34 w-auto object-contain" />
                </motion.div>
              ))}
            </div>
            <p className="font-oswald text-sm tracking-[0.25em] text-white/70 uppercase mb-1">Vision Media Club</p>
            <div className="h-px w-16 bg-raw-accent mb-4" />
            <p className="font-serif text-2xl italic text-white/80">Frames Speak Louder.</p>
          </motion.div>

    
        </div>
      </div>

      {/* Right — Signup Form */}
      <div className={`ml-[50%] flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 relative ${formBg}`}>
        <div className="absolute top-6 right-6"><ThemeToggle /></div>

        {/* Mobile Brand */}
        <div className="lg:hidden mb-10 text-center">
          <div className="flex items-end gap-0 justify-center mb-2">
            {[
              isDark ? rLogo : rBlackLogo,
              isDark ? aLogo : aBlackLogo,
              isDark ? wLogo : wBlackLogo,
            ].map((src, i) => (
              <img key={i} src={src} alt={['R','A','W'][i]} className="h-12 w-auto object-contain" />
            ))}
          </div>
          <p className={`font-oswald text-xs tracking-[0.25em] uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Vision Media Club · NMIMS Shirpur
          </p>
        </div>

        {success ? (
          <motion.div className="w-full max-w-sm mx-auto text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`font-condensed text-7xl mb-4 ${isDark ? 'text-white' : 'text-raw-ink'}`}>✓</div>
            <h2 className="font-display text-3xl font-bold mb-3">Account Created!</h2>
            <p className={`font-serif text-lg italic mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Check your email to verify your account, then sign in.
            </p>
            <Link to="/login" className="btn-primary inline-flex">Go To Sign In <ArrowRight size={14} /></Link>
          </motion.div>
        ) : (
          <motion.div className="w-full max-w-sm mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-8">
              <p className={`font-oswald text-xs tracking-[0.25em] uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Join The Club</p>
              <h1 className={`font-display text-4xl font-bold leading-tight ${isDark ? 'text-white' : 'text-raw-ink'}`}>Create Profile</h1>
              <p className={`font-serif text-base italic mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Join The Media Club</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label className={`font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Your full name"
                  className={`w-full py-3 bg-transparent border-b outline-none font-sans text-sm transition-colors ${inputBorder}`} />
              </motion.div>

              {/* Role — must come BEFORE email so placeholder updates */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className={`font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className={`w-full py-3 bg-transparent border-b outline-none font-sans text-sm transition-colors appearance-none cursor-pointer ${inputBorder}`}>
                  {ROLES.map(r => <option key={r.value} value={r.value} className="text-raw-ink">{r.label}</option>)}
                </select>
              </motion.div>

              {/* Email — placeholder and hint change with role */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className={`font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder={emailPlaceholder}
                  className={`w-full py-3 bg-transparent border-b outline-none font-sans text-sm transition-colors ${inputBorder}`}
                />
                {/* Domain requirement hint — updates live when role changes */}
                <motion.p
                  key={domainHint}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-oswald text-[10px] tracking-widest uppercase mt-1.5 text-raw-accent"
                >
                  Requires {domainHint} address
                </motion.p>
              </motion.div>

              {/* Phone */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <label className={`font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Phone Number</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX"
                  className={`w-full py-3 bg-transparent border-b outline-none font-sans text-sm transition-colors ${inputBorder}`} />
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className={`font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Password</label>
                <div className="relative">
                  <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange}
                    required minLength={6} placeholder="Min. 6 characters"
                    className={`w-full py-3 bg-transparent border-b outline-none font-sans text-sm transition-colors pr-10 ${inputBorder}`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className={`absolute right-0 top-3 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* Error */}
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-oswald text-xs tracking-wider text-red-500 uppercase">
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-between px-6 py-4 bg-raw-ink text-white font-oswald text-xs tracking-widest uppercase border border-raw-ink hover:bg-transparent hover:text-raw-ink dark:hover:text-white transition-all group disabled:opacity-60">
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </form>

            <motion.div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <p className={`font-oswald text-xs tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Already a member?{' '}
                <Link to="/login" className={`underline underline-offset-4 transition-colors ${isDark ? 'text-white hover:text-raw-accent' : 'text-raw-ink hover:text-raw-accent'}`}>
                  Sign In
                </Link>
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}