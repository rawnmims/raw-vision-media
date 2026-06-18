import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { userService } from '../../services/formService'

const TYPES = [
  { value: 'faculty',          label: 'Faculty In-Charge' },
  { value: 'student_incharge', label: 'Student In-Charge' },
  { value: 'school_head',      label: 'School Head' },
  { value: 'dept_head',        label: 'Departmental Head' },
  { value: 'member',           label: 'Member' },
  { value: 'alumni',           label: 'Alumni (Previous Year)' },
]

const DEPARTMENTS = [
  'Photography','Cinematography','Editing','Graphic Designing',
  'Documentation','Logistics','Data Handling','Marketing',
]

const EMPTY = {
  name: '', role: '', department: '', photo: '',
  year: new Date().getFullYear(), type: 'member', order_index: 0,
}

const TYPE_ORDER = ['faculty','student_incharge','school_head','dept_head','member','alumni']

export default function AboutAdmin() {
  const { isDark } = useTheme()
  const [members, setMembers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'add' | 'edit'
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [filterType, setFilterType] = useState('all')

  const load = () => {
    setLoading(true)
    userService.getTeamMembers()
      .then(d => setMembers(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd  = ()      => { setForm(EMPTY); setModal('add') }
  const openEdit = (m)     => { setForm(m);     setModal('edit') }
  const close    = ()      => { setModal(null); setForm(EMPTY) }
  const handleChange = e   => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [e.target.name]: v }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (modal === 'add') await userService.addTeamMember({ ...form, year: Number(form.year), order_index: Number(form.order_index) })
      else                 await userService.updateTeamMember(form.id, { ...form, year: Number(form.year), order_index: Number(form.order_index) })
      load(); close()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await userService.deleteTeamMember(id); load(); setDeleteId(null) }
    catch (e) { alert(e.message) }
  }

  const displayed = filterType === 'all'
    ? members
    : members.filter(m => m.type === filterType)

  // Group by type for the table view
  const grouped = TYPE_ORDER.reduce((acc, t) => {
    const list = displayed.filter(m => m.type === t)
    if (list.length) acc[t] = list
    return acc
  }, {})

  const cardBg   = isDark ? 'bg-[#111] border-gray-800'  : 'bg-white border-gray-200'
  const modalBg  = isDark ? 'bg-[#111] text-white'       : 'bg-white text-raw-ink'
  const inputCls = `w-full py-2.5 px-3 border text-sm bg-transparent outline-none transition-colors
    ${isDark ? 'border-gray-700 text-white placeholder-gray-600 focus:border-raw-accent'
             : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-ink'}`
  const labelCls = `font-oswald text-xs tracking-widest uppercase block mb-1
    ${isDark ? 'text-gray-400' : 'text-gray-500'}`

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="section-eyebrow mb-1">About Page</p>
            <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
              Team Management
            </h1>
            <p className={`font-serif text-sm italic mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {members.length} team members across all years
            </p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={14} /> Add Member
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`font-oswald text-xs tracking-widest uppercase px-4 py-2 border transition-all
              ${filterType === 'all'
                ? isDark ? 'bg-white text-black border-white' : 'bg-raw-ink text-white border-raw-ink'
                : isDark ? 'border-gray-700 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:border-gray-500'}`}
          >
            All ({members.length})
          </button>
          {TYPES.map(t => {
            const count = members.filter(m => m.type === t.value).length
            return (
              <button
                key={t.value}
                onClick={() => setFilterType(t.value)}
                className={`font-oswald text-xs tracking-widest uppercase px-4 py-2 border transition-all
                  ${filterType === t.value
                    ? isDark ? 'bg-white text-black border-white' : 'bg-raw-ink text-white border-raw-ink'
                    : isDark ? 'border-gray-700 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:border-gray-500'}`}
              >
                {t.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Table grouped by type */}
        {loading ? (
          <div className="py-16 text-center">
            <div className={`font-condensed text-xl tracking-widest animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              Loading...
            </div>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className={`py-16 text-center border ${cardBg}`}>
            <p className={`font-display text-lg italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              No members yet. Add one!
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([type, list]) => (
            <div key={type} className={`border ${cardBg}`}>
              {/* Section header */}
              <div className={`px-5 py-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-raw-accent" />
                  <span className={`font-condensed text-base tracking-widest uppercase ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                    {TYPES.find(t => t.value === type)?.label}
                  </span>
                  <span className={`font-oswald text-xs tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {list.length} member{list.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Column headers */}
              <div className={`grid grid-cols-12 gap-3 px-5 py-2 font-oswald text-[10px] tracking-widest uppercase
                ${isDark ? 'text-gray-600 border-b border-gray-800' : 'text-gray-300 border-b border-gray-100'}`}>
                <span className="col-span-4">Name</span>
                <span className="col-span-3 hidden sm:block">Role / Title</span>
                <span className="col-span-2 hidden md:block">Department</span>
                <span className="col-span-2 hidden md:block">Year</span>
                <span className="col-span-1 text-right">Edit</span>
              </div>

              {/* Rows */}
              {list.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`grid grid-cols-12 gap-3 items-center px-5 py-3.5 border-b last:border-0
                    ${isDark ? 'border-gray-800/50 hover:bg-gray-900/40' : 'border-gray-50 hover:bg-gray-50'}`}
                >
                  {/* Name + photo */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 overflow-hidden
                      ${isDark ? 'bg-gray-800' : 'bg-raw-cream'}`}>
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-condensed text-sm text-raw-accent">{member.name?.[0]}</span>
                        </div>
                      )}
                    </div>
                    <p className={`font-display text-sm font-bold truncate ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                      {member.name}
                    </p>
                  </div>

                  <p className={`col-span-3 font-sans text-xs truncate hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {member.role || '—'}
                  </p>
                  <p className={`col-span-2 font-oswald text-xs tracking-wider uppercase hidden md:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {member.department || '—'}
                  </p>
                  <p className={`col-span-2 font-oswald text-xs hidden md:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {member.year || '—'}
                  </p>

                  <div className="col-span-1 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(member)}
                      className={`p-1.5 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteId(member.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && close()}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              className={`${modalBg} w-full max-w-xl max-h-[90vh] overflow-y-auto border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
            >
              {/* Modal header */}
              <div className={`sticky top-0 px-7 pt-6 pb-4 border-b flex justify-between items-center
                ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
                <h2 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                  {modal === 'add' ? 'Add Team Member' : 'Edit Team Member'}
                </h2>
                <button onClick={close}><X size={18} className="text-gray-400" /></button>
              </div>

              {/* Form */}
              <div className="px-7 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="sm:col-span-2">
                  <label className={labelCls}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Member's full name" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Role / Title</label>
                  <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Head of Photography" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Category *</label>
                  <select name="type" value={form.type} onChange={handleChange} className={inputCls}>
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Department</label>
                  <select name="department" value={form.department} onChange={handleChange} className={inputCls}>
                    <option value="">— None —</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    <option value="School of Technology">School of Technology</option>
                    <option value="School of Management">School of Management</option>
                    <option value="School of Commerce">School of Commerce</option>
                    <option value="School of Science">School of Science</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Year</label>
                  <input
                    name="year" type="number" value={form.year}
                    onChange={handleChange}
                    placeholder={new Date().getFullYear()}
                    className={inputCls}
                  />
                  <p className={`font-sans text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    Academic year they served (e.g. 2024)
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Photo URL</label>
                  <input
                    name="photo" value={form.photo} onChange={handleChange}
                    placeholder="Paste Google Drive sharing link or direct image URL"
                    className={inputCls}
                  />
                  <p className={`font-sans text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    Drive: Upload photo → Share → Anyone with link → Copy → Paste here
                  </p>
                </div>

                <div>
                  <label className={labelCls}>Display Order</label>
                  <input
                    name="order_index" type="number" value={form.order_index}
                    onChange={handleChange} placeholder="0"
                    className={inputCls}
                  />
                  <p className={`font-sans text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    Lower number = appears first
                  </p>
                </div>

                {/* Photo preview */}
                {form.photo && (
                  <div className="flex items-center gap-3">
                    <label className={`${labelCls} mb-0`}>Preview</label>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-raw-accent">
                      <img
                        src={form.photo.includes('drive.google.com')
                          ? form.photo.replace(/\/file\/d\/([^/]+).*/, '/uc?export=view&id=$1')
                          : form.photo}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={e => e.target.style.display = 'none'}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`px-7 pb-7 flex gap-3 border-t pt-5 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <button onClick={close} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name.trim()} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : <><Check size={14} /> {modal === 'add' ? 'Add Member' : 'Save Changes'}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className={`${modalBg} p-8 max-w-sm w-full border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <h3 className={`font-display text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                Remove Member?
              </h3>
              <p className={`font-serif text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-oswald text-xs tracking-widest uppercase hover:bg-red-700"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}