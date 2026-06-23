export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const formatDateShort = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatYear = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear()
}

// ─────────────────────────────────────────────
// GOOGLE DRIVE URL CONVERTERS
// ─────────────────────────────────────────────

export const isGoogleDriveUrl = (url) => {
  if (!url) return false
  return url.includes('drive.google.com') || url.includes('docs.google.com')
}

export const extractGDriveFileId = (url) => {
  if (!url) return null
  let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return match[1]
  match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (match) return match[1]
  match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return match[1]
  return null
}

export const getGDriveImageUrl = (url) => {
  if (!url) return ''
  if (!isGoogleDriveUrl(url)) return url
  const fileId = extractGDriveFileId(url)
  if (!fileId) return url
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

export const getGDriveVideoEmbedUrl = (url) => {
  if (!url) return ''
  if (!isGoogleDriveUrl(url)) return url
  const fileId = extractGDriveFileId(url)
  if (!fileId) return url
  return `https://drive.google.com/file/d/${fileId}/preview`
}

export const extractGDriveFolderId = (url) => {
  if (!url) return null
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

// ─────────────────────────────────────────────
// VIDEO URL CONVERTERS
// ─────────────────────────────────────────────

export const detectVideoType = (url) => {
  if (!url) return 'direct'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('drive.google.com')) return 'gdrive'
  return 'direct'
}

export const getYouTubeEmbedUrl = (url) => {
  if (!url) return ''
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }
  return url
}

export const getInstagramEmbedUrl = (url) => {
  if (!url) return ''
  const clean = url.split('?')[0].replace(/\/$/, '')
  return clean + '/embed/'
}

export const getVideoEmbedUrl = (url) => {
  if (!url) return ''
  const type = detectVideoType(url)
  switch (type) {
    case 'youtube':   return getYouTubeEmbedUrl(url)
    case 'instagram': return getInstagramEmbedUrl(url)
    case 'gdrive':    return getGDriveVideoEmbedUrl(url)
    default:          return url
  }
}

export const getImageUrl = (url) => {
  if (!url) return ''
  if (isGoogleDriveUrl(url)) return getGDriveImageUrl(url)
  return url
}

// ─────────────────────────────────────────────
// VIDEO THUMBNAIL HELPERS
// ─────────────────────────────────────────────

export const getYouTubeVideoId = (url) => {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export const getYouTubeThumbnailUrl = (url) => {
  const id = getYouTubeVideoId(url)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}

export const getYouTubeThumbnailFallbackUrl = (url) => {
  const id = getYouTubeVideoId(url)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

/**
 * Returns the correct thumbnail for any video.
 * - Always prefers the manually uploaded thumbnail saved in DB
 * - Falls back to YouTube CDN for YouTube videos
 * - Falls back to placeholder for Instagram/others (upload required)
 */
export const getVideoThumbnail = (video) => {
  const FALLBACK = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'
  if (video.thumbnail) return getImageUrl(video.thumbnail)
  const type = detectVideoType(video.video_url)
  if (type === 'youtube') return getYouTubeThumbnailUrl(video.video_url) || FALLBACK
  return FALLBACK
}

// ─────────────────────────────────────────────
// MISC HELPERS
// ─────────────────────────────────────────────

export const truncateText = (text, maxLength = 120) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

export const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const getRoleLabel = (role) => {
  const labels = {
    student: 'Student',
    faculty: 'Faculty',
    external: 'External User',
    admin: 'Admin'
  }
  return labels[role] || role
}