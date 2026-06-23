import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)

// ── Domain rules ──────────────────────────────────────────────
const DOMAIN_RULES = {
  student:  { domain: '@nmims.in',  label: '@nmims.in' },
  faculty:  { domain: '@nmims.edu', label: '@nmims.edu' },
  external: { domain: '@gmail.com', label: '@gmail.com' },
}

function validateEmailDomain(email, role) {
  const rule = DOMAIN_RULES[role]
  if (!rule) return null
  if (!email.toLowerCase().endsWith(rule.domain)) {
    const labels = {
      student:  'Students must use an @nmims.in email address.',
      faculty:  'Faculty must use an @nmims.edu email address.',
      external: 'External users must use a @gmail.com email address.',
    }
    return labels[role]
  }
  return null
}

function detectRoleFromEmail(email) {
  const e = email.toLowerCase()
  if (e.endsWith('@nmims.in'))  return 'student'
  if (e.endsWith('@nmims.edu')) return 'faculty'
  if (e.endsWith('@gmail.com')) return 'external'
  return null
}

export { DOMAIN_RULES, validateEmailDomain }

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      setProfile(data)
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async ({ email, password }) => {
    const detectedRole = detectRoleFromEmail(email)
    if (!detectedRole) {
      throw new Error('Only @nmims.in, @nmims.edu, or @gmail.com email addresses are allowed.')
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signUp = async ({ name, email, phone, role, password }) => {
    const domainError = validateEmailDomain(email, role)
    if (domainError) throw new Error(domainError)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone, role } }
    })
    if (error) throw error

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, name, email, phone, role
      })
    }
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, isAdmin, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext