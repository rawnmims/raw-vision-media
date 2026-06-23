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

/**
 * Detects whether a URL is a Google Drive link
 */
export const isGoogleDriveUrl = (url) => {
  if (!url) return false
  return url.includes('drive.google.com') || url.includes('docs.google.com')
}

/**
 * Extracts the file ID from any Google Drive sharing URL.
 * Handles all formats:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID
 *   https://docs.google.com/...
 */
export const extractGDriveFileId = (url) => {
  if (!url) return null
  // Format: /file/d/ID/
  let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return match[1]
  // Format: ?id=ID or &id=ID
  match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (match) return match[1]
  // Format: /d/ID/ (docs)
  match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) return match[1]
  return null
}

/**
 * Converts any Google Drive file sharing URL → direct image display URL.
 * Use this for: cover images, scrapbook photos, team photos, login page images.
 *
 * How to get your URL:
 *   1. Upload photo to Google Drive
 *   2. Right-click → Share → "Anyone with the link" → Copy link
 *   3. Paste that link here — this function handles the rest
 */
export const getGDriveImageUrl = (url) => {
  if (!url) return ''
  if (!isGoogleDriveUrl(url)) return url // already a direct URL, return as-is
  const fileId = extractGDriveFileId(url)
  if (!fileId) return url
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

/**
 * Converts any Google Drive VIDEO sharing URL → embeddable preview URL.
 * Use this for: hero video, login page video.
 *
 * How to get your URL:
 *   1. Upload video to Google Drive
 *   2. Right-click → Share → "Anyone with the link" → Copy link
 *   3. Paste that link — this function converts it
 */
export const getGDriveVideoEmbedUrl = (url) => {
  if (!url) return ''
  if (!isGoogleDriveUrl(url)) return url
  const fileId = extractGDriveFileId(url)
  if (!fileId) return url
  return `https://drive.google.com/file/d/${fileId}/preview`
}

/**
 * Extracts folder ID from a Google Drive folder sharing URL.
 * Used for the "Download Originals" button on event gallery pages.
 */
export const extractGDriveFolderId = (url) => {
  if (!url) return null
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

// ─────────────────────────────────────────────
// VIDEO URL CONVERTERS
// ─────────────────────────────────────────────

/**
 * Detects the type of video URL passed in.
 * Returns: 'youtube' | 'instagram' | 'gdrive' | 'direct'
 */
export const detectVideoType = (url) => {
  if (!url) return 'direct'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('drive.google.com')) return 'gdrive'
  return 'direct'
}

/**
 * Converts a YouTube URL to an embeddable URL.
 * Handles: watch?v=, youtu.be/, /shorts/, /live/
 */
export const getYouTubeEmbedUrl = (url) => {
  if (!url) return ''
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }
  return url
}

/**
 * Converts an Instagram Reel or Post URL to an embeddable URL.
 *
 * HOW TO USE:
 *   1. Go to any Instagram Reel/Post
 *   2. Click the "..." menu → Copy Link
 *   3. Paste that link into the Admin → Videos → "Video URL" field
 *   4. This function auto-converts it
 *
 * Works with:
 *   https://www.instagram.com/reel/ABC123/
 *   https://www.instagram.com/p/ABC123/
 *   https://instagram.com/reel/ABC123/?igshid=...
 *
 * NOTE: Instagram embeds only work when your website is on a real domain
 * (not localhost). On localhost, use YouTube links for testing.
 */
export const getInstagramEmbedUrl = (url) => {
  if (!url) return ''
  // Strip query params and trailing slash, then add /embed/
  const clean = url.split('?')[0].replace(/\/$/, '')
  // Normalize: both /reel/ and /p/ work as /p/ for embed
  return clean + '/embed/'
}

/**
 * Returns the correct embed URL for ANY video link.
 * Admin just pastes any URL — this handles detection + conversion automatically.
 */
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


/**
 * Returns the correct display URL for ANY image link.
 * If it's a Google Drive link, converts it. Otherwise returns as-is.
 */
export const getImageUrl = (url) => {
  if (!url) return ''
  if (isGoogleDriveUrl(url)) return getGDriveImageUrl(url)
  return url
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
