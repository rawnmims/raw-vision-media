import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Check, Star, Upload } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { scrapbookService } from '../../services/formService'
import { SAMPLE_SCRAPBOOK } from '../../utils/constants'
import { supabase } from '../../services/supabase' // ← adjust if your path differs

const BUCKET = 'scrapbook'

/* ── upload file to Supabase storage, return public URL ── */
async function uploadToSupabase(file) {
  const ext  = file.name.split('.').pop()
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(name, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(name)
  return data.publicUrl
}

export default function ScrapbookAdmin() {
  const { isDark } = useTheme()
  const fileRef = useRef(null)

  const [photos,   setPhotos]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [form,     setForm]     = useState({ caption: '', featured: false })
  const [file,     setFile]     = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [progress, setProgress] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const ink   = isDark ? '#f0ece4' : '#1a1a1a'
  const bg    = isDark ? '#111'    : '#faf8f4'
  const rule  = isDark ? '#2a2520' : '#d4cec6'
  const muted = isDark ? '#6a6460' : '#9a9088'
  const cardBg = isDark ? '#0d0d0d' : '#f0ece4'

  const load = () => {
    scrapbookService.getPhotos()
      .then(d => setPhotos(d.length > 0 ? d : SAMPLE_SCRAPBOOK))
      .catch(() => setPhotos(SAMPLE_SCRAPBOOK))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const resetModal = () => {
    setModal(false)
    setFile(null)
    setPreview(null)
    setProgress('')
    setForm({ caption: '', featured: false })
  }

  const handleSave = async () => {
    if (!file) { alert('Please select a photo first.'); return }
    setSaving(true)
    try {
      setProgress('Uploading photo…')
      const url = await uploadToSupabase(file)
      setProgress('Saving to database…')
      await scrapbookService.addPhoto({
        image_url: url,
        caption:   form.caption,
        featured:  form.featured,
      })
      load()
      resetModal()
    } catch (e) {
      alert('Upload failed: ' + e.message)
    } finally {
      setSaving(false)
      setProgress('')
    }
  }

  const handleDelete = async (id) => {
    try { await scrapbookService.deletePhoto(id); load(); setDeleteId(null) }
    catch (e) { alert(e.message) }
  }

  const handleToggleFeatured = async (photo) => {
    try { await scrapbookService.updatePhoto(photo.id, { featured: !photo.featured }); load() }
    catch {}
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ── page header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: `1px solid ${rule}` }}>
          <div>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#c0392b', margin: '0 0 4px' }}>
              Manage
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '2rem', color: ink, margin: 0 }}>
              Scrapbook
            </h1>
          </div>
          <button
            onClick={() => setModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 20px', background: ink, color: bg, border: 'none', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={13} /> Add Photo
          </button>
        </div>

        {/* ── photo grid ── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ aspectRatio: '1', background: isDark ? '#1a1a1a' : '#e8e4dc' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}
            className="sm:grid-cols-3 lg:grid-cols-4"
          >
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: '#111', cursor: 'default' }}
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* hover controls */}
                <div
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.25s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.65)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                >
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', padding: '0 8px', margin: 0 }}>
                    {photo.caption}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleFeatured(photo)}
                      title={photo.featured ? 'Unfeature' : 'Feature'}
                      style={{ padding: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', color: photo.featured ? '#c0392b' : 'white', transition: 'border-color 0.2s' }}
                    >
                      <Star size={13} fill={photo.featured ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => setDeleteId(photo.id)}
                      title="Delete"
                      style={{ padding: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', color: '#f87171', transition: 'border-color 0.2s' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* featured badge */}
                {photo.featured && (
                  <div style={{ position: 'absolute', top: '6px', left: '6px' }}>
                    <span style={{ background: '#c0392b', color: '#fff', fontFamily: "'Oswald', sans-serif", fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '2px 6px' }}>
                      Featured
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════
          ADD PHOTO MODAL
      ══════════════════════════════════ */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && resetModal()}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
              style={{ background: bg, border: `1px solid ${rule}`, width: '100%', maxWidth: '460px', padding: '36px' }}
            >

              {/* modal header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', paddingBottom: '16px', borderBottom: `1px solid ${rule}` }}>
                <div>
                  <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c0392b', margin: '0 0 4px' }}>
                    Scrapbook
                  </p>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.6rem', color: ink, margin: 0 }}>
                    Add Photo
                  </h2>
                </div>
                <button onClick={resetModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: muted, padding: '2px' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* ── drop zone ── */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `1.5px dashed ${dragOver ? '#c0392b' : preview ? 'rgba(192,57,43,0.5)' : rule}`,
                    minHeight: preview ? 'auto' : '160px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'border-color 0.2s',
                    overflow: 'hidden', position: 'relative',
                    background: dragOver ? (isDark ? '#1a0a0a' : '#fdf0ef') : (isDark ? '#0d0d0d' : '#f5f0e8'),
                  }}
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="preview"
                        style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
                      />
                      {/* change photo overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.querySelector('span').style.opacity = '1' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.querySelector('span').style.opacity = '0' }}
                      >
                        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'white', opacity: 0, transition: 'opacity 0.2s' }}>
                          Change Photo
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={24} color={muted} style={{ marginBottom: '12px' }} />
                      <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: muted, margin: '0 0 6px', textAlign: 'center' }}>
                        {dragOver ? 'Drop to upload' : 'Drop photo here or click to browse'}
                      </p>
                      <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.1em', color: isDark ? '#3a3530' : '#c8c0b4', margin: 0 }}>
                        JPG · PNG · WEBP
                      </p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>

                {/* file name hint */}
                {file && (
                  <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.16em', color: muted, margin: '-8px 0 0', textTransform: 'uppercase' }}>
                    {file.name} · {(file.size / 1024).toFixed(0)} KB
                  </p>
                )}

                {/* caption */}
                <div>
                  <label style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: muted, display: 'block', marginBottom: '6px' }}>
                    Caption
                  </label>
                  <input
                    value={form.caption}
                    onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
                    placeholder="Photo caption…"
                    style={{ width: '100%', padding: '9px 12px', border: `1px solid ${rule}`, background: 'transparent', color: ink, fontFamily: "'Oswald', sans-serif", fontSize: '13px', letterSpacing: '0.06em', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#c0392b'}
                    onBlur={e => e.target.style.borderColor = rule}
                  />
                </div>

                {/* featured toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox" id="feat"
                    checked={form.featured}
                    onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                    style={{ width: '14px', height: '14px', accentColor: '#c0392b', cursor: 'pointer' }}
                  />
                  <label htmlFor="feat" style={{ fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: muted, cursor: 'pointer' }}>
                    Mark as Featured
                  </label>
                </div>
              </div>

              {/* progress indicator */}
              {progress && (
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c0392b', marginTop: '16px', marginBottom: 0 }}>
                  ↑ {progress}
                </p>
              )}

              {/* action buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${rule}` }}>
                <button
                  onClick={resetModal}
                  style={{ flex: 1, padding: '10px', border: `1px solid ${rule}`, background: 'transparent', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: ink, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1a1714' : '#f0ece4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !file}
                  style={{ flex: 1, padding: '10px', border: 'none', background: saving || !file ? (isDark ? '#333' : '#ccc') : ink, color: saving || !file ? muted : bg, cursor: saving || !file ? 'not-allowed' : 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                >
                  {saving ? `↑ ${progress}` : <><Check size={13} /> Add Photo</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════════════════════
            DELETE CONFIRM MODAL
        ══════════════════════════════════ */}
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              style={{ background: bg, border: `1px solid ${rule}`, padding: '36px', maxWidth: '360px', width: '100%' }}
            >
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c0392b', margin: '0 0 8px' }}>
                Confirm
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.4rem', color: ink, margin: '0 0 10px' }}>
                Delete Photo?
              </h3>
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', color: muted, margin: '0 0 28px', lineHeight: 1.6 }}>
                This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setDeleteId(null)}
                  style={{ flex: 1, padding: '10px', border: `1px solid ${rule}`, background: 'transparent', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: ink }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  style={{ flex: 1, padding: '10px', border: 'none', background: '#c0392b', color: 'white', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
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