// src/lib/announcements.js
// Data access for the admin-curated announcements feed. Reads are public;
// writes are admin-only at the database (RLS), so the app doesn't need to
// gate beyond hiding the form for non-admins. Fails soft to an empty list.

import { supabase } from './supabase'

export async function listAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function createAnnouncement(payload) {
  const { data, error } = await supabase
    .from('announcements')
    .insert(payload)            // author_id filled by the DB default (auth.uid())
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAnnouncement(id) {
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw error
  return true
}
