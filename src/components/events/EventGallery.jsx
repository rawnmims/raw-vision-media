import { useMemo } from 'react'
import { FolderOpen, ExternalLink, AlertCircle, Download } from 'lucide-react'
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
      <p className={`text-center font-serif italic py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        No gallery linked for this event yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {/* iframe wrapper */}
      <div
        className="overflow-hidden rounded-[8px] border-2"
        style={{ borderColor: isDark ? '#2A2A2A' : '#E5E0D8' }}
      >
        {/* Header bar — Drive link hidden from external users */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 border-b-2"
          style={{ borderColor: accent, backgroundColor: isDark ? '#1A1A1A' : '#F5F0E8' }}
        >
          <div className="flex items-center gap-2">
            <FolderOpen size={14} style={{ color: accent }} />
            <span className={`font-oswald text-[11px] tracking-[0.2em] uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {isExternal ? 'Gallery' : 'Live from Drive — click any folder to browse inside it'}
            </span>
          </div>

          {/* Only non-external users see the Open in Drive link */}
          {!isExternal && (
            <a
              href={event.google_drive_folder}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-1 font-oswald text-[10px] tracking-widest uppercase whitespace-nowrap transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
            >
              Open in Drive <ExternalLink size={10} />
            </a>
          )}
        </div>

        {/* The actual folder/photo browser */}
        <iframe
          src={embedUrl}
          title={`${event.title} — Gallery`}
          className="w-full"
          style={{ height: '82vh', minHeight: 560, border: 0, display: 'block' }}
          loading="lazy"
        />

        {/* Hint — only shown to non-external users who would be clicking into Drive */}
        {!isExternal && (
          <p className={`flex items-center gap-1.5 px-4 py-2 font-oswald text-[10px] tracking-widest uppercase ${isDark ? 'text-gray-700 bg-raw-black' : 'text-gray-400 bg-raw-white'}`}>
            <AlertCircle size={11} />
            Not loading? Use &quot;Open in Drive&quot; above instead.
          </p>
        )}
      </div>

      {/* Download button — hidden from external users */}
      {!isExternal && (
        <div className="pt-4 text-center">
          <a
            href={event.google_drive_folder}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex"
          >
            <Download size={14} />
            Download Originals
            <ExternalLink size={12} className="opacity-60" />
          </a>
        </div>
      )}
    </div>
  )
}