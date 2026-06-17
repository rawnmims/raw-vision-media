export const DEPARTMENTS = [
  'Photography',
  'Cinematography',
  'Editing',
  'Graphic Designing',
  'Documentation',
  'Logistics',
  'Data Handling',
  'Marketing'
]

export const ROLES = ['student', 'faculty', 'external', 'admin']

export const EVENT_CATEGORIES = [
  'Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Competition', 'Fest', 'Other'
]

export const COVERAGE_TYPES = ['Photography', 'Videography', 'Both']

export const CURRENT_YEAR = new Date().getFullYear()

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'Archive', path: '/archive' },
  { label: 'Scrapbook', path: '/scrapbook' },
  { label: 'Videos', path: '/videos' },
  { label: 'About', path: '/about' },
]

export const SAMPLE_EVENTS = [
  {
    id: '1',
    title: 'Techfest 2024',
    description: 'Annual technical festival of NMIMS Shirpur featuring competitions, workshops and exhibitions.',
    event_date: '2024-03-15',
    year: 2024,
    cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    category: 'Technical',
    visibility: 'public',
    featured: true,
    google_drive_folder: 'https://drive.google.com/drive/folders/example'
  },
  {
    id: '2',
    title: 'Culturals 2024',
    description: 'Celebrating art, dance, music and drama at the cultural festival of NMIMS Shirpur.',
    event_date: '2024-02-10',
    year: 2024,
    cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    category: 'Cultural',
    visibility: 'public',
    featured: true,
    google_drive_folder: 'https://drive.google.com/drive/folders/example'
  },
  {
    id: '3',
    title: 'Sports Meet 2024',
    description: 'Annual inter-college sports meet showcasing athletic talent across disciplines.',
    event_date: '2024-01-20',
    year: 2024,
    cover_image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    category: 'Sports',
    visibility: 'public',
    featured: false,
    google_drive_folder: 'https://drive.google.com/drive/folders/example'
  },
  {
    id: '4',
    title: 'Photography Workshop',
    description: 'Hands-on photography workshop with professional equipment and expert guidance.',
    event_date: '2024-04-05',
    year: 2024,
    cover_image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
    category: 'Workshop',
    visibility: 'public',
    featured: true,
    google_drive_folder: 'https://drive.google.com/drive/folders/example'
  }
]

export const SAMPLE_SCRAPBOOK = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80', caption: 'Golden Hour Portraits', featured: true },
  { id: '2', image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80', caption: 'Behind the Lens', featured: true },
  { id: '3', image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80', caption: 'Stage Moments', featured: false },
  { id: '4', image_url: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=600&q=80', caption: 'Candid Campus', featured: true },
  { id: '5', image_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80', caption: 'Motion & Light', featured: false },
  { id: '6', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', caption: 'Architecture Frames', featured: true },
  { id: '7', image_url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&q=80', caption: 'Fest Energy', featured: false },
  { id: '8', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', caption: 'Creative Compositions', featured: true },
  { id: '9', image_url: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80', caption: 'Street Photography', featured: false },
  { id: '10', image_url: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&q=80', caption: 'Dawn Light', featured: true },
  { id: '11', image_url: 'https://images.unsplash.com/photo-1520549233664-03f65c1d1327?w=600&q=80', caption: 'Sports Action', featured: false },
  { id: '12', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', caption: 'Cultural Celebrations', featured: true },
]

export const SAMPLE_VIDEOS = [
  { id: '1', title: 'Techfest 2024 Aftermovie', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80', featured: true },
  { id: '2', title: 'RAW Vision Reel 2024', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80', featured: true },
  { id: '3', title: 'Culturals Highlights', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', featured: false },
]

export const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
  'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80',
]
