// src/lib/events.js
// Data access for community events. Cloud (Supabase) is the source of truth
// when it's configured; otherwise — or if a query fails because the table
// isn't there yet — we transparently fall back to on-device storage. That way
// the "add event" feature always works, even in a fresh clone with no backend.
//
// Self-contained on purpose: it keeps its own tiny localStorage helpers so the
// events backend has no dependency on the salary/rights storage module.

import { supabase } from './supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const CACHE_KEY = 'kasama_events_cache' // read-through cache (offline reads)
const LOCAL_KEY = 'kasama_events_local' // degraded-mode store when no backend

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function nowIso() {
  return new Date().toISOString()
}

export function isCloudEnabled() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

// All events, soonest first. Cloud reads write through to the cache so the
// map still has something to show offline / on the next load.
export async function listEvents() {
  if (!isCloudEnabled()) return readJSON(LOCAL_KEY, [])
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  if (error) return readJSON(CACHE_KEY, null)?.events ?? []
  writeJSON(CACHE_KEY, { fetchedAt: nowIso(), events: data })
  return data
}

export async function getEvent(id) {
  if (!isCloudEnabled()) {
    return readJSON(LOCAL_KEY, []).find(e => String(e.id) === String(id)) || null
  }
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    return readJSON(CACHE_KEY, null)?.events?.find(e => String(e.id) === String(id)) || null
  }
  return data
}

// userId is used only for the local fallback (so the creator can delete their
// own event on-device). In the cloud, created_by is pinned by the database
// default + RLS, so the client can't fake it.
export async function createEvent(payload, userId) {
  if (!isCloudEnabled()) {
    const events = readJSON(LOCAL_KEY, [])
    const newEvent = { id: makeId(), createdAt: nowIso(), ...payload, created_by: userId || null }
    events.push(newEvent)
    writeJSON(LOCAL_KEY, events)
    return newEvent
  }
  const { data, error } = await supabase
    .from('events')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteEvent(id) {
  if (!isCloudEnabled()) {
    writeJSON(LOCAL_KEY, readJSON(LOCAL_KEY, []).filter(e => String(e.id) !== String(id)))
    return true
  }
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
  return true
}
