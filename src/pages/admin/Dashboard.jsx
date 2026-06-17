import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Image, Video, Users, FileText, Inbox, TrendingUp, ArrowRight } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../services/supabase'

const StatCard = ({ label, value, icon: Icon, to, color = '#C8A96E', isDark }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-6 border transition-colors cursor-pointer ${isDark ? 'bg-[#111] border-gray-800 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-400'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon size={20} style={{ color }} />
        <ArrowRight size={14} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
      </div>
      <div className={`font-condensed text-4xl mb-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>{value}</div>
      <div className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</div>
    </motion.div>
  </Link>
)

export default function Dashboard() {
  const { isDark } = useTheme()
  const [stats, setStats] = useState({ events: 0, users: 0, applications: 0, coverage: 0, scrapbook: 0, videos: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, users, applications, coverage, scrapbook, videos] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('applications').select('id', { count: 'exact', head: true }),
          supabase.from('coverage_requests').select('id', { count: 'exact', head: true }),
          supabase.from('scrapbook').select('id', { count: 'exact', head: true }),
          supabase.from('videos').select('id', { count: 'exact', head: true }),
        ])
        setStats({
          events: events.count || 0,
          users: users.count || 0,
          applications: applications.count || 0,
          coverage: coverage.count || 0,
          scrapbook: scrapbook.count || 0,
          videos: videos.count || 0,
        })
      } catch {}
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Events', value: stats.events, icon: Calendar, to: '/admin/events' },
    { label: 'Registered Users', value: stats.users, icon: Users, to: '/admin/users' },
    { label: 'Applications', value: stats.applications, icon: FileText, to: '/admin/applications' },
    { label: 'Coverage Requests', value: stats.coverage, icon: Inbox, to: '/admin/coverage' },
    { label: 'Scrapbook Photos', value: stats.scrapbook, icon: Image, to: '/admin/scrapbook' },
    { label: 'Videos', value: stats.videos, icon: Video, to: '/admin/videos' },
  ]

  const quickActions = [
    { label: 'Add New Event', to: '/admin/events', icon: Calendar },
    { label: 'Upload Photos', to: '/admin/scrapbook', icon: Image },
    { label: 'Add Video', to: '/admin/videos', icon: Video },
    { label: 'View Applications', to: '/admin/applications', icon: FileText },
    { label: 'Coverage Requests', to: '/admin/coverage', icon: Inbox },
    { label: 'Manage Users', to: '/admin/users', icon: Users },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="section-eyebrow mb-1">Control Panel</p>
          <h1 className={`font-display text-4xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Dashboard</h1>
          <p className={`font-serif text-sm italic mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            RAW Vision Media · Admin Overview
          </p>
        </div>

        {/* Stats Grid */}
        <div>
          <p className={`font-oswald text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Overview</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <StatCard {...card} isDark={isDark} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className={`font-oswald text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Quick Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map(({ label, to, icon: Icon }, i) => (
              <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <Link to={to} className={`flex items-center gap-3 p-4 border transition-all group ${isDark ? 'border-gray-800 hover:border-raw-accent bg-[#111]' : 'border-gray-200 hover:border-raw-ink bg-white'}`}>
                  <Icon size={15} className="text-raw-accent" />
                  <span className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-raw-ink'}`}>
                    {label}
                  </span>
                  <ArrowRight size={12} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`p-6 border ${isDark ? 'border-gray-800 bg-[#111]' : 'border-gray-200 bg-white'}`}
        >
          <div className="flex items-start gap-3">
            <TrendingUp size={16} className="text-raw-accent mt-0.5" />
            <div>
              <p className={`font-oswald text-xs tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Supabase Connected</p>
              <p className={`font-sans text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                All data is live from your Supabase project. Configure your <code className="text-raw-accent">VITE_SUPABASE_URL</code> and <code className="text-raw-accent">VITE_SUPABASE_ANON_KEY</code> environment variables for full functionality.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
