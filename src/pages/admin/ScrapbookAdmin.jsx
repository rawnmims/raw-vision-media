import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Check, Star } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { scrapbookService } from '../../services/formService'
import { SAMPLE_SCRAPBOOK } from '../../utils/constants'

export default function ScrapbookAdmin() {
  const { isDark } = useTheme()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ image_url: '', caption: '', featured: false })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const load = () => {
    scrapbookService.getPhotos()
      .then(d => setPhotos(d.length > 0 ? d : SAMPLE_SCRAPBOOK))
      .catch(() => setPhotos(SAMPLE_SCRAPBOOK))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await scrapbookService.addPhoto(form)
      load(); setModal(false); setForm({ image_url: '', caption: '', featured: false })
    } catch (e) { alert(e.message) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await scrapbookService.deletePhoto(id); load(); setDeleteId(null) } catch (e) { alert(e.message) }
  }

  const handleToggleFeatured = async (photo) => {
    try { await scrapbookService.updatePhoto(photo.id, { featured: !photo.featured }); load() } catch {}
  }

  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
  const inputCls = `w-full py-2.5 px-3 border text-sm bg-transparent outline-none ${isDark ? 'border-gray-700 text-white placeholder-gray-600 focus:border-raw-accent' : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-ink'}`
  const labelCls = `font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`
  const modalBg = isDark ? 'bg-[#111] text-white' : 'bg-white text-raw-ink'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow mb-1">Manage</p>
            <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Scrapbook</h1>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary"><Plus size={14} /> Add Photo</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`aspect-square animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, i) => (
              <motion.div key={photo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="relative group aspect-square overflow-hidden">
                <img src={photo.image_url} alt={photo.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                  <p className="text-white font-oswald text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">{photo.caption}</p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleToggleFeatured(photo)} className={`p-1.5 ${photo.featured ? 'text-raw-accent' : 'text-white'}`}><Star size={14} fill={photo.featured ? 'currentColor' : 'none'} /></button>
                    <button onClick={() => setDeleteId(photo.id)} className="p-1.5 text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`${modalBg} w-full max-w-md p-8 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Add Photo</h2>
                <button onClick={() => setModal(false)}><X size={18} className="text-gray-400" /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Image URL *</label>
                  <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Caption</label>
                  <input value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} placeholder="Photo caption" className={inputCls} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="feat" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-raw-accent" />
                  <label htmlFor="feat" className={labelCls + ' cursor-pointer'}>Featured</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Saving...' : <><Check size={14} /> Add Photo</>}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {deleteId && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={`${modalBg} p-8 max-w-sm w-full border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className={`font-display text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Delete Photo?</h3>
              <p className={`font-serif text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-oswald text-xs tracking-widest uppercase hover:bg-red-700">
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
