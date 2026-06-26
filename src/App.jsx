import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ScrollToTop } from './components/common/ThemeToggle'
import AppRoutes from './routes/AppRoutes'
import LoadingScreen from './components/common/LoadingScreen'

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          {loading && <LoadingScreen onDone={() => setLoading(false)} />}
          {!loading && <AppRoutes />}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}