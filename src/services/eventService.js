import { supabase } from './supabase'

export const eventService = {
  async getEvents({ year, featured, visibility = 'public', limit, category } = {}) {
    let query = supabase.from('events').select('*').order('event_date', { ascending: false })
    if (year) query = query.eq('year', year)
    if (featured !== undefined) query = query.eq('featured', featured)
    if (visibility) query = query.eq('visibility', visibility)
    if (category) query = query.eq('category', category)
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getEventById(id) {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async getEventBySlug(slug) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error

    return data
  },

  async createEvent(event) {
    const { data, error } = await supabase.from('events').insert(event).select().single()
    if (error) throw error
    return data
  },

  async updateEvent(id, updates) {
    const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteEvent(id) {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) throw error
  },

  async getYears() {
    const { data, error } = await supabase.from('events').select('year').order('year', { ascending: false })
    if (error) throw error
    const years = [...new Set(data.map(e => e.year))]
    return years
  }
}

export default eventService
