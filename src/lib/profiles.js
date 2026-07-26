// src/lib/profiles.js
// Read/write a user's profile (name, bio, area) and expose a small hook so the
// home greeting and the Me page stay in sync. Cloud-only; a missing profile
// just reads as null and callers fall back gracefully.

import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useSession } from './session'

export async function getProfile(userId) {
  if (!userId) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) return null
  return data
}

export async function upsertProfile({ id, name, bio, area }) {
  // created_by / is_admin are never sent from the client — is_admin is pinned
  // by a database trigger, so it can't be tampered with from the app.
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id, name, bio, area })
    .select()
    .single()
  if (error) throw error
  return data
}

// Resolve several user ids to { id: name } in a single query — used to show
// author/owner names on announcements and organization pages.
export async function getNames(userIds = []) {
  const ids = [...new Set(userIds.filter(Boolean))]
  if (ids.length === 0) return {}
  const { data } = await supabase.from('profiles').select('id, name').in('id', ids)
  const map = {}
  ;(data || []).forEach(p => { map[p.id] = p.name })
  return map
}

// Fetches the signed-in user's profile once; returns null until loaded.
export function useProfile() {
  const session = useSession()
  const userId = session?.user?.id
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    let alive = true
    if (!userId) return
    getProfile(userId).then(p => { if (alive) setProfile(p) })
    return () => { alive = false }
  }, [userId])
  return profile
}

// First letters of the first two words, for the initials avatar.
export function initialsOf(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
