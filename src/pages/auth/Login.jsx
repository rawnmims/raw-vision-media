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
import { Helmet } from 'react-helmet-async'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const validators = {
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
    password: v => v.length >= 6 ? '' : 'Password must be at least 6 characters.',
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' }))
  }

  const handleBlur = e => {
    const { name, value } = e.target
    if (validators[name] && value) {
      setFieldErrors(p => ({ ...p, [name]: validators[name](value) }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = {}
    Object.entries(validators).forEach(([field, validate]) => {
      if (form[field]) {
        const msg = validate(form[field])
        if (msg) newErrors[field] = msg
      }
    })
    if (Object.keys(newErrors).length > 0) { setFieldErrors(newErrors); return }

    setLoading(true)
    setError('')
    try {
      await signIn(form)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const formBg = isDark ? 'bg-raw-black text-white' : 'bg-raw-white text-raw-ink'
  const inputBorder = (field) => fieldErrors[field]
    ? 'border-red-500 text-current placeholder-gray-400'
    : isDark
      ? 'border-gray-700 text-white placeholder-gray-600 focus:border-white'
      : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-ink'

  const FieldError = ({ field }) => fieldErrors[field]
    ? <p className="font-oswald text-[10px] tracking-wider uppercase mt-1.5 text-red-500">{fieldErrors[field]}</p>
    : null

  const letterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.8, delay: 0.1 + i * 0.08, ease: 'easeOut' },
    }),
  }

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${formBg}`}>
      <Helmet>
        <title>Login | RAW Vision Media</title>

        <meta
          name="description"
          content="Login to your RAW Vision Media account."
        />

        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Left — Cinematic Video Panel (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 lg:fixed lg:left-0 lg:top-0 lg:h-screen relative overflow-hidden bg-raw-black">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline preload="auto">
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/45 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <p className="font-oswald text-xs tracking-[0.3em] text-white/50 uppercase">NMIMS Shirpur · Est. 2016</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
            <div className="flex items-end gap-0 mb-4">
              {[rLogo, aLogo, wLogo].map((src, i) => (
                <motion.div key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible"
                  whileHover={{ scale: 1.06, filter: 'brightness(1.15)', transition: { duration: 0.25, ease: 'easeOut' } }}
                  style={{ display: 'inline-block', transformOrigin: 'bottom center' }}>
                  <img src={src} alt={['R', 'A', 'W'][i]} className="h-20 xl:h-28 w-auto object-contain" />
                </motion.div>
              ))}
            </div>
            <p className="font-oswald text-sm tracking-[0.25em] text-white/70 uppercase mb-1">Vision Media Club</p>
            <div className="h-px w-16 bg-raw-accent mb-4" />
            <p className="font-serif text-2xl italic text-white/80">Frames Speak Louder.</p>
          </motion.div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className={`w-full lg:w-1/2 lg:ml-[50%] flex flex-col justify-center min-h-screen px-6 sm:px-12 lg:px-16 xl:px-20 py-10 relative ${formBg}`}>
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        {/* Mobile Brand */}
        <div className="lg:hidden mb-10 text-center">
          <div className="flex items-end gap-0 justify-center mb-2">
            {[isDark ? rLogo : rBlackLogo, isDark ? aLogo : aBlackLogo, isDark ? wLogo : wBlackLogo].map((src, i) => (
              <img key={i} src={src} alt={['R', 'A', 'W'][i]} className="h-10 sm:h-12 w-auto object-contain" />
            ))}
          </div>
          <p className={`font-oswald text-xs tracking-[0.25em] uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Vision Media Club · NMIMS Shirpur
          </p>
        </div>

        <motion.div
          className="w-full max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-8 sm:mb-10">
            <p className={`font-oswald text-xs tracking-[0.25em] uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Welcome Back
            </p>
            <h1 className={`font-display text-3xl sm:text-4xl font-bold leading-tight ${isDark ? 'text-white' : 'text-raw-ink'}`}>
              Sign In To RAW Vision Media
            </h1>
            <p className={`font-serif text-base italic mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter The Archives
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <label className={`font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} onBlur={handleBlur}
                required placeholder="yourname@gmail.com"
                className={`w-full py-3 bg-transparent border-b outline-none font-sans text-sm transition-colors ${inputBorder('email')}`}
              />
              <FieldError field="email" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className={`font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Password</label>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange} onBlur={handleBlur}
                  required placeholder="••••••••"
                  className={`w-full py-3 bg-transparent border-b outline-none font-sans text-sm transition-colors pr-10 ${inputBorder('password')}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute right-0 top-3 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError field="password" />
              <div className="mt-2 text-right">
              </div>
            </motion.div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-oswald text-xs tracking-wider text-red-500 uppercase">
                {error}
              </motion.p>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 bg-raw-ink text-white font-oswald text-xs tracking-widest uppercase border border-raw-ink hover:bg-transparent hover:text-raw-ink dark:hover:text-white transition-all group disabled:opacity-60">
                <span>{loading ? 'Signing In...' : 'Enter The Archive'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </form>

          <motion.div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <p className={`font-oswald text-xs tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              New to RAW?{' '}
              <Link to="/signup" className={`underline underline-offset-4 transition-colors ${isDark ? 'text-white hover:text-raw-accent' : 'text-raw-ink hover:text-raw-accent'}`}>
                Create Account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
}