import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Check, Upload } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { userService } from '../../services/formService'

const TYPES = [
  { value: 'faculty', label: 'Faculty' },
  { value: 'member',  label: 'Team Member' },
]

const DEPARTMENTS = [
  'Photography','Cinematography','Editing','Graphic Designing',
  'Documentation','Logistics','Data Handling','Marketing',
]

const EMPTY = {
  name: '', role: '', department: '', photo: '',
  academic_year: '', type: 'member', order_index: 0,
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024 // 5MB

export default function AboutAdmin() {
  const { isDark } = useTheme()
  const [members, setMembers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'add' | 'edit'
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Team years (e.g. "2026-27", "2027-28") — managed independently of members
  // so a new year can be created in advance, before anyone is assigned to it.
  const [years, setYears] = useState([])
  const [selectedYear, setSelectedYear] = useState('all') // 'all' | a label | 'none'
  const [yearModal, setYearModal] = useState(false)
  const [newYearLabel, setNewYearLabel] = useState('')
  const [newYearCurrent, setNewYearCurrent] = useState(true)
  const [yearSaving, setYearSaving] = useState(false)

  // Photo upload state — photoFile is what we actually upload on save;
  // photoPreview is just for the on-screen circle (existing url OR local blob preview).
  const [photoFile, setPhotoFile]       = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([userService.getTeamMembers(), userService.getTeamYears()])
      .then(([m, y]) => { setMembers(m); setYears(y) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  // Year labels to show in tabs / the member form's dropdown. Prefers the
  // managed `team_years` table; falls back to whatever's on existing members
  // if that table is empty or hasn't been created yet.
  const yearLabels = years.length
    ? years.map(y => y.label)
    : [...new Set(members.filter(m => m.academic_year).map(m => m.academic_year))].sort((a, b) => b.localeCompare(a))

  const handleCreateYear = async () => {
    if (!newYearLabel.trim()) return
    setYearSaving(true)
    try {
      await userService.addTeamYear(newYearLabel.trim(), newYearCurrent)
      setNewYearLabel(''); setNewYearCurrent(true); setYearModal(false)
      load()
    } catch (e) { alert(e.message) }
    finally { setYearSaving(false) }
  }

  const handleSetCurrentYear = async (id) => {
    try { await userService.setCurrentTeamYear(id); load() }
    catch (e) { alert(e.message) }
  }

  const resetPhotoState = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhotoFile(null)
    setPhotoPreview('')
  }

  const openAdd  = () => { setForm(EMPTY); resetPhotoState(); setModal('add') }
  const openEdit = (m) => { setForm(m); resetPhotoState(); setPhotoPreview(m.photo || ''); setModal('edit') }
  const close    = () => { setModal(null); setForm(EMPTY); resetPhotoState() }

  const handleChange = e => {
    const { name, type: inputType, value, checked } = e.target
    const v = inputType === 'checkbox' ? checked : value
    setForm(p => {
      const next = { ...p, [name]: v }
      if (name === 'type' && v === 'faculty') next.academic_year = ''
      return next
    })
  }

  const handlePhotoChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please choose an image file.'); return }
    if (file.size > MAX_PHOTO_BYTES) { alert('Image must be smaller than 5MB.'); return }
    if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      let photoUrl = form.photo
      if (photoFile) {
        setUploading(true)
        photoUrl = await userService.uploadTeamPhoto(photoFile)
        setUploading(false)
      }
      const payload = { ...form, photo: photoUrl, order_index: Number(form.order_index) }
      if (modal === 'add') await userService.addTeamMember(payload)
      else                 await userService.updateTeamMember(form.id, payload)
      load(); close()
    } catch (e) { alert(e.message) }
    finally { setSaving(false); setUploading(false) }
  }

  const handleDelete = async (id) => {
    try {
      const member = members.find(m => m.id === id)
      await userService.deleteTeamMember(id, member?.photo)
      load(); setDeleteId(null)
    } catch (e) { alert(e.message) }
  }

  // Flat, position-sorted list of members for one year bucket (or `null` for
  // the permanent Faculty bucket). No sub-grouping by role or department —
  // just everyone in that year, in display order.
  const membersInBucket = (label) => {
    const pool = label === null
      ? members.filter(m => m.type === 'faculty')
      : members.filter(m => m.academic_year === label && m.type !== 'faculty')
    return [...pool].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  }

  const sectionLabels = selectedYear === 'all'
    ? [...yearLabels, null]
    : selectedYear === 'none'
      ? [null]
      : [selectedYear]

  const hasAnyVisibleMembers = sectionLabels.some(label => membersInBucket(label).length > 0)

  // Swap two members' position within the same bucket.
  const handleReorder = async (label, member, direction) => {
    const list = membersInBucket(label)
    const idx = list.findIndex(m => m.id === member.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= list.length) return
    const other = list[swapIdx]
    try {
      await Promise.all([
        userService.updateTeamMember(member.id, { order_index: swapIdx }),
        userService.updateTeamMember(other.id, { order_index: idx }),
      ])
      load()
    } catch (e) { alert(e.message) }
  }

  const tabCls = (active) => `font-oswald text-xs tracking-widest uppercase px-4 py-2 border transition-all
    ${active
      ? isDark ? 'bg-white text-black border-white' : 'bg-raw-ink text-white border-raw-ink'
      : isDark ? 'border-gray-700 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:border-gray-500'}`

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
            <h1 className={`font-display text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
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

        {/* Year filter tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setSelectedYear('all')} className={tabCls(selectedYear === 'all')}>
            All Years
          </button>
          {yearLabels.map(label => {
            const isCurrent = years.find(y => y.label === label)?.is_current
            return (
              <button key={label} onClick={() => setSelectedYear(label)} className={tabCls(selectedYear === label)}>
                {label}{isCurrent ? ' ★' : ''}
              </button>
            )
          })}
          <button onClick={() => setSelectedYear('none')} className={tabCls(selectedYear === 'none')}>
            Faculty / No Year
          </button>
          <button
            onClick={() => setYearModal(true)}
            className="font-oswald text-xs tracking-widest uppercase px-4 py-2 border border-dashed border-raw-accent text-raw-accent hover:bg-raw-accent/10 transition-colors"
          >
            + New Year
          </button>
        </div>

        {/* Table grouped by year only — flat list, ordered by position */}
        {loading ? (
          <div className="py-16 text-center">
            <div className={`font-condensed text-xl tracking-widest animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              Loading...
            </div>
          </div>
        ) : !hasAnyVisibleMembers ? (
          <div className={`py-16 text-center border ${cardBg}`}>
            <p className={`font-display text-lg italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              No members yet. Add one!
            </p>
          </div>
        ) : (
          sectionLabels.map(label => {
            const list = membersInBucket(label)
            if (!list.length) return null
            const yearEntry = label !== null ? years.find(y => y.label === label) : null
            const heading = label === null ? 'Faculty / No Year' : label

            return (
              <div key={label ?? '__none__'} className="space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <h2 className={`font-display text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                      {heading}
                    </h2>
                    <span className={`font-oswald text-xs tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {list.length} member{list.length !== 1 ? 's' : ''}
                    </span>
                    {yearEntry?.is_current && (
                      <span className="font-oswald text-[10px] tracking-widest uppercase px-2 py-1 bg-raw-accent text-black">
                        Current
                      </span>
                    )}
                  </div>
                  {yearEntry && !yearEntry.is_current && (
                    <button
                      onClick={() => handleSetCurrentYear(yearEntry.id)}
                      className={`font-oswald text-[10px] tracking-widest uppercase underline ${isDark ? 'text-gray-400 hover:text-raw-accent' : 'text-gray-500 hover:text-raw-ink'}`}
                    >
                      Set as current team
                    </button>
                  )}
                </div>

                <div className={`border ${cardBg} overflow-x-auto`}>
                  {/* Column headers */}
                  <div className={`grid grid-cols-12 gap-3 px-5 py-2 font-oswald text-[10px] tracking-widest uppercase min-w-[640px]
                    ${isDark ? 'text-gray-600 border-b border-gray-800' : 'text-gray-300 border-b border-gray-100'}`}>
                    <span className="col-span-4">Name</span>
                    <span className="col-span-3 hidden sm:block">Role / Title</span>
                    <span className="col-span-2 hidden md:block">Department</span>
                    <span className="col-span-1 hidden md:block text-center">Position</span>
                    <span className="col-span-2 text-right">Edit</span>
                  </div>

                  {/* Rows — everyone in this year together, ordered by position, no role/department split */}
                  {list.map((member, i) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={`grid grid-cols-12 gap-3 items-center px-5 py-3.5 border-b last:border-0 min-w-[640px]
                        ${isDark ? 'border-gray-800/50 hover:bg-gray-900/40' : 'border-gray-50 hover:bg-gray-50'}`}
                    >
                      {/* Name + photo */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex-shrink-0 overflow-hidden
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

                      {/* Position — only "list order" control, no role/department grouping */}
                      <div className="col-span-1 hidden md:flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleReorder(label, member, 'up')}
                          disabled={i === 0}
                          className={`text-[10px] px-1 leading-none ${i === 0 ? 'opacity-20 cursor-default' : isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
                        >▲</button>
                        <span className={`font-oswald text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{i + 1}</span>
                        <button
                          onClick={() => handleReorder(label, member, 'down')}
                          disabled={i === list.length - 1}
                          className={`text-[10px] px-1 leading-none ${i === list.length - 1 ? 'opacity-20 cursor-default' : isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
                        >▼</button>
                      </div>

                      <div className="col-span-2 flex items-center justify-end gap-1.5">
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
              </div>
            )
          })
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
              <div className={`sticky top-0 px-5 sm:px-7 pt-6 pb-4 border-b flex justify-between items-center
                ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
                <h2 className={`font-display text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                  {modal === 'add' ? 'Add Team Member' : 'Edit Team Member'}
                </h2>
                <button onClick={close}><X size={18} className="text-gray-400" /></button>
              </div>

              {/* Form */}
              <div className="px-5 sm:px-7 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="sm:col-span-2">
                  <label className={labelCls}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Member's full name" className={inputCls} />
                </div>

                {/* Photo upload */}
                <div className="sm:col-span-2">
                  <label className={labelCls}>Photo</label>
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-full overflow-hidden border-2 flex-shrink-0 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-raw-cream'}`}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-condensed text-2xl text-raw-accent">{form.name?.[0] || '?'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className={`inline-flex items-center gap-2 cursor-pointer font-oswald text-xs tracking-widest uppercase px-4 py-2.5 border transition-colors
                        ${isDark ? 'border-gray-700 text-gray-300 hover:border-raw-accent' : 'border-gray-300 text-gray-600 hover:border-raw-ink'}`}>
                        <Upload size={13} />
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      </label>
                      <p className={`font-sans text-[10px] mt-1.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        JPG or PNG, up to 5MB. Square photos look best.
                        {uploading && <span className="text-raw-accent"> Uploading…</span>}
                      </p>
                    </div>
                  </div>
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
                  <label className={labelCls}>Academic Year {form.type !== 'faculty' && '*'}</label>
                  {form.type === 'faculty' ? (
                    <p className={`py-2.5 px-3 border text-sm ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                      Faculty aren't tied to a specific year
                    </p>
                  ) : (
                    <select name="academic_year" value={form.academic_year} onChange={handleChange} className={inputCls}>
                      <option value="">— Select a year —</option>
                      {yearLabels.map(label => (
                        <option key={label} value={label}>
                          {label}{years.find(y => y.label === label)?.is_current ? ' (current)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className={`font-sans text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    Groups the member into a year panel on the About page.{' '}
                    <button type="button" onClick={() => setYearModal(true)} className="text-raw-accent underline">
                      Don't see the right year? Create one
                    </button>
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
                    Lower number = appears first within their year (faculty use their own ordering). You can also reorder from the table below.
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className={`px-5 sm:px-7 pb-7 flex gap-3 border-t pt-5 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <button onClick={close} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name.trim()} className="btn-primary flex-1 justify-center">
                  {saving ? (uploading ? 'Uploading photo...' : 'Saving...') : <><Check size={14} /> {modal === 'add' ? 'Add Member' : 'Save Changes'}</>}
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
      {/* Create new year */}
      <AnimatePresence>
        {yearModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setYearModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className={`${modalBg} p-7 max-w-sm w-full border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <h3 className={`font-display text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                Create New Team Year
              </h3>
              <p className={`font-serif text-sm mb-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Start a new year before assigning anyone to it — handy when next year's team is joining.
              </p>

              <label className={labelCls}>Year Label</label>
              <input
                value={newYearLabel}
                onChange={e => setNewYearLabel(e.target.value)}
                placeholder="e.g. 2027-28"
                className={inputCls}
              />

              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newYearCurrent}
                  onChange={e => setNewYearCurrent(e.target.checked)}
                />
                <span className={`font-sans text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Make this the current team (shown first on the About page)
                </span>
              </label>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setYearModal(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button
                  onClick={handleCreateYear}
                  disabled={yearSaving || !newYearLabel.trim()}
                  className="btn-primary flex-1 justify-center"
                >
                  {yearSaving ? 'Creating...' : <><Check size={14} /> Create Year</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}