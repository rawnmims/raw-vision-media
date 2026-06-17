import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Shield } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { userService } from '../../services/formService'
import { formatDateShort, getRoleLabel } from '../../utils/helpers'

const ROLES = ['student', 'faculty', 'external', 'admin']

export default function UsersAdmin() {
  const { isDark } = useTheme()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    userService.getUsers()
      .then(d => setUsers(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleRoleChange = async (id, role) => {
    try { await userService.updateUserRole(id, role); load() } catch (e) { alert(e.message) }
  }
  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    try { await userService.deleteUser(id); load() } catch (e) { alert(e.message) }
  }

  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
  const selectCls = `bg-transparent border text-xs font-oswald tracking-wider uppercase outline-none py-1 px-2 cursor-pointer ${isDark ? 'border-gray-700 text-gray-300 focus:border-raw-accent' : 'border-gray-300 text-gray-600 focus:border-raw-ink'}`

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <p className="section-eyebrow mb-1">Manage</p>
          <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Users</h1>
          <p className={`font-serif text-sm italic mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{users.length} registered users</p>
        </div>

        <div className={`border ${cardBg}`}>
          <div className={`grid grid-cols-12 gap-3 px-5 py-3 border-b font-oswald text-xs tracking-widest uppercase ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
            <span className="col-span-4">User</span>
            <span className="col-span-3 hidden sm:block">Email</span>
            <span className="col-span-2">Role</span>
            <span className="col-span-2 hidden md:block">Joined</span>
            <span className="col-span-1 text-right">Del</span>
          </div>

          {loading ? (
            <div className="py-10 text-center"><div className={`font-condensed text-xl animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading...</div></div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <p className={`font-display text-lg italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No users found.</p>
            </div>
          ) : users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className={`grid grid-cols-12 gap-3 items-center px-5 py-4 border-b last:border-0 ${isDark ? 'border-gray-800 hover:bg-gray-900/40' : 'border-gray-100 hover:bg-gray-50'}`}>
              <div className="col-span-4 flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-raw-cream'}`}>
                  <span className="font-condensed text-xs text-raw-accent">{user.name?.[0] || '?'}</span>
                </div>
                <div className="min-w-0">
                  <p className={`font-display text-sm font-bold truncate ${isDark ? 'text-white' : 'text-raw-ink'}`}>{user.name}</p>
                  {user.role === 'admin' && <Shield size={10} className="text-raw-accent inline" />}
                </div>
              </div>
              <p className={`col-span-3 font-sans text-xs hidden sm:block truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
              <div className="col-span-2">
                <select
                  value={user.role || 'student'}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  className={selectCls}
                >
                  {ROLES.map(r => <option key={r} value={r} className="text-raw-ink">{getRoleLabel(r)}</option>)}
                </select>
              </div>
              <p className={`col-span-2 font-oswald text-xs hidden md:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatDateShort(user.created_at)}</p>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => handleDelete(user.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
