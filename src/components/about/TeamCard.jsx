import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export function TeamCard({ member, index = 0 }) {
  const { isDark } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="group text-center"
    >
      <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-2 border-transparent group-hover:border-raw-accent transition-colors">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-raw-cream'}`}>
            <span className="font-condensed text-3xl text-raw-accent">{member.name?.[0]}</span>
          </div>
        )}
      </div>
      <h4 className={`font-display text-base font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{member.name}</h4>
      <p className="font-oswald text-xs tracking-widest text-raw-accent uppercase mt-0.5">{member.role}</p>
      {member.department && (
        <p className={`font-oswald text-[10px] tracking-wider uppercase mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {member.department}
        </p>
      )}
    </motion.div>
  )
}

export function FacultySection({ members }) {
  const { isDark } = useTheme()
  return (
    <div>
      <div className={`border-t-3 border-b pb-4 mb-8 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} style={{ borderTopWidth: 3, borderTopColor: isDark ? '#C8A96E' : '#1A1A1A' }}>
        <p className="section-eyebrow mb-1">Faculty</p>
        <h3 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Faculty In-Charge</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {members.map((m, i) => <TeamCard key={m.id || i} member={m} index={i} />)}
      </div>
    </div>
  )
}

export function DepartmentSection({ title, members, eyebrow }) {
  const { isDark } = useTheme()
  return (
    <div>
      <div className={`border-t pb-4 mb-8 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} style={{ borderTopWidth: 3 }}>
        {eyebrow && <p className="section-eyebrow mb-1">{eyebrow}</p>}
        <h3 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>{title}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {members.map((m, i) => <TeamCard key={m.id || i} member={m} index={i} />)}
      </div>
    </div>
  )
}
