import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { formService } from '../../services/formService'
import { DEPARTMENTS } from '../../utils/constants'

export default function JoinRawModal({ isOpen, onClose }) {
  const { isDark } = useTheme()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', year: '', course: '',
    preference1: '', preference2: '', preference3: '',
    why_join: '', experience: '', creative_drive_link: ''
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Per-field validators
  const validators = {
    name: v => /^[a-zA-Z\s]+$/.test(v) ? '' : 'Name can only contain letters and spaces.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
    phone: v => /^[\d\s]+$/.test(v) ? '' : 'Phone number can only contain digits.',
    course: v => /^[a-zA-Z0-9.\-\s]+$/.test(v) ? '' : 'Course can only contain letters, numbers, spaces, dots, or hyphens.',
  }

  const handleChange = e => {
    const { name, value } = e.target

    // Restrict input characters on the fly
    if (name === 'name' && value && !/^[a-zA-Z\s]*$/.test(value)) return
    if (name === 'phone' && value && !/^[\d\s]*$/.test(value)) return
    if (name === 'course' && value && !/^[a-zA-Z0-9.\-\s]*$/.test(value)) return

    setForm(prev => ({ ...prev, [name]: value }))

    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = e => {
    const { name, value } = e.target
    if (validators[name] && value) {
      const msg = validators[name](value)
      setFieldErrors(prev => ({ ...prev, [name]: msg }))
    }
  }

  const getAvailableDepts = (exclude = []) => DEPARTMENTS.filter(d => !exclude.includes(d))

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Run all field validators
    const newErrors = {}
    Object.entries(validators).forEach(([field, validate]) => {
      if (form[field]) {
        const msg = validate(form[field])
        if (msg) newErrors[field] = msg
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      return
    }

    if (form.preference1 === form.preference2 || form.preference2 === form.preference3 || form.preference1 === form.preference3) {
      setError('Preferences must be different departments.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await formService.submitJoinApplication(form)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to submit. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputBase = `w-full mt-1 px-3 py-2 border text-sm bg-transparent outline-none transition-colors`
  const inputClass = (field) =>
    `${inputBase} ${fieldErrors[field]
      ? 'border-red-500'
      : isDark
        ? 'text-white border-gray-600 placeholder-gray-500 focus:border-raw-accent'
        : 'text-raw-ink border-gray-300 placeholder-gray-400 focus:border-raw-accent'
    }`
  const selectClass = `w-full mt-1 px-3 py-2 border text-sm bg-transparent outline-none transition-colors ${isDark ? 'text-white border-gray-600 focus:border-raw-accent' : 'text-raw-ink border-gray-300 focus:border-raw-accent'}`
  const labelClass = `font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`
  const bg = isDark ? 'bg-raw-darkgray text-white' : 'bg-white text-raw-ink'

  const FieldError = ({ field }) =>
    fieldErrors[field]
      ? <p className="text-red-500 font-oswald text-[10px] tracking-wider uppercase mt-1">{fieldErrors[field]}</p>
      : null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={`${bg} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 px-8 pt-8 pb-4 ${isDark ? 'bg-raw-darkgray' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`${labelClass} mb-1`}>Application</p>
                  <h2 className="font-display text-3xl font-bold">Join RAW Vision</h2>
                  <p className={`font-oswald text-xs tracking-wider mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
                    Media Club · NMIMS Shirpur
                  </p>
                </div>
                <button onClick={onClose} className={`p-1.5 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {success ? (
              <div className="px-8 py-16 text-center">
                <div className="font-condensed text-6xl mb-4">✓</div>
                <h3 className="font-display text-2xl font-bold mb-2">Application Submitted!</h3>
                <p className={`font-serif text-lg italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  We'll be in touch soon. Keep creating.
                </p>
                <button onClick={onClose} className="btn-primary mt-8">Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
                {/* Personal Info */}
                <div>
                  <h3 className={`font-condensed text-lg tracking-widest uppercase mb-6 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        name="name" value={form.name} onChange={handleChange} onBlur={handleBlur}
                        required placeholder="Your full name"
                        className={inputClass('name')}
                      />
                      <FieldError field="name" />
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur}
                        required placeholder="yourname@gmail.com"
                        className={inputClass('email')}
                      />
                      <FieldError field="email" />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input
                        name="phone" value={form.phone} onChange={handleChange} onBlur={handleBlur}
                        required placeholder="XXXXX XXXXX" maxLength={11}
                        className={inputClass('phone')}
                      />
                      <FieldError field="phone" />
                    </div>
                    <div>
                      <label className={labelClass}>Year *</label>
                      <select name="year" value={form.year} onChange={handleChange} required className={selectClass}>
                        <option value="">Select year</option>
                        {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Course *</label>
                      <input
                        name="course" value={form.course} onChange={handleChange} onBlur={handleBlur}
                        required placeholder="B.Tech CSE / MBA / etc."
                        className={inputClass('course')}
                      />
                      <FieldError field="course" />
                    </div>
                  </div>
                </div>

                {/* Department Preferences */}
                <div>
                  <h3 className={`font-condensed text-lg tracking-widest uppercase mb-6 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    Department Preferences
                  </h3>
                  <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Select 3 different departments in order of preference.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {['preference1', 'preference2', 'preference3'].map((pref, i) => (
                      <div key={pref}>
                        <label className={labelClass}>Preference {i + 1} *</label>
                        <select name={pref} value={form[pref]} onChange={handleChange} required className={selectClass}>
                          <option value="">Select</option>
                          {getAvailableDepts(
                            i === 0 ? [] :
                            i === 1 ? [form.preference1] :
                            [form.preference1, form.preference2]
                          ).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Questions */}
                <div>
                  <h3 className={`font-condensed text-lg tracking-widest uppercase mb-6 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    Application Questions
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className={`${labelClass} block mb-2`}>Why do you want to join RAW? *</label>
                      <textarea
                        name="why_join" value={form.why_join} onChange={handleChange} required
                        rows={4} placeholder="Tell us your story and motivation..."
                        className={`w-full p-3 border text-sm font-sans bg-transparent outline-none resize-none transition-colors ${isDark ? 'border-gray-600 text-white placeholder-gray-500 focus:border-raw-accent' : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-accent'}`}
                      />
                    </div>
                    <div>
                      <label className={`${labelClass} block mb-2`}>Previous Experience *</label>
                      <textarea
                        name="experience" value={form.experience} onChange={handleChange} required
                        rows={3} placeholder="Any prior experience in photography, videography, design, etc."
                        className={`w-full p-3 border text-sm font-sans bg-transparent outline-none resize-none transition-colors ${isDark ? 'border-gray-600 text-white placeholder-gray-500 focus:border-raw-accent' : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-accent'}`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Creative Work (Google Drive Link) *</label>
                      <div className="flex items-center gap-2">
                        <input
                          name="creative_drive_link" value={form.creative_drive_link} onChange={handleChange} required
                          placeholder="https://drive.google.com/..."
                          className={inputClass('creative_drive_link')}
                        />
                        <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 font-oswald text-xs tracking-wider uppercase">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}