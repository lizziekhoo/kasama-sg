// src/data/announcements.js
// Categories for the admin-curated announcements feed. Same shape as
// EVENT_CATEGORIES so the feed can reuse the map's badge/chip styling.

export const ANNOUNCEMENT_CATEGORIES = {
  community: { icon: '🤝', color: '#e84e7a', label: { en: 'Community', fil: 'Komunidad', zh: '社区', ta: 'சமூகம்' } },
  legal:     { icon: '⚖️', color: '#5a7d3a', label: { en: 'Legal aid', fil: 'Tulong legal', zh: '法律援助', ta: 'சட்ட உதவி' } },
  medical:   { icon: '🩺', color: '#c0392b', label: { en: 'Medical', fil: 'Medikal', zh: '医疗', ta: 'மருத்துவம்' } },
  workshop:  { icon: '🎓', color: '#d98324', label: { en: 'Workshop', fil: 'Workshop', zh: '讲座', ta: 'பயிலரங்கம்' } },
  other:     { icon: '📌', color: '#2a7ab0', label: { en: 'Other', fil: 'Iba pa', zh: '其他', ta: 'மற்றவை' } },
}

export const DEFAULT_ANNOUNCEMENT_CATEGORY = 'community'

export function getAnnouncementCategory(categoryId) {
  return ANNOUNCEMENT_CATEGORIES[categoryId] || ANNOUNCEMENT_CATEGORIES.other
}

export function getAnnouncementCategoryLabel(categoryId, lang) {
  const cat = getAnnouncementCategory(categoryId)
  return cat.label[lang] || cat.label.en
}
