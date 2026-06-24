import { useMemo } from 'react'
import { FolderOpen, ExternalLink, AlertCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { extractGDriveFolderId } from '../../utils/helpers'

const EDITION_GOLD = '#C8A96E'
const EDITION_VARIANTS = ['#C0392B', '#C8C4BC']
function hashCategory(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}
function getAccent(category, featured) {
  if (featured) return EDITION_GOLD
  return EDITION_VARIANTS[hashCategory(category) % EDITION_VARIANTS.length]
}

function getDriveEmbedUrl(driveUrl) {
  const folderId = extractGDriveFolderId(driveUrl)
  if (!folderId) return null
  let url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`
  const resourceKeyMatch = driveUrl?.match(/[?&]resourcekey=([^&]+)/)
  if (resourceKeyMatch) url += `&resourcekey=${resourceKeyMatch[1]}`
  return url
}

export default function EventGallery({ event }) {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const isExternal = user?.role === 'external' || !user
  const accent = getAccent(event?.category, event?.featured)
  const embedUrl = useMemo(() => getDriveEmbedUrl(event?.google_drive_folder), [event?.google_drive_folder])

  if (!event?.google_drive_folder || !embedUrl) {
    return (
      <p className={`text-center font-serif italic text-base sm:text-lg md:text-xl py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        No gallery linked for this event yet.
      </p>
    )
  }

  return (
    <div className="w-full">
      <div
        className="overflow-hidden border-2"
        style={{ borderColor: isDark ? '#2A2A2A' : '#E5E0D8' }}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b-2"
          style={{ borderColor: accent, backgroundColor: isDark ? '#1A1A1A' : '#F5F0E8' }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <FolderOpen size={16} style={{ color: accent }} />
            <span className={`font-oswald text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {isExternal ? 'Gallery' : 'Live from Drive'}
            </span>
          </div>
        </div>

        {/* Gallery iframe — large and responsive */}
        <iframe
          src={embedUrl}
          title={`${event.title} — Gallery`}
          className="w-full"
          style={{
            height: 'clamp(520px, 88vh, 1080px)',
            border: 0,
            display: 'block',
          }}
          loading="lazy"
        />
      </div>
    </div>
  )
}