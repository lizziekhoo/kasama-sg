// src/lib/storage.js
// Tiny wrapper around localStorage so the salary tracker and the offline
// rights cache don't have to repeat the same try/catch JSON dance everywhere.
// Everything here is safe to call during SSR / if storage is blocked — it
// just falls back to an empty-ish value instead of throwing.

const KEYS = {
  salary: 'kasama_salary',
  rightsCache: 'kasama_rights_cache', // for offline reading of the rights library
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    // Corrupt JSON, private mode, storage full — pretend nothing's there.
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/* ---------- Salary tracker ---------- */

export function getSalaryEntries() {
  // Newest last in the array feels backwards, but it matches how we add to it.
  // We sort by date when we render, so order here doesn't really matter.
  return read(KEYS.salary, [])
}

export function saveSalaryEntries(entries) {
  return write(KEYS.salary, entries)
}

export function addSalaryEntry(entry) {
  const entries = getSalaryEntries()
  const newEntry = { id: makeId(), createdAt: nowIso(), ...entry }
  entries.push(newEntry)
  saveSalaryEntries(entries)
  return newEntry
}

export function deleteSalaryEntry(id) {
  const entries = getSalaryEntries().filter(e => e.id !== id)
  saveSalaryEntries(entries)
  return entries
}

/* ---------- Rights library offline cache ---------- */

// A read-through cache: we always try to show the cached copy first (so the
// page loads instantly / works offline), then refresh from Supabase in the
// background. Returns null if we've never fetched.
export function getRightsCache() {
  return read(KEYS.rightsCache, null)
}

export function setRightsCache(pages) {
  return write(KEYS.rightsCache, {
    fetchedAt: nowIso(),
    pages,
  })
}

/* ---------- small helpers ---------- */

// Not cryptographically random, just good enough for a client-side row id.
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// new Date() is banned in some build sandboxes, but the browser is fine —
// this only ever runs on the client, so it's safe here.
function nowIso() {
  return new Date().toISOString()
}
