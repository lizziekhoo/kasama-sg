// src/data/events.js
// Categories for user-added community events. Mirrors the shape of
// PLACE_CATEGORIES in places.js so the map can render event pins the same way
// it renders place pins. Labels ship in all four supported languages.

export const EVENT_CATEGORIES = {
  social:   { icon: '🤝', color: '#e84e7a', label: { en: 'Social',   fil: 'Sosyal',    zh: '社交',   ta: 'சமூகம்' } },
  sports:   { icon: '🏐', color: '#2a7ab0', label: { en: 'Sports',   fil: 'Palakasan', zh: '运动',   ta: 'விளையாட்டு' } },
  worship:  { icon: '🙏', color: '#6b4a9e', label: { en: 'Worship',  fil: 'Pagsamba',  zh: '宗教',   ta: 'வழிபாடு' } },
  workshop: { icon: '🎓', color: '#d98324', label: { en: 'Workshop', fil: 'Workshop',  zh: '讲座',   ta: 'பயிலரங்கம்' } },
  other:    { icon: '📌', color: '#5a7d3a', label: { en: 'Other',    fil: 'Iba pa',    zh: '其他',   ta: 'மற்றவை' } },
}

export const DEFAULT_EVENT_CATEGORY = 'social'

export function getEventCategory(categoryId) {
  return EVENT_CATEGORIES[categoryId] || EVENT_CATEGORIES.other
}

// Returns the label for an event category in the user's language (English fallback).
export function getEventCategoryLabel(categoryId, lang) {
  const cat = getEventCategory(categoryId)
  return cat.label[lang] || cat.label.en
}
