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
      <div className={`relative w-20 h-20 mx-auto mb-3 overflow-hidden rounded-full border-2 border-transparent group-hover:border-raw-accent transition-colors ${isDark ? 'bg-gray-800' : 'bg-raw-cream'}`}>
        {photoUrl
          ? <img src={photoUrl} alt={member.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
          : <div className="w-full h-full flex items-center justify-center"><span className="font-condensed text-2xl text-raw-accent">{member.name?.[0]}</span></div>
        }
      </div>
      <h4 className={`font-display text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-raw-ink'}`}>{member.name}</h4>
      <p className="font-oswald text-[10px] tracking-widest text-raw-accent uppercase mt-0.5">{member.role}</p>
      {member.department && (
        <p className={`font-oswald text-[10px] tracking-wider uppercase mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{member.department}</p>
      )}
    </motion.div>
  )
}

function SectionBlock({ eyebrow, title, members, dim = false }) {
  const { isDark } = useTheme()
  if (!members?.length) return null
  return (
    <div>
      <div className={`mb-8 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`} style={{ borderTopWidth: 3, borderTopColor: dim ? (isDark ? '#444' : '#ccc') : (isDark ? '#C8A96E' : '#1A1A1A'), borderTopStyle: 'solid', paddingTop: '16px' }}>
        {eyebrow && <p className="section-eyebrow mb-1">{eyebrow}</p>}
        <h3 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{title}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {members.map(m => <MemberCard key={m.id} member={m} dim={dim} />)}
      </div>
    </div>
  )
}

export default function About() {
  const { isDark } = useTheme()
  const [allMembers, setAllMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getTeamMembers()
      .then(d => setAllMembers(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // helpers
  const byType = (type, year = null) => allMembers.filter(m =>
    m.type === type && (year ? m.academic_year === year : true)
  ).sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

  const faculty   = byType('faculty')

  // current year = highest academic_year value among student_incharge
  const allYears = [...new Set(
    allMembers.filter(m => m.academic_year).map(m => m.academic_year)
  )].sort((a, b) => b.localeCompare(a))

  const currentYear = allYears[0]
  const pastYears   = allYears.slice(1)

  const statsBg = isDark ? 'bg-raw-darkgray' : 'bg-raw-cream'

  return (
    <MainLayout>
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>

        {/* Hero */}
        <div className="relative h-80 md:h-96 overflow-hidden bg-raw-black">
          <div className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: `url(${aboutImg})`
            }} />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-oswald text-xs tracking-[0.3em] text-white/50 uppercase mb-2">Est. 2016 · NMIMS Shirpur</p>
              <h1 className="font-display text-5xl md:text-7xl text-white font-bold">About RAW</h1>
              <p className="font-serif text-xl italic text-white/70 mt-2">The Official Media Club</p>
            </motion.div>
          </div>
        </div>

        {/* Mission / Vision / History */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
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
          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '2016', label: 'Established' },
              { num: '8+',   label: 'Departments' },
              { num: '500+', label: 'Events Covered' },
              { num: '10K+', label: 'Photos Shot' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className={`font-condensed text-4xl md:text-5xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>{stat.num}</div>
                <div className={`font-oswald text-xs tracking-widest uppercase mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="mb-10">
              <p className="section-eyebrow mb-2">What we do</p>
              <h2 className={`editorial-heading text-4xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>Our Departments</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {DEPARTMENTS_INFO.map((dept, i) => (
                <motion.div key={dept.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={`p-6 border transition-colors ${isDark ? 'border-gray-800 hover:border-raw-accent' : 'border-gray-200 hover:border-raw-ink'}`}>
                  <h3 className={`font-condensed text-xl tracking-wide mb-2 ${isDark ? 'text-white' : 'text-raw-ink'}`}>{dept.name}</h3>
                  <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dept.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TEAM ── */}
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">

          {loading ? (
            <div className="py-16 text-center">
              <div className={`font-condensed text-2xl tracking-widest animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading team...</div>
            </div>
          ) : (
            <>
              {/* Faculty — permanent, no year */}
              <SectionBlock eyebrow="Faculty" title="Faculty In-Charge" members={faculty} />

              {/* Current year */}
              {currentYear && (
                <div className="space-y-12">
                  <div>
                    <p className="section-eyebrow mb-1">Current Team</p>
                    <h2 className={`editorial-heading text-4xl ${isDark ? 'text-white' : 'text-raw-ink'}`}>{currentYear}</h2>
                  </div>
                  <SectionBlock eyebrow="Leadership" title="Student In-Charge" members={byType('student_incharge', currentYear)} />
                  <SectionBlock eyebrow="Academic"   title="School Heads"       members={byType('school_head', currentYear)} />
                  <SectionBlock eyebrow="Team"       title="Departmental Heads" members={byType('dept_head', currentYear)} />
                  {byType('member', currentYear).length > 0 && (
                    <SectionBlock eyebrow="Members" title="Team Members" members={byType('member', currentYear)} />
                  )}
                </div>
              )}

              {/* Past years */}
              {pastYears.map(year => (
                <div key={year} className="space-y-10">
                  <div className={`border-t pt-6 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                    <p className="section-eyebrow mb-1">Alumni</p>
                    <h2 className={`editorial-heading text-3xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Team {year}</h2>
                  </div>
                  {['student_incharge','school_head','dept_head','member'].map(type => {
                    const m = byType(type, year)
                    if (!m.length) return null
                    const labels = { student_incharge: 'Student In-Charge', school_head: 'School Heads', dept_head: 'Departmental Heads', member: 'Members' }
                    return <SectionBlock key={type} title={labels[type]} members={m} dim />
                  })}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Quote */}
        <div className={`py-20 px-6 ${isDark ? 'bg-raw-darkgray' : 'bg-raw-ink'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-condensed text-8xl text-white/10 leading-none">"</p>
            <blockquote className="font-serif text-2xl md:text-3xl text-white italic leading-relaxed -mt-8">
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