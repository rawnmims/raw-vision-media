import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, X } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { formService } from '../../services/formService'
import { formatDateShort } from '../../utils/helpers'

export default function CoverageAdmin() {
  const { isDark } = useTheme()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    formService.getCoverageRequests()
      .then(d => setRequests(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
  const modalBg = isDark ? 'bg-[#111] text-white border-gray-800' : 'bg-white text-raw-ink border-gray-200'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="section-eyebrow mb-1">Incoming</p>
          <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Coverage Requests</h1>
          <p className={`font-serif text-sm italic mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{requests.length} pending requests</p>
        </div>

        <div className={`border ${cardBg}`}>
          <div className={`grid grid-cols-12 gap-4 px-5 py-3 border-b font-oswald text-xs tracking-widest uppercase ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <span className="col-span-4">Event</span>
            <span className="col-span-3 hidden sm:block">Committee</span>
            <span className="col-span-2 hidden md:block">Coverage</span>
            <span className="col-span-2 hidden md:block">Date</span>
            <span className="col-span-1 text-right">View</span>
          </div>

          {loading ? (
            <div className="py-10 text-center"><div className={`font-condensed text-xl animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading...</div></div>
          ) : requests.length === 0 ? (
            <div className="py-16 text-center">
              <p className={`font-display text-lg italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No coverage requests yet.</p>
            </div>
          ) : requests.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className={`grid grid-cols-12 gap-4 items-center px-5 py-4 border-b last:border-0 ${isDark ? 'border-gray-800 hover:bg-gray-900/40' : 'border-gray-100 hover:bg-gray-50'}`}>
              <div className="col-span-4">
                <p className={`font-display text-sm font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{req.event_name}</p>
                <p className={`font-oswald text-[10px] tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{req.venue}</p>
              </div>
              <p className={`col-span-3 font-sans text-xs hidden sm:block truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{req.committee}</p>
              <span className={`col-span-2 hidden md:block`}>
                <span className="font-oswald text-[10px] tracking-widest uppercase px-2 py-0.5 bg-raw-accent/20 text-raw-accent">{req.coverage_type}</span>
              </span>
              <p className={`col-span-2 font-oswald text-xs hidden md:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatDateShort(req.date)}</p>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => setSelected(req)} className={`p-1.5 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}><Eye size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className={`${modalBg} w-full max-w-lg max-h-[85vh] overflow-y-auto border`}>
            <div className={`sticky top-0 px-7 pt-6 pb-4 border-b ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'} flex justify-between`}>
              <div>
                <h2 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{selected.event_name}</h2>
                <p className={`font-oswald text-xs tracking-widest uppercase mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{selected.committee}</p>
              </div>
              <button onClick={() => setSelected(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="px-7 py-6 space-y-4">
              {[
                { label: 'Venue', value: selected.venue },
                { label: 'Event Date', value: formatDateShort(selected.date) },
                { label: 'Coverage Type', value: selected.coverage_type },
                { label: 'Contact Person', value: selected.contact_person },
                { label: 'Contact Email', value: selected.email },
                { label: 'Contact Phone', value: selected.phone },
                { label: 'Expected Crowd', value: selected.expected_crowd },
              ].map(item => (
                <div key={item.label} className={`flex gap-4 py-2 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                  <span className={`font-oswald text-xs tracking-widest uppercase w-32 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</span>
                  <span className={`font-sans text-sm ${isDark ? 'text-white' : 'text-raw-ink'}`}>{item.value || '—'}</span>
                </div>
              ))}
              <div>
                <p className={`font-oswald text-xs tracking-widest uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Description</p>
                <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{selected.description || '—'}</p>
              </div>
              {selected.special_requirements && (
                <div>
                  <p className={`font-oswald text-xs tracking-widest uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Special Requirements</p>
                  <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{selected.special_requirements}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
