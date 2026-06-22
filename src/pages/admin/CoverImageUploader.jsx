import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { useTheme } from '../../context/ThemeContext'

// ─────────────────────────────────────────────
// BUCKET CONFIG
// Change BUCKET_NAME if you name the bucket differently in Supabase.
// The folder inside the bucket is "covers/" — keeps things tidy if you
// later add more buckets (scrapbook, avatars, etc.) under the same project.
// ─────────────────────────────────────────────
const BUCKET_NAME = 'event-covers'
const FOLDER = 'covers'
const MAX_MB = 10
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function uniqueFileName(original) {
  const ext = original.split('.').pop()
  const base = slugify(original.replace(`.${ext}`, ''))
  const ts = Date.now()
  const rand = Math.random().toString(36).slice(2, 6)
  return `${FOLDER}/${base}-${ts}-${rand}.${ext}`
}

/**
 * Drop-in replacement for the plain "Cover Image URL" input.
 * Lets the admin drag-drop or click to upload a photo from their device.
 * Uploads to the Supabase Storage bucket defined by BUCKET_NAME above,
 * then calls onUpload(publicUrl) with the resulting public URL so the
 * parent form can store it in cover_image exactly like before.
 *
 * Props:
 *   currentUrl  – the current cover_image value (shows existing preview)
 *   onUpload    – called with the new public URL after a successful upload
 *   onClear     – called when the admin removes the current image
 */
export default function CoverImageUploader({ currentUrl, onUpload, onClear }) {
  const { isDark } = useTheme()
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(null)   // null | 0–100
  const [error, setError] = useState(null)
  const [localPreview, setLocalPreview] = useState(null)

  const border = isDark ? 'border-gray-700' : 'border-gray-300'
  const bg = isDark ? 'bg-raw-black' : 'bg-raw-white'
  const muted = isDark ? 'text-gray-500' : 'text-gray-400'

  async function handleFile(file) {
    setError(null)

    if (!ACCEPTED.includes(file.type)) {
      setError('Please upload a JPEG, PNG, WebP, or GIF.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_MB} MB.`)
      return
    }

    // Show instant local preview while uploading
    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)
    setProgress(0)

    try {
      const path = uniqueFileName(file.name)

      // Supabase JS v2 doesn't expose upload progress natively,
      // so we animate a fake-but-honest progress bar:
      // jumps to 40% quickly (pre-upload), holds, then to 100% on success.
      const tick = setInterval(() => setProgress(p => Math.min((p ?? 0) + 5, 40)), 80)

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, { upsert: true, contentType: file.type })

      clearInterval(tick)

      if (uploadError) throw uploadError

      setProgress(100)

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path)

      onUpload(data.publicUrl)

      // Clean up blob URL after a moment
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl)
        setLocalPreview(null)
        setProgress(null)
      }, 800)

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
      setProgress(null)
      setLocalPreview(null)
      URL.revokeObjectURL(objectUrl)
    }
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''   // allow re-uploading the same file
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleClear() {
    setLocalPreview(null)
    setProgress(null)
    setError(null)
    onClear()
  }

  const previewSrc = localPreview || currentUrl
  const uploading = progress !== null && progress < 100

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {previewSrc ? (
          // ── Preview state ──
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className={`relative rounded-[6px] overflow-hidden border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <img
              src={previewSrc}
              alt="Cover preview"
              className="w-full h-44 object-cover"
            />

            {/* Progress overlay */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3"
                >
                  <p className="font-oswald text-[11px] tracking-widest uppercase text-white">
                    Uploading…
                  </p>
                  <div className="w-40 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-raw-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>
                  <p className="font-oswald text-[10px] text-white/60">{progress}%</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Done checkmark flash */}
            <AnimatePresence>
              {progress === 100 && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <CheckCircle size={36} className="text-green-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            {!uploading && progress !== 100 && (
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white font-oswald text-[10px] tracking-widest uppercase hover:bg-raw-accent hover:text-black transition-colors rounded-sm"
                >
                  <Upload size={10} /> Replace
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 bg-black/70 backdrop-blur-sm text-white hover:bg-red-600 transition-colors rounded-sm"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          // ── Drop-zone state ──
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`cursor-pointer rounded-[6px] border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 py-10 px-6 text-center
              ${dragging
                ? 'border-raw-accent bg-raw-accent/5'
                : `${border} ${bg} hover:border-raw-accent/60`
              }`}
          >
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${dragging ? 'border-raw-accent text-raw-accent' : `${border} ${muted}`}`}>
              <ImageIcon size={18} />
            </div>
            <div>
              <p className={`font-oswald text-xs tracking-widest uppercase ${dragging ? 'text-raw-accent' : muted}`}>
                {dragging ? 'Drop to upload' : 'Click or drag a photo here'}
              </p>
              <p className={`font-serif italic text-[11px] mt-1 ${muted}`}>
                JPEG, PNG, WebP or GIF · max {MAX_MB} MB
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 font-oswald text-[11px] tracking-widest uppercase text-red-500"
          >
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}