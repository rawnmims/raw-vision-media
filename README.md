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
src/
├── assets/               # Static assets
├── components/
│   ├── common/           # Navbar, Footer, ThemeToggle, etc.
│   ├── home/             # HeroSection, MottoStrip, FeaturedEvents, etc.
│   ├── events/           # EventCard, EventGrid, EventFilters, EventGallery
│   ├── archive/          # YearSection, ArchiveCard
│   ├── scrapbook/        # ScrapbookGrid, PhotoCard
│   ├── videos/           # VideoCard, VideoGrid
│   ├── forms/            # JoinRawModal, CoverageModal
│   └── about/            # TeamCard, FacultySection, DepartmentSection
├── pages/
│   ├── auth/             # Login, Signup
│   ├── admin/            # Dashboard + all admin sub-pages
│   ├── Home.jsx
│   ├── Events.jsx
│   ├── EventDetails.jsx
│   ├── Archive.jsx
│   ├── Scrapbook.jsx
│   ├── Videos.jsx
│   └── About.jsx
├── layouts/              # MainLayout, AuthLayout, AdminLayout
├── services/             # Supabase service modules
├── context/              # AuthContext, ThemeContext
├── routes/               # AppRoutes.jsx
├── utils/                # constants, helpers
└── styles/               # globals.css
```

---

## Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd raw-vision-media
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase-schema.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Make Yourself Admin

After signing up with your account:

1. Go to your Supabase dashboard → **Table Editor → profiles**
2. Find your user row
3. Change `role` from `student` to `admin`
4. Sign out and sign back in
5. You'll see the **Admin** link in the navbar

---

## Admin Dashboard

Navigate to `/admin` (admin users only).

| Section | Description |
|---------|-------------|
| Dashboard | Overview stats and quick actions |
| Events | Create, edit, delete events with Google Drive links |
| Archive | View all events grouped by year |
| Scrapbook | Add/remove photos with featured toggle |
| Videos | Manage YouTube/video links |
| Applications | View all Join RAW applications |
| Coverage Requests | View all coverage requests |
| Users | Manage roles (student/faculty/external/admin) |
| Analytics | Live platform statistics |
| Settings | Hero text, social links, access control |

---

## Deployment (Vercel)

```bash
npm run build
```

Or connect your GitHub repo to Vercel and add the environment variables in Vercel's dashboard. The `vercel.json` file handles SPA routing automatically.

---

## Google Drive Integration

Events store a `google_drive_folder` URL. The website:
- Shows gallery images from Unsplash as placeholders
- Provides a **Download Originals** button that links to the Drive folder
- Never redirects users directly — the website is the gallery experience

To use real images, you can extend `EventGallery.jsx` to fetch images from a Google Drive API integration or store image URLs directly in Supabase.

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

## License

© RAW Vision Media · NMIMS Shirpur · All rights reserved.
