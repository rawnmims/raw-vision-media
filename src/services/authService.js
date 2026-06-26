import { supabase } from './supabase'

export const authService = {
  async signUp({ name, email, phone, role, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role }
      }
    })
    if (error) throw error

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
        phone,
        role
      })
      if (profileError) console.error('Profile insert error:', profileError)
    }
    return data
  },

  async checkEmailExists(email) {
    // We attempt a signup with a dummy password.
    // Supabase won't create a duplicate — but it tells us if the email exists
    // by returning a user object with no identities array.
    const { data, error } = await supabase.auth.signUp({
      email,
      password: crypto.randomUUID(), // random — will never actually be used
    })

    if (error) return false // treat errors as "email not found" to avoid leaking info

    // If identities is an empty array, the email already exists in Supabase Auth
    if (data?.user?.identities?.length === 0) {
      return true // email EXISTS
    }

    return false // email does NOT exist
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default authService
