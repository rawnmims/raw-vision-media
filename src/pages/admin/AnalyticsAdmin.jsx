import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, FileText, Inbox, Image, Video, TrendingUp } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../services/supabase'

export default function AnalyticsAdmin() {
  const { isDark } = useTheme()
  const [stats, setStats] = useState({
    users: 0, events: 0, applications: 0,
    coverage: 0, scrapbook: 0, videos: 0,
    students: 0, faculty: 0, external: 0, admins: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          { count: users },
          { count: events },
          { count: applications },
          { count: coverage },
          { count: scrapbook },
          { count: videos },
          { count: students },
          { count: faculty },
          { count: external },
          { count: admins },
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('applications').select('id', { count: 'exact', head: true }),
          supabase.from('coverage_requests').select('id', { count: 'exact', head: true }),
          supabase.from('scrapbook').select('id', { count: 'exact', head: true }),
          supabase.from('videos').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'faculty'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'external'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
        ])
        setStats({ users, events, applications, coverage, scrapbook, videos, students, faculty, external, admins })
      } catch {}
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const mainStats = [
    { label: 'Total Users', value: stats.users, icon: Users, color: '#C8A96E' },
    { label: 'Total Events', value: stats.events, icon: Calendar, color: '#C8A96E' },
    { label: 'Applications', value: stats.applications, icon: FileText, color: '#C8A96E' },
    { label: 'Coverage Requests', value: stats.coverage, icon: Inbox, color: '#C8A96E' },
    { label: 'Scrapbook Photos', value: stats.scrapbook, icon: Image, color: '#C8A96E' },
    { label: 'Videos', value: stats.videos, icon: Video, color: '#C8A96E' },
  ]

  const userBreakdown = [
    { label: 'Students', value: stats.students, pct: stats.users ? Math.round((stats.students / stats.users) * 100) : 0 },
    { label: 'Faculty', value: stats.faculty, pct: stats.users ? Math.round((stats.faculty / stats.users) * 100) : 0 },
    { label: 'External', value: stats.external, pct: stats.users ? Math.round((stats.external / stats.users) * 100) : 0 },
    { label: 'Admins', value: stats.admins, pct: stats.users ? Math.round((stats.admins / stats.users) * 100) : 0 },
  ]

  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <p className="section-eyebrow mb-1">Insights</p>
          <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Analytics</h1>
          <p className={`font-serif text-sm italic mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Live data from Supabase</p>
        </div>

        {/* Main stats */}
        <div>
          <p className={`font-oswald text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Platform Overview</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {mainStats.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`p-6 border ${cardBg}`}
              >
                <Icon size={18} style={{ color }} className="mb-4" />
                <div className={`font-condensed text-4xl mb-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                  {loading ? <span className="animate-pulse text-gray-500">—</span> : value}
                </div>
                <div className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* User breakdown */}
        <div>
          <p className={`font-oswald text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>User Breakdown</p>
          <div className={`p-6 border ${cardBg}`}>
            <div className="space-y-4">
              {userBreakdown.map(({ label, value, pct }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
                    <span className={`font-condensed text-lg ${isDark ? 'text-white' : 'text-raw-ink'}`}>{loading ? '—' : value}</span>
                  </div>
                  <div className={`w-full h-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <motion.div
                      className="h-full bg-raw-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                  <p className={`font-oswald text-[10px] tracking-wider mt-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>{pct}% of users</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
