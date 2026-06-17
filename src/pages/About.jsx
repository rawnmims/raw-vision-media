import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '../layouts/MainLayout'
import { FacultySection, DepartmentSection } from '../components/about/TeamCard'
import { useTheme } from '../context/ThemeContext'
import { userService } from '../services/formService'

// Sample team data
const SAMPLE_TEAM = {
  faculty: [
    { id: 'f1', name: 'Dr. Bhushan Inje', role: 'Faculty In-Charge', department: 'Engineering', photo: null },
    { id: 'f2', name: 'Dr. Piyush Ghode', role: 'Faculty In-Charge', department: 'Pharmacy', photo: null },
  ],
  student_incharge: [
    { id: 's1', name: 'Shreya Desai', role: 'Student Incharge', department: 'Photography', photo: null },
  ],
  school_heads: [
    { id: 'sh1', name: 'Priya Verma', role: 'School Head', department: 'School of Technology', photo: null },
    { id: 'sh2', name: 'Rahul Mehta', role: 'School Head', department: 'School of Management', photo: null },
    { id: 'sh3', name: 'Sneha Joshi', role: 'School Head', department: 'School of Commerce', photo: null },
  ],
  dept_heads: [
    { id: 'dh1', name: 'Karan Shah', role: 'Head', department: 'Photography', photo: null },
    { id: 'dh2', name: 'Nisha Gupta', role: 'Head', department: 'Cinematography', photo: null },
    { id: 'dh3', name: 'Amit Jain', role: 'Head', department: 'Editing', photo: null },
    { id: 'dh4', name: 'Pooja Singh', role: 'Head', department: 'Graphic Designing', photo: null },
    { id: 'dh5', name: 'Vivek Rao', role: 'Head', department: 'Documentation', photo: null },
    { id: 'dh6', name: 'Ananya Nair', role: 'Head', department: 'Marketing', photo: null },
    { id: 'dh7', name: 'Rohan Das', role: 'Head', department: 'Logistics', photo: null },
    { id: 'dh8', name: 'Divya Pillai', role: 'Head', department: 'Data Handling', photo: null },
  ],
  prev2023: [
    { id: 'p1', name: 'Siddharth Iyer', role: 'Student Incharge 2023', department: 'Photography', photo: null },
    { id: 'p2', name: 'Ritika Bose', role: 'Head 2023', department: 'Cinematography', photo: null },
    { id: 'p3', name: 'Mohit Sharma', role: 'Head 2023', department: 'Editing', photo: null },
    { id: 'p4', name: 'Kavya Reddy', role: 'Head 2023', department: 'Design', photo: null },
  ],
  prev2022: [
    { id: 'q1', name: 'Ajay Nair', role: 'Student Incharge 2022', department: 'Photography', photo: null },
    { id: 'q2', name: 'Preethi Kumar', role: 'Head 2022', department: 'Cinematography', photo: null },
    { id: 'q3', name: 'Sahil Mehta', role: 'Head 2022', department: 'Marketing', photo: null },
    { id: 'q4', name: 'Riya Patel', role: 'Head 2022', department: 'Design', photo: null },
  ],
}

const DEPARTMENTS_INFO = [
  { name: 'Photography', desc: 'Capturing every decisive moment with precision and artistry.' },
  { name: 'Cinematography', desc: 'Crafting cinematic stories through motion and light.' },
  { name: 'Editing', desc: 'Transforming raw footage into polished visual narratives.' },
  { name: 'Graphic Designing', desc: 'Designing visual identities and creative communication.' },
  { name: 'Documentation', desc: 'Recording the legacy of every event in written and visual form.' },
  { name: 'Marketing', desc: 'Amplifying RAWs presence across platforms and audiences.' },
  { name: 'Logistics', desc: 'Ensuring every shoot runs seamlessly behind the scenes.' },
  { name: 'Data Handling', desc: 'Managing archives, analytics, and media databases.' },
]

