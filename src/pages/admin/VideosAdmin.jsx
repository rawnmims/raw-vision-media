import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Check, Edit2, Star, Upload, Loader2 } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { videoService } from '../../services/formService'
import { getVideoThumbnail } from '../../utils/helpers'
import { supabase } from '../../services/supabase'

const EMPTY = { title: '', video_url: '', thumbnail: '', featured: false, category: '' }

export default function VideosAdmin() {
  const { isDark } = useTheme()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [thumbPreview, setThumbPreview] = useState('')
  const fileInputRef = useRef(null)

  const load = () => {
    videoService.getVideos()
      .then((d) => setVideos(d))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm(EMPTY)
    setThumbPreview('')
    setModal('add')
  }

  const openEdit = (v) => {
    setForm(v)
    setThumbPreview(getVideoThumbnail(v))
    setModal('edit')
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `thumbnails/${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('videos')
        .upload(fileName, file, { upsert: true })

      if (error) throw error

      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName)

      const url = publicUrlData.publicUrl
      setForm((p) => ({ ...p, thumbnail: url }))
      setThumbPreview(url)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modal === 'add') await videoService.addVideo(form)
      else await videoService.updateVideo(form.id, form)
      load()
      setModal(null)
      setForm(EMPTY)
      setThumbPreview('')
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await videoService.deleteVideo(id)
      load()
      setDeleteId(null)
    } catch (e) {
      alert(e.message)
    }
  }

  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
  const inputCls = `w-full py-2.5 px-3 border text-sm bg-transparent outline-none ${
    isDark
      ? 'border-gray-700 text-white placeholder-gray-600 focus:border-raw-accent'
      : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-ink'
  }`
  const labelCls = `font-oswald text-xs tracking-widest uppercase block mb-1 ${
    isDark ? 'text-gray-400' : 'text-gray-500'
  }`
  const modalBg = isDark ? 'bg-[#111] text-white' : 'bg-white text-raw-ink'

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow mb-1">Manage</p>
            <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
              Videos
            </h1>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={14} /> Add Video
          </button>
        </div>

        <div className={`border ${cardBg}`}>
          <div className={`flex items-center gap-4 px-5 py-3 border-b font-oswald text-xs tracking-widest uppercase ${
            isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'
          }`}>
            <span className="flex-1">Video</span>
            <span className="hidden sm:block w-20">Featured</span>
            <span className="w-20 text-right">Actions</span>
          </div>

          {loading ? (
            <div className="py-10 text-center">
              <div className={`font-condensed text-xl tracking-widest animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                Loading...
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="py-10 text-center">
              <p className={`font-serif italic text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                No videos yet. Add one above.
              </p>
            </div>
          ) : (
            videos.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 px-5 py-4 border-b last:border-0 ${
                  isDark ? 'border-gray-800 hover:bg-gray-900/40' : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={getVideoThumbnail(v)}
                    alt=""
                    className="w-16 h-10 object-cover hidden sm:block flex-shrink-0 rounded"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=60'
                    }}
                  />
                  <div className="min-w-0">
                    <p className={`font-display text-sm font-bold truncate ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                      {v.title}
                    </p>
                    {v.category && (
                      <p className={`text-[10px] tracking-widest uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        {v.category}
                      </p>
                    )}
                  </div>
                </div>
                <span className="hidden sm:block w-20">
                  {v.featured && <Star size={14} className="text-raw-accent" fill="currentColor" />}
                </span>
                <div className="w-20 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(v)}
                    className={`p-1.5 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setDeleteId(v.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${modalBg} w-full max-w-md p-8 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                  {modal === 'add' ? 'Add Video' : 'Edit Video'}
                </h2>
                <button onClick={() => setModal(null)}>
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className={labelCls}>Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Video title"
                    className={inputCls}
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className={labelCls}>YouTube / Instagram URL *</label>
                  <input
                    value={form.video_url}
                    onChange={(e) => setForm((p) => ({ ...p, video_url: e.target.value }))}
                    placeholder="https://youtube.com/... or https://instagram.com/reel/..."
                    className={inputCls}
                  />
                </div>

                {/* Thumbnail upload */}
                <div>
                  <label className={labelCls}>Thumbnail</label>

                  {/* Preview */}
                  <div
                    className={`w-full aspect-video rounded overflow-hidden mb-2 flex items-center justify-center ${
                      isDark ? 'bg-gray-900' : 'bg-gray-100'
                    }`}
                  >
                    {thumbPreview ? (
                      <img
                        src={thumbPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'
                        }}
                      />
                    ) : (
                      <span className={`text-[10px] tracking-widest uppercase ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
                        No thumbnail yet
                      </span>
                    )}
                  </div>

                  {/* Upload button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 border border-dashed text-sm transition-colors ${
                      isDark
                        ? 'border-gray-700 text-gray-400 hover:border-raw-accent hover:text-raw-accent'
                        : 'border-gray-300 text-gray-500 hover:border-raw-ink hover:text-raw-ink'
                    }`}
                  >
                    {uploading ? (
                      <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload size={14} /> {thumbPreview ? 'Change thumbnail' : 'Upload thumbnail'}</>
                    )}
                  </button>
                </div>

                {/* Category */}
                <div>
                  <label className={labelCls}>
                    Category{' '}
                    <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>(optional)</span>
                  </label>
                  <input
                    value={form.category || ''}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    placeholder="e.g. Aftermovie, Reel, Highlight"
                    className={inputCls}
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="vfeat"
                    checked={form.featured}
                    onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 accent-raw-accent"
                  />
                  <label htmlFor="vfeat" className={labelCls + ' cursor-pointer mb-0'}>
                    Featured
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(null)} className="btn-ghost flex-1 justify-center">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="btn-primary flex-1 justify-center"
                >
                  {saving ? 'Saving...' : <><Check size={14} /> Save</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete confirm */}
        {deleteId && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`${modalBg} p-8 max-w-sm w-full border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <h3 className={`font-display text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                Delete Video?
              </h3>
              <p className={`font-serif text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center">
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-oswald text-xs tracking-widest uppercase hover:bg-red-700"
                >
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