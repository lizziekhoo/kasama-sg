// src/data/organizations.js
// Categories for organization pages. Same shape as the place/event categories.

export const ORG_CATEGORIES = {
  community: { icon: '🤝', color: '#e84e7a', label: { en: 'Community', fil: 'Komunidad', zh: '社区', ta: 'சமூகம்' } },
  sports:    { icon: '🏐', color: '#2a7ab0', label: { en: 'Sports', fil: 'Palakasan', zh: '运动', ta: 'விளையாட்டு' } },
  ngo:       { icon: '🕊️', color: '#5a7d3a', label: { en: 'NGO / charity', fil: 'NGO / kawanggawa', zh: '公益组织', ta: 'தொண்டு நிறுவனம்' } },
  worship:   { icon: '🙏', color: '#6b4a9e', label: { en: 'Worship', fil: 'Pagsamba', zh: '宗教', ta: 'வழிபாடு' } },
  other:     { icon: '🏢', color: '#d98324', label: { en: 'Other', fil: 'Iba pa', zh: '其他', ta: 'மற்றவை' } },
}

export const DEFAULT_ORG_CATEGORY = 'community'

export function getOrgCategory(categoryId) {
  return ORG_CATEGORIES[categoryId] || ORG_CATEGORIES.other
}

export function getOrgCategoryLabel(categoryId, lang) {
  const cat = getOrgCategory(categoryId)
  return cat.label[lang] || cat.label.en
}
