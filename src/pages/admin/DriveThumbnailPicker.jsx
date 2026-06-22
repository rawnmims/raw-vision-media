import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Image as ImageIcon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { getImageUrl } from '../../utils/helpers'
import DriveFolderEmbed from "../../components/shared/DriveFolderEmbed";


const EDITION_GOLD = '#C8A96E'
const EDITION_VARIANTS = ['#C0392B', '#C8C4BC']
function hashCategory(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}
function getEditionHex(category, featured) {
  if (featured) return EDITION_GOLD
  return EDITION_VARIANTS[hashCategory(category) % EDITION_VARIANTS.length]
}

/**
 * Lets an admin browse an event's Drive folder (via the same DriveFolderEmbed
 * used on the public event page — identical chrome, identical behavior) and
 * set any photo inside it as the event's cover image, by pasting that
 * photo's "Anyone with the link" share URL.
 *
 * No Google API key, Cloud Console, or billing account required — this
 * reuses the same single-file share-link conversion the cover_image field
 * already relies on (getImageUrl / getGDriveImageUrl in utils/helpers.js).
 *
 * Usage in EventsAdmin.jsx:
 *   <DriveThumbnailPicker
 *     driveFolderUrl={form.google_drive_folder}
 *     currentValue={form.cover_image}
 *     category={form.category}
 *     featured={form.featured}
 *     onSelect={(url) => setForm(p => ({ ...p, cover_image: url }))}
 *   />
 */
export default function DriveThumbnailPicker({ driveFolderUrl, currentValue, category, featured, onSelect }) {
  const { isDark } = useTheme()
  const [pasted, setPasted] = useState('')
  const accent = getEditionHex(category, featured)
  const previewUrl = pasted ? getImageUrl(pasted) : null

  function handleUse() {
    if (!pasted.trim()) return
    onSelect(pasted.trim())
    setPasted('')
  }

  if (!driveFolderUrl) {
    return (
      <p className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        Add a Drive folder link first to pick a thumbnail from it.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <DriveFolderEmbed
        driveUrl={driveFolderUrl}
        accent={accent}
        height={380}
        label="Browse this event's Drive folder"
      />

      <div className={`p-4 space-y-3 rounded-[6px] border ${isDark ? 'border-gray-700 bg-raw-black' : 'border-gray-300 bg-raw-white'}`}>
        <p className={`font-serif italic text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Find a photo above, right-click it → <strong>Get link</strong> (set to &quot;Anyone with the link&quot;), then paste it here:
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="Paste the photo's Drive share link…"
            className="raw-input flex-1"
          />
          <motion.button
            type="button"
            onClick={handleUse}
            disabled={!pasted.trim()}
            whileTap={{ scale: 0.95 }}
            className="btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Use as Thumbnail
          </motion.button>
        </div>

        {previewUrl && (
          <div className="flex items-center gap-3 pt-1">
            <img src={previewUrl} alt="Selected preview" className="w-20 h-20 object-cover rounded border border-gray-700" />
            <span className={`font-oswald text-[10px] tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Preview
            </span>
          </div>
        )}

        {currentValue && !pasted && (
          <div className="flex items-center gap-3 pt-1">
            <img src={getImageUrl(currentValue)} alt="Current thumbnail" className="w-20 h-20 object-cover rounded border border-gray-700" />
            <span className={`font-oswald text-[10px] tracking-widest uppercase flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <ImageIcon size={11} /> Current thumbnail
            </span>
          </div>
        )}
      </div>
    </div>
  )
}