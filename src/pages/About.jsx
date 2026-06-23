import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { useTheme } from '../context/ThemeContext'
import { userService } from '../services/formService'
import { getImageUrl } from '../utils/helpers'
import aboutImg from '../assets/about-img.jpeg'

const DEPARTMENTS_INFO = [
  { name: 'Photography',      desc: 'Capturing every decisive moment with precision and artistry.' },
  { name: 'Cinematography',   desc: 'Crafting cinematic stories through motion and light.' },
  { name: 'Editing',          desc: 'Transforming raw footage into polished visual narratives.' },
  { name: 'Graphic Designing',desc: 'Designing visual identities and creative communication.' },
  { name: 'Documentation',    desc: 'Recording the legacy of every event in written and visual form.' },
  { name: 'Marketing',        desc: 'Amplifying RAWs presence across platforms and audiences.' },
  { name: 'Logistics',        desc: 'Ensuring every shoot runs seamlessly behind the scenes.' },
  { name: 'Data Handling',    desc: 'Managing archives, analytics, and media databases.' },
]

function MemberCard({ member, dim = false }) {
  const { isDark } = useTheme()
  const photoUrl = getImageUrl(member.photo)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group text-center ${dim ? 'opacity-60' : ''}`}
    >
      <div className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 overflow-hidden rounded-full border-2 border-transparent group-hover:border-raw-accent transition-colors ${isDark ? 'bg-gray-800' : 'bg-raw-cream'}`}>
        {photoUrl
          ? <img src={photoUrl} alt={member.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
          : <div className="w-full h-full flex items-center justify-center"><span className="font-condensed text-3xl sm:text-4xl text-raw-accent">{member.name?.[0]}</span></div>
        }
      </div>
      <h4 className={`font-display text-sm sm:text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-raw-ink'}`}>{member.name}</h4>
      <p className="font-oswald text-[10px] sm:text-[11px] tracking-widest text-raw-accent uppercase mt-0.5">{member.role}</p>
      {member.department && (
        <p className={`font-oswald text-[10px] sm:text-[11px] tracking-wider uppercase mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{member.department}</p>
      )}
    </motion.div>
  )
}

// Faculty has no academic_year — kept as its own standalone, permanent block.
function SectionBlock({ eyebrow, title, members }) {
  const { isDark } = useTheme()
  if (!members?.length) return null
  return (
    <div>
      <div className={`mb-8 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`} style={{ borderTopWidth: 3, borderTopColor: isDark ? '#C8A96E' : '#1A1A1A', borderTopStyle: 'solid', paddingTop: '16px' }}>
        {eyebrow && <p className="section-eyebrow mb-1">{eyebrow}</p>}
        <h3 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{title}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
        {members.map(m => <MemberCard key={m.id} member={m} />)}
      </div>
    </div>
  )
}

// One combined panel per academic year. Everyone for that year sits together
// in a single flat grid, ordered by position — no split by role or department.
function YearPanel({ year, isCurrent, members }) {
  const { isDark } = useTheme()
  if (!members.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
      style={{
        borderTopWidth: 4,
        borderTopStyle: 'solid',
        borderTopColor: isCurrent ? '#C8A96E' : (isDark ? '#3a3a3a' : '#cfcfcf'),
      }}
    >
      {/* Panel header */}
      <div className={`px-5 sm:px-8 md:px-10 py-6 sm:py-8 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <p className="section-eyebrow mb-1">{isCurrent ? 'Current Team' : 'Alumni'}</p>
        <h2 className={`editorial-heading text-3xl sm:text-4xl ${isCurrent ? (isDark ? 'text-white' : 'text-raw-ink') : (isDark ? 'text-gray-300' : 'text-gray-600')}`}>
          {year}
        </h2>
        <p className={`font-oswald text-[10px] tracking-widest uppercase mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {members.length} member{members.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Everyone, together — role shows under each photo, no separate sections */}
      <div className="px-5 sm:px-8 md:px-10 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
          {members.map(m => <MemberCard key={m.id} member={m} dim={!isCurrent} />)}
        </div>
      </div>
    </motion.div>
  )
}

export default function About() {
  const { isDark } = useTheme()
  const [allMembers, setAllMembers] = useState([])
  const [teamYears, setTeamYears] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([userService.getTeamMembers(), userService.getTeamYears()])
      .then(([members, years]) => { setAllMembers(members); setTeamYears(years) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const faculty = allMembers
    .filter(m => m.type === 'faculty')
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

  // academic_year (text, e.g. "2026-27") is what drives the team-by-year grouping.
  // Faculty are excluded — they're permanent and shown in their own block above.
  const allYears = [...new Set(
    allMembers.filter(m => m.type !== 'faculty' && m.academic_year).map(m => m.academic_year)
  )].sort((a, b) => b.localeCompare(a))

  // Prefer the explicit "is_current" flag from team_years (set by the admin);
  // fall back to the latest label if that table is empty/not set up yet.
  const currentYear = teamYears.find(y => y.is_current)?.label || allYears[0]
  const pastYears = allYears.filter(y => y !== currentYear)

  // Everyone for a given year, together, ordered by position — no split by role or department.
  const membersForYear = (year) => allMembers
    .filter(m => m.type !== 'faculty' && m.academic_year === year)
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

  const statsBg = isDark ? 'bg-raw-darkgray' : 'bg-raw-cream'

  return (
    <MainLayout>
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>

        {/* Hero */}
        <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden bg-raw-black">
          <div className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: `url(${aboutImg})`
            }} />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 md:p-16 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-oswald text-xs tracking-[0.3em] text-white/50 uppercase mb-2">Est. 2016 · NMIMS Shirpur</p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-white font-bold">About RAW</h1>
              <p className="font-serif text-lg sm:text-xl italic text-white/70 mt-2">The Official Media Club</p>
            </motion.div>
          </div>
        </div>

        {/* Mission / Vision / History */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
            {[
              { eyebrow: 'Our Story', title: 'History', body: 'RAW Vision Media was founded in 2016 with a simple belief — that every story deserves to be told well. From humble beginnings with a handful of cameras, we have grown into a full-spectrum media club covering photography, videography, design, and documentation for NMIMS Shirpur.' },
              { eyebrow: 'What drives us', title: 'Mission', body: 'To document the vibrant life of NMIMS Shirpur through visual storytelling — capturing not just events, but the emotions, energy, and legacy of every moment that defines our campus community.' },
              { eyebrow: 'Where we\'re going', title: 'Vision', body: 'To be the most impactful student media organization in western Maharashtra — producing work that competes with professional studios while building the next generation of creative talent.' },
            ].map(({ eyebrow, title, body }) => (
              <div key={title} className={`border-t-4 pt-6 ${isDark ? 'border-raw-accent' : 'border-raw-ink'}`}>
                <p className="section-eyebrow mb-2">{eyebrow}</p>
                <h2 className={`font-display text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-raw-ink'}`}>{title}</h2>
                <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={`${statsBg} border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { num: '2016', label: 'Established' },
              { num: '8+',   label: 'Departments' },
              { num: '500+', label: 'Events Covered' },
              { num: '10K+', label: 'Photos Shot' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className={`font-condensed text-3xl sm:text-4xl md:text-5xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>{stat.num}</div>
                <div className={`font-oswald text-xs tracking-widest uppercase mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="mb-8 sm:mb-10">
              <p className="section-eyebrow mb-2">What we do</p>
              <h2 className={`editorial-heading text-3xl sm:text-4xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>Our Departments</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {DEPARTMENTS_INFO.map((dept, i) => (
                <motion.div key={dept.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={`p-5 sm:p-6 border transition-colors ${isDark ? 'border-gray-800 hover:border-raw-accent' : 'border-gray-200 hover:border-raw-ink'}`}>
                  <h3 className={`font-condensed text-lg sm:text-xl tracking-wide mb-2 ${isDark ? 'text-white' : 'text-raw-ink'}`}>{dept.name}</h3>
                  <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dept.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TEAM ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">

          {loading ? (
            <div className="py-16 text-center">
              <div className={`font-condensed text-2xl tracking-widest animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading team...</div>
            </div>
          ) : (
            <>
              {/* Faculty — permanent, no year, stays as its own block */}
              <SectionBlock eyebrow="Faculty" title="Faculty In-Charge" members={faculty} />

              {/* Each academic year is ONE panel — everyone together, no role split */}
              {currentYear && (
                <YearPanel year={currentYear} isCurrent members={membersForYear(currentYear)} />
              )}

              {pastYears.map(year => (
                <YearPanel key={year} year={year} isCurrent={false} members={membersForYear(year)} />
              ))}
            </>
          )}
        </div>

        {/* Quote */}
        <div className={`py-16 sm:py-20 px-4 sm:px-6 ${isDark ? 'bg-raw-darkgray' : 'bg-raw-ink'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-condensed text-7xl sm:text-8xl text-white/10 leading-none">"</p>
            <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-white italic leading-relaxed -mt-8">
              We don't just document events. We preserve memories, tell stories, and build a legacy one frame at a time.
            </blockquote>
            <div className="h-px w-12 bg-raw-accent mx-auto mt-6 mb-4" />
            <p className="font-oswald text-xs tracking-[0.3em] text-white/40 uppercase">RAW Vision Media · Since 2016</p>
          </div>
        </div>

      </div>
    </MainLayout>
  )
}