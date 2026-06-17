import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { useTheme } from '../context/ThemeContext'

export function MainLayout({ children }) {
  const { isDark } = useTheme()
  return (
    <div className={`min-h-screen flex flex-col transition-theme ${isDark ? 'bg-raw-black text-white' : 'bg-raw-white text-raw-ink'}`}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export function AuthLayout({ children }) {
  const { isDark } = useTheme()
  return (
    <div className={`min-h-screen transition-theme ${isDark ? 'bg-raw-black text-white' : 'bg-raw-white text-raw-ink'}`}>
      {children}
    </div>
  )
}
