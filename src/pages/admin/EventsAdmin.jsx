import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Check, Eye, EyeOff, Star } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { eventService } from '../../services/eventService'
import { SAMPLE_EVENTS, EVENT_CATEGORIES, CURRENT_YEAR } from '../../utils/constants'
import { formatDateShort } from '../../utils/helpers'
import CoverImageUploader from '../../pages/admin/CoverImageUploader'

const EMPTY = { title: '', description: '', event_date: '', year: CURRENT_YEAR, cover_image: '', google_drive_folder: '', category: '', visibility: 'public', featured: false }

export default function EventsAdmin() {
  const { isDark } = useTheme()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    eventService.getEvents()
      .then(d => setEvents(d.length > 0 ? d : SAMPLE_EVENTS))
      .catch(() => setEvents(SAMPLE_EVENTS))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (event) => { setForm(event); setModal('edit') }
  const closeModal = () => { setModal(null); setForm(EMPTY) }

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [e.target.name]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === 'add') {
        await eventService.createEvent({ ...form, year: Number(form.year) })
      } else {
        await eventService.updateEvent(form.id, { ...form, year: Number(form.year) })
      }
      load()
      closeModal()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await eventService.deleteEvent(id)
      load()
      setDeleteConfirm(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
  const inputCls = `w-full py-2.5 px-3 border text-sm bg-transparent outline-none transition-colors ${isDark ? 'border-gray-700 text-white placeholder-gray-600 focus:border-raw-accent' : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-ink'}`
  const labelCls = `font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`
  const modalBg = isDark ? 'bg-[#111] text-white' : 'bg-white text-raw-ink'

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow mb-1">Manage</p>
            <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Events</h1>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={14} /> Add Event
          </button>
        </div>

        {/* Table */}
        <div className={`border ${cardBg}`}>
          <div className={`flex items-center gap-4 px-5 py-3 border-b font-oswald text-xs tracking-widest uppercase ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <span className="flex-1">Event</span>
            <span className="hidden md:block w-24">Category</span>
            <span className="hidden md:block w-24">Date</span>
            <span className="hidden sm:block w-20">Status</span>
            <span className="w-20 text-right">Actions</span>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className={`font-condensed text-xl tracking-widest animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center">
              <p className={`font-display text-lg italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No events yet. Add one!</p>
            </div>
          ) : (
            events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 px-5 py-4 border-b last:border-0 ${isDark ? 'border-gray-800 hover:bg-gray-900/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors`}
              >
                {/* Cover thumb */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {event.cover_image && (
                    <img src={event.cover_image} alt="" className="w-12 h-10 object-cover flex-shrink-0 hidden sm:block" />
                  )}
                  <div className="min-w-0">
                    <p className={`font-display text-sm font-bold truncate ${isDark ? 'text-white' : 'text-raw-ink'}`}>{event.title}</p>
                    <p className={`font-oswald text-[10px] tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{event.year}</p>
                  </div>
                  {event.featured && <Star size={12} className="text-raw-accent flex-shrink-0" />}
                </div>
                <span className={`hidden md:block w-24 font-oswald text-xs tracking-wider uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{event.category}</span>
                <span className={`hidden md:block w-24 font-oswald text-xs tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatDateShort(event.event_date)}</span>
                <span className="hidden sm:block w-20">
                  <span className={`font-oswald text-[10px] tracking-widest uppercase px-2 py-0.5 ${event.visibility === 'public' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                    {event.visibility}
                  </span>
                </span>
                <div className="w-20 flex items-center justify-end gap-2">
                  <button onClick={() => openEdit(event)} className={`p-1.5 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setDeleteConfirm(event.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && closeModal()}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className={`${modalBg} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <div className={`sticky top-0 px-7 pt-7 pb-4 border-b ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'} flex justify-between items-center`}>
                <h2 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{modal === 'add' ? 'Add New Event' : 'Edit Event'}</h2>
                <button onClick={closeModal}><X size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} /></button>
              </div>
              <div className="px-7 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Event Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Event name" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                    <option value="">Select category</option>
                    {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Event Date</label>
                  <input name="event_date" type="date" value={form.event_date} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Year</label>
                  <input name="year" type="number" value={form.year} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Visibility</label>
                  <select name="visibility" value={form.visibility} onChange={handleChange} className={inputCls}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Google Drive Folder URL</label>
                  <input name="google_drive_folder" value={form.google_drive_folder} onChange={handleChange} placeholder="https://drive.google.com/drive/folders/..." className={inputCls} />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Cover Image</label>
                  <CoverImageUploader
                    currentUrl={form.cover_image}
                    onUpload={(url) => setForm(p => ({ ...p, cover_image: url }))}
                    onClear={() => setForm(p => ({ ...p, cover_image: '' }))}
                  />
                  {/* Manual URL fallback — still editable in case they want to paste a link directly */}
                  <input
                    name="cover_image"
                    value={form.cover_image}
                    onChange={handleChange}
                    placeholder="Or paste an image URL…"
                    className={`${inputCls} mt-2 text-xs`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Event description..." className={`${inputCls} resize-none`} />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <input type="checkbox" name="featured" id="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-raw-accent" />
                  <label htmlFor="featured" className={`font-oswald text-xs tracking-widest uppercase cursor-pointer ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Featured on Homepage</label>
                </div>
              </div>
              <div className={`px-7 pb-7 flex gap-3 border-t pt-5 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <button onClick={closeModal} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? 'Saving...' : <><Check size={14} /> {modal === 'add' ? 'Create Event' : 'Save Changes'}</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`${modalBg} p-8 max-w-sm w-full border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className={`font-display text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Delete Event?</h3>
              <p className={`font-serif text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 justify-center flex items-center gap-2 px-4 py-3 bg-red-600 text-white font-oswald text-xs tracking-widest uppercase hover:bg-red-700 transition-colors">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}