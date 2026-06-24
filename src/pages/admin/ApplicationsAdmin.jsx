import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, X, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { formService } from '../../services/formService'
import { formatDateShort } from '../../utils/helpers'

function exportToExcel(apps) {
  const rows = apps.map((app, i) => ({
    '#': i + 1,
    'Name': app.name || '',
    'Email': app.email || '',
    'Phone': app.phone || '',
    'Year': app.year || '',
    'Course': app.course || '',
    'Preference 1': app.preference1 || '',
    'Preference 2': app.preference2 || '',
    'Preference 3': app.preference3 || '',
    'Why Join RAW': app.why_join || '',
    'Experience': app.experience || '',
    'Creative Work Link': app.creative_drive_link || '',
    'Submitted On': app.created_at ? new Date(app.created_at).toLocaleString() : '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)

  // Column widths
  ws['!cols'] = [
    { wch: 4 },   // #
    { wch: 22 },  // Name
    { wch: 28 },  // Email
    { wch: 16 },  // Phone
    { wch: 10 },  // Year
    { wch: 20 },  // Course
    { wch: 18 },  // Pref 1
    { wch: 18 },  // Pref 2
    { wch: 18 },  // Pref 3
    { wch: 50 },  // Why Join
    { wch: 40 },  // Experience
    { wch: 40 },  // Drive Link
    { wch: 20 },  // Date
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Applications')

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `RAW_Applications_${date}.xlsx`)
}

export default function ApplicationsAdmin() {
  const { isDark } = useTheme()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    formService.getApplications()
      .then(d => setApps(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
  const modalBg = isDark ? 'bg-[#111] text-white border-gray-800' : 'bg-white text-raw-ink border-gray-200'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-eyebrow mb-1">Recruitment</p>
            <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Applications</h1>
            <p className={`font-serif text-sm italic mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{apps.length} total applications</p>
          </div>

          {apps.length > 0 && (
            <button
              onClick={() => exportToExcel(apps)}
              className={`flex items-center gap-2 px-4 py-2 border font-oswald text-xs tracking-widest uppercase transition-colors flex-shrink-0 mt-1
                ${isDark
                  ? 'border-gray-700 text-gray-400 hover:border-raw-accent hover:text-white'
                  : 'border-gray-300 text-gray-500 hover:border-raw-accent hover:text-raw-ink'
                }`}
            >
              <Download size={13} />
              Export Excel
            </button>
          )}
        </div>

        <div className={`border ${cardBg}`}>
          <div className={`grid grid-cols-12 gap-4 px-5 py-3 border-b font-oswald text-xs tracking-widest uppercase ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <span className="col-span-4">Name</span>
            <span className="col-span-3 hidden sm:block">Email</span>
            <span className="col-span-2 hidden md:block">Pref 1</span>
            <span className="col-span-2 hidden md:block">Date</span>
            <span className="col-span-1 text-right">View</span>
          </div>

          {loading ? (
            <div className="py-10 text-center"><div className={`font-condensed text-xl animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading...</div></div>
          ) : apps.length === 0 ? (
            <div className="py-16 text-center">
              <p className={`font-display text-lg italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No applications yet.</p>
            </div>
          ) : apps.map((app, i) => (
            <motion.div key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className={`grid grid-cols-12 gap-4 items-center px-5 py-4 border-b last:border-0 ${isDark ? 'border-gray-800 hover:bg-gray-900/40' : 'border-gray-100 hover:bg-gray-50'}`}>
              <div className="col-span-4">
                <p className={`font-display text-sm font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{app.name}</p>
                <p className={`font-oswald text-[10px] tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{app.year} · {app.course}</p>
              </div>
              <p className={`col-span-3 font-sans text-xs hidden sm:block truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{app.email}</p>
              <p className={`col-span-2 font-oswald text-xs tracking-wider uppercase hidden md:block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{app.preference1}</p>
              <p className={`col-span-2 font-oswald text-xs hidden md:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatDateShort(app.created_at)}</p>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => setSelected(app)} className={`p-1.5 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}><Eye size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className={`${modalBg} w-full max-w-lg max-h-[85vh] overflow-y-auto border`}>
            <div className={`sticky top-0 px-7 pt-6 pb-4 border-b ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'} flex justify-between items-start`}>
              <div>
                <h2 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{selected.name}</h2>
                <p className={`font-oswald text-xs tracking-widest uppercase mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{selected.year} · {selected.course}</p>
              </div>
              <button onClick={() => setSelected(null)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="px-7 py-6 space-y-5">
              {[
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'Preference 1', value: selected.preference1 },
                { label: 'Preference 2', value: selected.preference2 },
                { label: 'Preference 3', value: selected.preference3 },
              ].map(item => (
                <div key={item.label}>
                  <p className={`font-oswald text-xs tracking-widest uppercase mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</p>
                  <p className={`font-sans text-sm ${isDark ? 'text-white' : 'text-raw-ink'}`}>{item.value || '—'}</p>
                </div>
              ))}
              <div>
                <p className={`font-oswald text-xs tracking-widest uppercase mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Why Join RAW?</p>
                <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{selected.why_join || '—'}</p>
              </div>
              <div>
                <p className={`font-oswald text-xs tracking-widest uppercase mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Experience</p>
                <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{selected.experience || '—'}</p>
              </div>
              {selected.creative_drive_link && (
                <div>
                  <p className={`font-oswald text-xs tracking-widest uppercase mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Creative Work</p>
                  <a href={selected.creative_drive_link} target="_blank" rel="noreferrer" className="font-sans text-sm text-raw-accent underline underline-offset-4 break-all">{selected.creative_drive_link}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}