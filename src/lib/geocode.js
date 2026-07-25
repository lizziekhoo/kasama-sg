// src/lib/geocode.js
// Turns a typed address into {lat, lng} using OpenStreetMap's Nominatim —
// free, no API key, the same project as the map tiles. This is what lets a
// user drop a pin for an address that isn't one of our curated places.
//
// Best-effort by design: any failure resolves to null, and the caller still
// saves the event (with its address) — it just won't get a pin on the map.
//
// Nominatim usage policy: we send one request per event submission
// (user-initiated), well under the 1-request-per-second limit. Browsers attach
// a Referer header automatically, which satisfies identification requirements.

export async function geocodeAddress(query) {
  if (!query || !query.trim()) return null
  const full = `${query.trim()}, Singapore`
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(full)}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()
    const hit = Array.isArray(data) && data[0]
    if (!hit) return null
    const lat = parseFloat(hit.lat)
    const lng = parseFloat(hit.lon)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null
    return { lat, lng }
  } catch {
    // Network blocked, CORS, private mode — treat as "couldn't place it".
    return null
  }
}
