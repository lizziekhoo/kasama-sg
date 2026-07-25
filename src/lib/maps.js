// src/lib/maps.js
// Builds a "Open in Google Maps" link for an event. If we have coordinates
// (from a picked place or a geocoded address) we hand those over directly;
// otherwise we pass the address text and let Google Maps resolve it.

export function googleMapsUrl({ lat, lng, address } = {}) {
  const hasCoords =
    typeof lat === 'number' && typeof lng === 'number' &&
    !Number.isNaN(lat) && !Number.isNaN(lng)
  const query = hasCoords
    ? `${lat},${lng}`
    : (address && String(address).trim()) || ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
