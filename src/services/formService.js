import { supabase } from './supabase'

export const formService = {
  async submitJoinApplication(data) {
    const { error } = await supabase.from('applications').insert(data)
    if (error) throw error
  },
  async submitCoverageRequest(data) {
    const { error } = await supabase.from('coverage_requests').insert(data)
    if (error) throw error
  },
  async getApplications() {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  async getCoverageRequests() {
    const { data, error } = await supabase.from('coverage_requests').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  async getSettings() {
    const { data, error } = await supabase.from('website_settings').select('*').single()
    if (error) return null
    return data
  },
  async updateSettings(updates) {
    const { data: existing } = await supabase.from('website_settings').select('id').single()
    if (existing) {
      const { error } = await supabase.from('website_settings').update(updates).eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('website_settings').insert(updates)
      if (error) throw error
    }
  }
}

export const scrapbookService = {
  async getPhotos({ featured } = {}) {
    let query = supabase.from('scrapbook').select('*').order('created_at', { ascending: false })
    if (featured !== undefined) query = query.eq('featured', featured)
    const { data, error } = await query
    if (error) throw error
    return data || []
  },
  async addPhoto(photo) {
    const { data, error } = await supabase.from('scrapbook').insert(photo).select().single()
    if (error) throw error
    return data
  },
  async updatePhoto(id, updates) {
    const { data, error } = await supabase.from('scrapbook').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deletePhoto(id) {
    const { error } = await supabase.from('scrapbook').delete().eq('id', id)
    if (error) throw error
  }
}

export const videoService = {
  async getVideos({ featured } = {}) {
    let query = supabase.from('videos').select('*').order('created_at', { ascending: false })
    if (featured !== undefined) query = query.eq('featured', featured)
    const { data, error } = await query
    if (error) throw error
    return data || []
  },
  async addVideo(video) {
    const { data, error } = await supabase.from('videos').insert(video).select().single()
    if (error) throw error
    return data
  },
  async updateVideo(id, updates) {
    const { data, error } = await supabase.from('videos').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteVideo(id) {
    const { error } = await supabase.from('videos').delete().eq('id', id)
    if (error) throw error
  }
}

export const userService = {
  async getUsers() {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  async updateUserRole(id, role) {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (error) throw error
  },
  async deleteUser(id) {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) throw error
  },
  async getTeamMembers() {
    const { data, error } = await supabase.from('team_members').select('*').order('order_index')
    if (error) return []
    return data || []
  },
  async addTeamMember(member) {
    const { data, error } = await supabase.from('team_members').insert(member).select().single()
    if (error) throw error
    return data
  },
  async updateTeamMember(id, updates) {
    const { data, error } = await supabase.from('team_members').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteTeamMember(id) {
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) throw error
  }
}
