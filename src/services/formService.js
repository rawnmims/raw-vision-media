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
  },

  // ── Dynamic Forms ─────────────────────────────────────────────
  async getForms({ homepageOnly = false } = {}) {
    let q = supabase.from('dynamic_forms').select('*').order('created_at', { ascending: false })
    if (homepageOnly) q = q.eq('show_on_homepage', true).eq('is_open', true)
    const { data, error } = await q
    if (error) throw error
    return data || []
  },
  async getFormBySlug(slug) {
    const { data, error } = await supabase.from('dynamic_forms').select('*').eq('slug', slug).single()
    if (error) throw error
    return data
  },
  async createForm(form) {
    const { data, error } = await supabase.from('dynamic_forms').insert(form).select().single()
    if (error) throw error
    return data
  },
  async updateForm(id, updates) {
    const { data, error } = await supabase.from('dynamic_forms').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteForm(id) {
    const { error } = await supabase.from('dynamic_forms').delete().eq('id', id)
    if (error) throw error
  },
  async submitFormResponse(formId, slug, response) {
    const { error } = await supabase
      .from('form_responses')
      .insert({
        form_id: formId,
        form_slug: slug,
        response
      })
    if (error) throw error
  },
  async getFormResponses(formId) {
    const { data, error } = await supabase
      .from('form_responses').select('*')
      .eq('form_id', formId).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  async deleteFormResponse(id) {
    const { error } = await supabase
      .from('form_responses')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
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

  // ── Team members ──────────────────────────────────────────────────────────

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
  async deleteTeamMember(id, photoUrl) {
    // best-effort: clean up the stored photo so the bucket doesn't fill up with orphans
    if (photoUrl) {
      try { await this.deleteTeamPhoto(photoUrl) } catch (_) { /* non-fatal */ }
    }
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) throw error
  },

  // ── Team years (table: "team_years") ───────────────────────────────────────
  // Lets the admin create next year's team in advance, before anyone is
  // assigned to it, and explicitly mark which year is "current" on the
  // About page (instead of guessing from the highest label).

  async getTeamYears() {
    const { data, error } = await supabase.from('team_years').select('*').order('label', { ascending: false })
    if (error) return [] // table may not exist yet — callers fall back gracefully
    return data || []
  },
  async addTeamYear(label, isCurrent = false) {
    if (isCurrent) {
      await supabase.from('team_years').update({ is_current: false }).eq('is_current', true)
    }
    const { data, error } = await supabase
      .from('team_years')
      .insert({ label, is_current: isCurrent })
      .select()
      .single()
    if (error) throw error
    return data
  },
  async setCurrentTeamYear(id) {
    await supabase.from('team_years').update({ is_current: false }).eq('is_current', true)
    const { error } = await supabase.from('team_years').update({ is_current: true }).eq('id', id)
    if (error) throw error
  },
  async deleteTeamYear(id) {
    const { error } = await supabase.from('team_years').delete().eq('id', id)
    if (error) throw error
  },

  // ── Photo storage (Supabase Storage bucket: "team-photos") ─────────────────

  async uploadTeamPhoto(file) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error } = await supabase.storage
      .from('team-photos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (error) throw error

    const { data } = supabase.storage.from('team-photos').getPublicUrl(fileName)
    return data.publicUrl
  },
  async deleteTeamPhoto(photoUrl) {
    if (!photoUrl || !photoUrl.includes('/team-photos/')) return
    const fileName = photoUrl.split('/team-photos/').pop()
    if (!fileName) return
    const { error } = await supabase.storage.from('team-photos').remove([fileName])
    if (error) throw error
  },
}