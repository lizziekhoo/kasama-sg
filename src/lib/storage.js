// src/lib/storage.js
// Safe wrapper around localStorage for salary entries, offline rights content,
// and saved map locations.

const KEYS = {
  salary: 'kasama_salary',
  rightsCache: 'kasama_rights_cache',
  savedLocations: 'kasama_saved_locations',
}

const SAVED_LOCATIONS_EVENT = 'kasama:saved-locations-changed'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    // Storage may be unavailable, blocked or contain invalid JSON.
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
  return read(KEYS.salary, [])
}

export function saveSalaryEntries(entries) {
  return write(KEYS.salary, entries)
}

export function addSalaryEntry(entry) {
  const entries = getSalaryEntries()

  const newEntry = {
    id: makeId(),
    createdAt: nowIso(),
    ...entry,
  }

  entries.push(newEntry)
  saveSalaryEntries(entries)

  return newEntry
}

export function deleteSalaryEntry(id) {
  const entries = getSalaryEntries().filter(entry => entry.id !== id)

  saveSalaryEntries(entries)

  return entries
}

/* ---------- Rights-library offline cache ---------- */

export function getRightsCache() {
  return read(KEYS.rightsCache, null)
}

export function setRightsCache(pages) {
  return write(KEYS.rightsCache, {
    fetchedAt: nowIso(),
    pages,
  })
}

/* ---------- Saved map locations ---------- */

// A saved item stores only its type and ID. The app retrieves the latest place
// or event data from its normal data source, preventing stale duplicated data.
export function getSavedLocations() {
  const stored = read(KEYS.savedLocations, [])

  if (!Array.isArray(stored)) {
    return []
  }

  const unique = new Map()

  stored.forEach(item => {
    const normalised = normaliseSavedLocation(item)

    if (normalised) {
      unique.set(normalised.key, normalised)
    }
  })

  return [...unique.values()]
}

export function isLocationSaved(type, id) {
  const key = makeLocationKey(type, id)

  if (!key) {
    return false
  }

  return getSavedLocations().some(item => item.key === key)
}

export function saveLocation({ type, id }) {
  const normalised = normaliseSavedLocation({
    type,
    id,
    savedAt: nowIso(),
  })

  if (!normalised) {
    return false
  }

  const locations = getSavedLocations()

  if (locations.some(item => item.key === normalised.key)) {
    return true
  }

  const success = write(
    KEYS.savedLocations,
    [...locations, normalised]
  )

  if (success) {
    notifySavedLocationsChanged()
  }

  return success
}

export function removeSavedLocation(type, id) {
  const key = makeLocationKey(type, id)

  if (!key) {
    return false
  }

  const existing = getSavedLocations()
  const updated = existing.filter(item => item.key !== key)

  if (updated.length === existing.length) {
    return true
  }

  const success = write(KEYS.savedLocations, updated)

  if (success) {
    notifySavedLocationsChanged()
  }

  return success
}

// Returns the location's new saved state.
export function toggleSavedLocation({ type, id }) {
  if (isLocationSaved(type, id)) {
    const success = removeSavedLocation(type, id)
    return success ? false : true
  }

  const success = saveLocation({ type, id })
  return success
}

// Components can subscribe so that saved pins update immediately whenever a
// place or event is saved elsewhere in the app.
export function subscribeSavedLocations(callback) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  function handleLocalChange() {
    callback(getSavedLocations())
  }

  function handleStorageChange(event) {
    if (event.key === KEYS.savedLocations) {
      callback(getSavedLocations())
    }
  }

  window.addEventListener(
    SAVED_LOCATIONS_EVENT,
    handleLocalChange
  )

  window.addEventListener(
    'storage',
    handleStorageChange
  )

  return () => {
    window.removeEventListener(
      SAVED_LOCATIONS_EVENT,
      handleLocalChange
    )

    window.removeEventListener(
      'storage',
      handleStorageChange
    )
  }
}

/* ---------- Small helpers ---------- */

function normaliseSavedLocation(item) {
  if (!item || typeof item !== 'object') {
    return null
  }

  const type =
    item.type === 'place' || item.type === 'event'
      ? item.type
      : null

  const id =
    item.id === undefined || item.id === null
      ? ''
      : String(item.id).trim()

  if (!type || !id) {
    return null
  }

  return {
    key: `${type}:${id}`,
    type,
    id,
    savedAt:
      typeof item.savedAt === 'string'
        ? item.savedAt
        : nowIso(),
  }
}

function makeLocationKey(type, id) {
  if (type !== 'place' && type !== 'event') {
    return null
  }

  if (id === undefined || id === null) {
    return null
  }

  const cleanId = String(id).trim()

  if (!cleanId) {
    return null
  }

  return `${type}:${cleanId}`
}

function notifySavedLocationsChanged() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(SAVED_LOCATIONS_EVENT)
  )
}

function makeId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  )
}

function nowIso() {
  return new Date().toISOString()
}
