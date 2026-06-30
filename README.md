# RAW Vision Media
### Frames Speak Louder.

Official Photography, Cinematography & Media Club Website — NMIMS Shirpur · Est. 2016

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Routing | React Router v6 |
| Backend | Supabase (Auth + PostgreSQL) |
| Media Storage | Google Drive (linked) |
| Deployment | Vercel |

---

## Project Structure

```
RAW-VISION-MEDIA/
├── public/
│   └── favicon.png
├── src/
│   ├── assets/
│   │   ├── a-black.png
│   │   ├── a.png
│   │   ├── about-img.jpeg
│   │   ├── hero-video.mp4
│   │   ├── r-black.png
│   │   ├── r.png
│   │   ├── raw-logo.png
│   │   ├── raw-white-transparent.png
│   │   ├── w-black.png
│   │   └── w.png
│   ├── components/
│   │   ├── about/
│   │   │   └── TeamCard.jsx
│   │   ├── archive/
│   │   │   └── YearSection.jsx
│   │   ├── common/
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── events/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventFilters.jsx
│   │   │   └── EventGallery.jsx
│   │   ├── forms/
│   │   │   ├── CoverageModal.jsx
│   │   │   ├── DynamicFormModal.jsx
│   │   │   └── JoinRawModal.jsx
│   │   ├── home/
│   │   │   ├── DynamicFormsMarquee.jsx
│   │   │   ├── FeaturedEvents.jsx
│   │   │   ├── FeaturedWorks.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   └── MottoStrip.jsx
│   │   ├── scrapbook/
│   │   │   └── ScrapbookGrid.jsx
│   │   └── videos/
│   │       └── VideoCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AboutAdmin.jsx
│   │   │   ├── AnalyticsAdmin.jsx
│   │   │   ├── ApplicationsAdmin.jsx
│   │   │   ├── ArchiveAdmin.jsx
│   │   │   ├── CoverageAdmin.jsx
│   │   │   ├── CoverImageUploader.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DriveThumbnailPicker.jsx
│   │   │   ├── EventsAdmin.jsx
│   │   │   ├── FormsAdmin.jsx
│   │   │   ├── ScrapbookAdmin.jsx
│   │   │   ├── SettingsAdmin.jsx
│   │   │   ├── UsersAdmin.jsx
│   │   │   └── VideosAdmin.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── About.jsx
│   │   ├── Archive.jsx
│   │   ├── EventDetails.jsx
│   │   ├── Events.jsx
│   │   ├── Home.jsx
│   │   ├── Scrapbook.jsx
│   │   └── Videos.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── formService.js
│   │   └── supabase.js
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
---

## Fonts Used

- **Cormorant Garamond** — Editorial serif for body/descriptions
- **Playfair Display** — Display font for headings
- **Bebas Neue** — Condensed newspaper-style labels
- **Oswald** — Navigation, labels, metadata
- **Inter** — Body text, form inputs

---

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `raw-black` | `#0A0A0A` | Dark backgrounds |
| `raw-white` | `#F8F6F1` | Light backgrounds |
| `raw-cream` | `#EDE8DF` | Secondary light bg |
| `raw-ink` | `#1A1A1A` | Primary text (light mode) |
| `raw-accent` | `#C8A96E` | Gold accent color |
| `raw-gray` | `#6B6B6B` | Muted text |

---
hiii 
## License

© RAW Vision Media · NMIMS Shirpur · All rights reserved.
