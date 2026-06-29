export const PLACE_CATEGORIES = {
  community:  { icon: '🤝', color: '#e84e7a', label: { en: 'Community',  fil: 'Komunidad',   zh: '社区',    ta: 'சமூகம்' } },
  worship:    { icon: '🙏', color: '#6b4a9e', label: { en: 'Worship',    fil: 'Pagsamba',    zh: '宗教',    ta: 'வழிபாடு' } },
  food:       { icon: '🍲', color: '#d98324', label: { en: 'Familiar food', fil: 'Paboritong pagkain', zh: '家乡美食', ta: 'சொந்த உணவு' } },
  essentials: { icon: '🛒', color: '#2a7ab0', label: { en: 'Shops & essentials', fil: 'Tindahan at pangangailangan', zh: '商店与必需品', ta: 'கடைகள்' } },
  services:   { icon: '🏛️', color: '#5a7d3a', label: { en: 'Services',   fil: 'Serbisyo',    zh: '服务',    ta: 'சேவைகள்' } },
}

export const PLACES = [
  {
    id: 'lucky-plaza',
    name: 'Lucky Plaza',
    category: 'community',
    lat: 1.3049, lng: 103.8318,
    address: '304 Orchard Road, Singapore 238863',
    blurb: 'The heart of the Filipino community in Singapore. On a Sunday this place is packed — remittance shops, Filipino food, and lots of familiar faces.',
    tip: 'Best on Sundays; Orchard MRT is a 2-minute walk.',
  },
  {
    id: 'city-plaza',
    name: 'City Plaza',
    category: 'community',
    lat: 1.3158, lng: 103.8935,
    address: '810 Geylang Road, Singapore 409286',
    blurb: 'A popular weekend meeting spot, especially for the Indonesian community. Cheap eats, clothing, and money changers inside.',
    tip: 'Paya Lebar MRT is right next door.',
  },
  {
    id: 'peninsular-plaza',
    name: 'Peninsular Plaza',
    category: 'community',
    lat: 1.2923, lng: 103.8523,
    address: '111 North Bridge Road, Singapore 179098',
    blurb: 'Known as "Little Myanmar". Burmese groceries, eateries, and a strong community feel in the middle of the city.',
    tip: 'City Hall / Coleman Street area.',
  },
  {
    id: 'sultan-mosque',
    name: 'Sultan Mosque',
    category: 'worship',
    lat: 1.3022, lng: 103.8646,
    address: '3 Muscat Street, Singapore 198833',
    blurb: 'A beautiful and historic mosque in the heart of Kampong Glam. Friday prayers draw a big crowd.',
    tip: 'Remove shoes before entering; modest dress please.',
  },
  {
    id: 'sri-mariamman',
    name: 'Sri Mariamman Temple',
    category: 'worship',
    lat: 1.2820, lng: 103.8454,
    address: '244 South Bridge Road, Singapore 058793',
    blurb: 'Singapore’s oldest Hindu temple, in the middle of Chinatown. Open daily for darshan.',
    tip: 'Shoulders and knees should be covered.',
  },
  {
    id: 'buddha-tooth',
    name: 'Buddha Tooth Relic Temple',
    category: 'worship',
    lat: 1.2814, lng: 103.8440,
    address: '288 South Bridge Road, Singapore 058840',
    blurb: 'A striking four-storey temple in Chinatown. Quiet, free to enter, and a calm place to rest away from the heat.',
    tip: 'Free entry; rooftop garden is worth the lift up.',
  },
  {
    id: 'sts-peter-paul',
    name: 'Church of Saints Peter and Paul',
    category: 'worship',
    lat: 1.2986, lng: 103.8537,
    address: '225 Queen Street, Singapore 188551',
    blurb: 'A Catholic church near Bras Basah that holds regular mass for the Filipino community.',
    tip: 'Check the Sunday mass timings — they fill up fast.',
  },
  {
    id: 'tekka-centre',
    name: 'Tekka Centre',
    category: 'food',
    lat: 1.3068, lng: 103.8532,
    address: '665 Buffalo Road, Singapore 210665',
    blurb: 'A bustling hawker centre and wet market in Little India. Cheap, tasty food from all over the region under one roof.',
    tip: 'Little India MRT is directly underneath.',
  },
  {
    id: 'mustafa',
    name: 'Mustafa Centre',
    category: 'essentials',
    lat: 1.3105, lng: 103.8556,
    address: '145 Syed Alwi Road, Singapore 207704',
    blurb: 'Open 24 hours, every day. You can find almost anything here — electronics, groceries, gold, SIM cards — at fixed, fair prices.',
    tip: 'Open 24/7. Good place to buy a local SIM.',
  },
  {
    id: 'philippines-embassy',
    name: 'Embassy of the Philippines',
    category: 'services',
    lat: 1.3040, lng: 103.8210,
    address: '20 Nassim Road, Singapore 258372',
    blurb: 'Consular help for Filipino citizens — passport renewals, overseas voting, and emergency assistance. Reachable from the helplines page too.',
    tip: 'Bring your passport and an appointment slip if you have one.',
  },
]

export function getPlaceById(id) {
  return PLACES.find(p => p.id === id)
}

export function getCategory(categoryId) {
  return PLACE_CATEGORIES[categoryId]
}

export function getCategoryLabel(categoryId, lang) {
  const cat = PLACE_CATEGORIES[categoryId]
  if (!cat) return categoryId
  return cat.label[lang] || cat.label.en
}
