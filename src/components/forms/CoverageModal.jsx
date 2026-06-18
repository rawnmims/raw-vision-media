import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { formService } from '../../services/formService'
import { COVERAGE_TYPES } from '../../utils/constants'

export default function CoverageModal({ isOpen, onClose }) {
  const { isDark } = useTheme()
  const [form, setForm] = useState({
    event_name: '', committee: '', venue: '', date: '',
    contact_person: '', email: '', phone: '',
    coverage_type: '', description: '', expected_crowd: '', special_requirements: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await formService.submitCoverageRequest(form)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `raw-input ${isDark ? 'text-white border-gray-600 placeholder-gray-500' : 'text-raw-ink border-gray-300 placeholder-gray-400'}`
  const selectClass = `raw-select ${isDark ? 'text-white border-gray-600' : 'text-raw-ink border-gray-300'}`
  const labelClass = `font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`
  const bg = isDark ? 'bg-raw-darkgray text-white' : 'bg-white text-raw-ink'

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
            <div className={`sticky top-0 z-10 px-8 pt-8 pb-4 ${isDark ? 'bg-raw-darkgray' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`${labelClass} mb-1`}>Coverage Request</p>
                  <h2 className="font-display text-3xl font-bold">Request Coverage</h2>
                  <p className={`font-oswald text-xs tracking-wider mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
                    RAW Vision Media · NMIMS Shirpur
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
                <h3 className="font-display text-2xl font-bold mb-2">Request Received!</h3>
                <p className={`font-serif text-lg italic ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Our team will contact you shortly to confirm the coverage.
                </p>
                <button onClick={onClose} className="btn-primary mt-8">Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
                {/* Event Details */}
                <div>
                  <h3 className={`font-condensed text-lg tracking-widest uppercase mb-6 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    Event Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Event Name *</label>
                      <input name="event_name" value={form.event_name} onChange={handleChange} required placeholder="Name of your event" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Organizing Committee *</label>
                      <input name="committee" value={form.committee} onChange={handleChange} required placeholder="Committee name" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Venue *</label>
                      <input name="venue" value={form.venue} onChange={handleChange} required placeholder="Event venue" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Event Date *</label>
                      <input name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Expected Crowd Size</label>
                      <input name="expected_crowd" value={form.expected_crowd} onChange={handleChange} required placeholder="e.g. 200-500" className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h3 className={`font-condensed text-lg tracking-widest uppercase mb-6 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Contact Person *</label>
                      <input name="contact_person" value={form.contact_person} onChange={handleChange} required placeholder="Full name" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Contact Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="email@nmims.in" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Contact Number *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Coverage Type *</label>
                      <select name="coverage_type" value={form.coverage_type} onChange={handleChange} required className={selectClass}>
                        <option value="">Select type</option>
                        {COVERAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h3 className={`font-condensed text-lg tracking-widest uppercase mb-6 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    Additional Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className={`${labelClass} block mb-2`}>Event Description *</label>
                      <textarea
                        name="description" value={form.description} onChange={handleChange} required
                        rows={3} placeholder="Describe your event briefly..."
                        className={`w-full p-3 border text-sm font-sans bg-transparent outline-none resize-none transition-colors ${isDark ? 'border-gray-600 text-white placeholder-gray-500 focus:border-raw-accent' : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-accent'}`}
                      />
                    </div>
                    <div>
                      <label className={`${labelClass} block mb-2`}>Special Requirements</label>
                      <textarea
                        name="special_requirements" value={form.special_requirements} onChange={handleChange} required
                        rows={2} placeholder="Any specific equipment or requirements..."
                        className={`w-full p-3 border text-sm font-sans bg-transparent outline-none resize-none transition-colors ${isDark ? 'border-gray-600 text-white placeholder-gray-500 focus:border-raw-accent' : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-accent'}`}
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 font-oswald text-xs tracking-wider uppercase">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                    {loading ? 'Submitting...' : 'Submit Request'}
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
