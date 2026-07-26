// src/lib/organizations.js
// Data access for organization pages. Anyone can read; the creator (owner) can
// update/delete their own. An org's events are just events tagged with
// organization_id, so the org page reuses the events table.

import { supabase } from './supabase'

export async function listOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function getOrganization(id) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) return null
  return data
}

export async function listMyOrganizations(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function eventsForOrg(orgId) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('organization_id', orgId)
    .order('event_date', { ascending: true })
  if (error) return []
  return data || []
}

export async function createOrganization(payload) {
  const { data, error } = await supabase
    .from('organizations')
    .insert(payload)            // owner_id is set by the caller to auth.uid()
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateOrganization(id, patch) {
  const { data, error } = await supabase
    .from('organizations')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteOrganization(id) {
  const { error } = await supabase.from('organizations').delete().eq('id', id)
  if (error) throw error
  return true
}