export default function About() {
  const { isDark } = useTheme()
  const [team] = useState(SAMPLE_TEAM)

  const statsBg = isDark ? 'bg-raw-darkgray' : 'bg-raw-cream'

  return (
    <MainLayout>
      <div className={`min-h-screen ${isDark ? 'bg-raw-black' : 'bg-raw-white'}`}>

        {/* Hero */}
        <div className="relative h-80 md:h-96 overflow-hidden bg-raw-black">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1600&q=80)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-oswald text-xs tracking-[0.3em] text-white/50 uppercase mb-2">Est. 2016 · NMIMS Shirpur</p>
              <h1 className="font-display text-5xl md:text-7xl text-white font-bold">About RAW</h1>
              <p className="font-serif text-xl italic text-white/70 mt-2">The Official Media Club</p>
            </motion.div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className={`border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className={`border-t-4 pt-6 ${isDark ? 'border-raw-accent' : 'border-raw-ink'}`}>
              <p className="section-eyebrow mb-2">Our Story</p>
              <h2 className={`font-display text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-raw-ink'}`}>History</h2>
              <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                RAW Vision Media was founded in 2016 with a simple belief — that every story deserves to be told well. 
                From humble beginnings with a handful of cameras, we've grown into a full-spectrum media club covering 
                photography, videography, design, and documentation for NMIMS Shirpur.
              </p>
            </div>
            <div className={`border-t-4 pt-6 ${isDark ? 'border-raw-accent' : 'border-raw-ink'}`}>
              <p className="section-eyebrow mb-2">What drives us</p>
              <h2 className={`font-display text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Mission</h2>
              <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                To document the vibrant life of NMIMS Shirpur through visual storytelling — capturing not just events, 
                but the emotions, energy, and legacy of every moment that defines our campus community.
              </p>
            </div>
            <div className={`border-t-4 pt-6 ${isDark ? 'border-raw-accent' : 'border-raw-ink'}`}>
              <p className="section-eyebrow mb-2">Where we're going</p>
              <h2 className={`font-display text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Vision</h2>
              <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                To be the most impactful student media organization in western Maharashtra — producing work that competes 
                with professional studios while building the next generation of creative talent.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`${statsBg} border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '2016', label: 'Established' },
              { num: '8+', label: 'Departments' },
              { num: '500+', label: 'Events Covered' },
              { num: '10,000+', label: 'Photos Shot' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
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
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`p-6 border ${isDark ? 'border-gray-800 hover:border-raw-accent' : 'border-gray-200 hover:border-raw-ink'} transition-colors`}
                >
                  <h3 className={`font-condensed text-xl tracking-wide mb-2 ${isDark ? 'text-white' : 'text-raw-ink'}`}>{dept.name}</h3>
                  <p className={`font-serif text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dept.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Sections */}
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          <FacultySection members={team.faculty} />
          <DepartmentSection title="Student In-Charge" members={team.student_incharge} eyebrow="Leadership" />
          <DepartmentSection title="School Heads" members={team.school_heads} eyebrow="Academic" />
          <DepartmentSection title="Departmental Heads" members={team.dept_heads} eyebrow="Current Team" />

          {/* Previous Years */}
          <div>
            <div className={`border-t pt-4 mb-8 ${isDark ? 'border-gray-800' : 'border-gray-200'}`} style={{ borderTopWidth: 3 }}>
              <p className="section-eyebrow mb-1">Alumni</p>
              <h3 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Team 2023</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {team.prev2023.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="text-center opacity-75"
                >
                  <div className={`w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-raw-cream'}`}>
                    <span className="font-condensed text-2xl text-raw-accent">{m.name[0]}</span>
                  </div>
                  <h4 className={`font-display text-sm font-bold ${isDark ? 'text-gray-200' : 'text-raw-ink'}`}>{m.name}</h4>
                  <p className="font-oswald text-[10px] tracking-widest text-raw-accent uppercase mt-0.5">{m.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className={`border-t pt-4 mb-8 ${isDark ? 'border-gray-800' : 'border-gray-200'}`} style={{ borderTopWidth: 3 }}>
              <p className="section-eyebrow mb-1">Alumni</p>
              <h3 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Team 2022</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {team.prev2022.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="text-center opacity-60"
                >
                  <div className={`w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <span className="font-condensed text-2xl text-gray-400">{m.name[0]}</span>
                  </div>
                  <h4 className={`font-display text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{m.name}</h4>
                  <p className={`font-oswald text-[10px] tracking-widest uppercase mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{m.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RAW Culture Quote */}
        <div className={`py-20 px-6 ${isDark ? 'bg-raw-darkgray' : 'bg-raw-ink'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-condensed text-8xl text-white/10 leading-none mb-0">"</p>
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
