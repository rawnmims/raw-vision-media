import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { useTheme } from '../context/ThemeContext'
import { userService } from '../services/formService'
import { getImageUrl } from '../utils/helpers'
import aboutImg from '../assets/about-img.jpeg'
import MemberPopup from '../components/about/MemberPopup'

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

// Square card, image fills the whole card, details sit on a bottom vignette.
function MemberCard({ member, dim = false, onClick }) {
  const { isDark } = useTheme()
  const photoUrl = getImageUrl(member.photo)

  return (
    <motion.button
      type="button"
      onClick={() => onClick?.(member)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative block w-full aspect-square overflow-hidden text-left ${
        dim ? 'opacity-60' : ''
      } ${isDark ? 'bg-gray-800' : 'bg-raw-cream'}`}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-condensed text-5xl sm:text-6xl text-raw-accent">
            {member.name?.[0]}
          </span>
        </div>
      )}

      {/* Bottom vignette so text stays legible over any photo */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

      {/* Border on hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-raw-accent transition-colors pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 md:p-5">
        <h4 className="font-display text-sm sm:text-lg md:text-xl font-bold leading-tight text-white">
          {member.name}
        </h4>
        <p className="font-oswald text-[9px] sm:text-xs tracking-widest text-raw-accent uppercase mt-0.5 sm:mt-1">
          {member.role}
        </p>
        {member.department && (
          <p className="font-oswald text-[8px] sm:text-xs tracking-wider uppercase mt-0.5 text-gray-300 hidden sm:block">
            {member.department}
          </p>
        )}
      </div>
    </motion.button>
  )
}

// Faculty has no academic_year — kept as its own standalone, permanent block.
function SectionBlock({ eyebrow, title, members, onMemberClick }) {
  const { isDark } = useTheme()
  if (!members?.length) return null
  return (
    <div>
      <div
        className={`mb-8 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
        style={{ borderTopWidth: 3, borderTopColor: isDark ? '#C8A96E' : '#1A1A1A', borderTopStyle: 'solid', paddingTop: '16px' }}
      >
        {eyebrow && <p className="section-eyebrow mb-1">{eyebrow}</p>}
        <h3 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{title}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {members.map(m => (
          <MemberCard key={m.id} member={m} onClick={onMemberClick} />
        ))}
      </div>
    </div>
  )
}

// One combined panel per academic year. Everyone for that year sits together
// in a single flat grid, ordered by position — no split by role or department.
function YearPanel({ year, isCurrent, members, onMemberClick }) {
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
        borderTopColor: isCurrent
          ? '#C8A96E'
          : (isDark ? '#3a3a3a' : '#cfcfcf'),
      }}
    >
      {/* Panel header */}
      <div
        className={`px-5 sm:px-8 md:px-10 py-6 sm:py-8 border-b ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <p className="section-eyebrow text-lg mb-2">
          {isCurrent ? 'Current Team' : 'Alumni'}
        </p>

        <h2
          className={`editorial-heading text-4xl sm:text-5xl ${
            isCurrent
              ? (isDark ? 'text-white' : 'text-raw-ink')
              : (isDark ? 'text-gray-300' : 'text-gray-600')
          }`}
        >
          {year}
        </h2>

        <p
          className={`font-oswald text-sm sm:text-base tracking-widest uppercase mt-3 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          {members.length} member{members.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Everyone, together — role shows on the card, no separate sections */}
      <div className="px-5 sm:px-8 md:px-10 py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {members.map(m => (
            <MemberCard
              key={m.id}
              member={m}
              dim={!isCurrent}
              onClick={onMemberClick}
            />
          ))}
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
  const [selectedMember, setSelectedMember] = useState(null)

  useEffect(() => {
    Promise.all([userService.getTeamMembers(), userService.getTeamYears()])
      .then(([members, years]) => { setAllMembers(members); setTeamYears(years) })
      .catch(() => { })
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
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-[#FAFAFA]'}`}>

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
              {
                eyebrow: 'Our Story',
                title: 'History',
                body: 'Founded in 2016 at Mukesh Patel Technology Park, NMIMS Shirpur, RAW Vision Media is the official media club and the creative soul of the campus. Under the guidance of Prof. Bhushan Inje and Dr. Piyush Ghode, the club has grown into much more; it is the storyteller of the institute, capturing the spirit of student life, every celebration, every achievement, and every unforgettable moment with artistry and vision.'
              },
              {
                eyebrow: 'What drives us',
                title: 'Mission',
                body: 'To capture, preserve, and communicate the spirit of NMIMS Shirpur through impactful visual storytelling. RAW Vision Media is committed to creating high-quality photography, videography, design, and digital content that documents campus life, celebrates achievements, supports institutional events, and empowers students to develop their creative, technical, and professional skills.'
              },
              {
                eyebrow: "Where we're going",
                title: 'Vision',
                body: 'To be the leading student-driven media organization in India, recognized for excellence in visual storytelling, innovation, and creative expression. RAW Vision Media aspires to build a legacy of authentic content, nurture future creative professionals, and become the visual voice that connects, inspires, and represents the NMIMS Shirpur community.'
              },
            ].map(({ eyebrow, title, body }) => (
              <div
                key={title}
                className={`border-t-4 pt-6 ${isDark ? 'border-raw-accent' : 'border-raw-ink'
                  }`}
              >
                <p className="section-eyebrow text-xl mb-2">
                  {eyebrow}
                </p>

                <h2
                  className={`font-display text-2xl xl:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-raw-ink'
                    }`}
                >
                  {title}
                </h2>

                <p
                  className={`font-serif text-sm lg:text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={`${statsBg} border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { num: '2016', label: 'Established' },
              { num: '8+', label: 'Departments' },
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

              <h2
                className={`editorial-heading text-3xl sm:text-4xl ${isDark ? 'text-white' : 'text-raw-ink'
                  }`}
              >
                Our Departments
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {DEPARTMENTS_INFO.map((dept, i) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`p-5 sm:p-6 border transition-colors ${isDark
                      ? 'border-gray-800 hover:border-raw-accent'
                      : 'border-gray-200 hover:border-raw-ink'
                    }`}
                >
                  <h3
                    className={`font-condensed text-xl sm:text-2xl lg:text-3xl tracking-wide mb-3 ${isDark ? 'text-white' : 'text-raw-ink'
                      }`}
                  >
                    {dept.name}
                  </h3>

                  <p
                    className={`font-serif text-base lg:text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                  >
                    {dept.desc}
                  </p>
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
              <SectionBlock
                eyebrow="Faculty"
                title="Faculty In-Charge"
                members={faculty}
                onMemberClick={setSelectedMember}
              />

              {/* Each academic year is ONE panel — everyone together, no role split */}
              {currentYear && (
                <YearPanel
                  year={currentYear}
                  isCurrent
                  members={membersForYear(currentYear)}
                  onMemberClick={setSelectedMember}
                />
              )}

              {pastYears.map(year => (
                <YearPanel
                  key={year}
                  year={year}
                  isCurrent={false}
                  members={membersForYear(year)}
                  onMemberClick={setSelectedMember}
                />
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

      <MemberPopup member={selectedMember} onClose={() => setSelectedMember(null)} />
    </MainLayout>
  )
}