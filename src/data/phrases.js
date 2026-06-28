// src/data/phrases.js
// The phrasebook. We ship the phrases pre-translated into all four languages
// (no live translation API needed — that was a hard requirement from the
// research phase, since helpers often have limited data).
//
// Each phrase is just an object with one field per language, so the UI can
// pick whichever one matches the user's chosen language and fall back to
// English if a translation is ever missing.

export const PHRASE_CATEGORIES = [
  { id: 'greetings',       icon: '👋', name: { en: 'Greetings',       fil: 'Bati',          zh: '问候',       ta: 'வாழ்த்துக்கள்' } },
  { id: 'emergencies',     icon: '🆘', name: { en: 'Emergencies',     fil: 'Emergency',     zh: '紧急',       ta: 'அவசரம்' } },
  { id: 'work',            icon: '💼', name: { en: 'At work',         fil: 'Sa trabaho',    zh: '工作',       ta: 'வேலை' } },
  { id: 'getting_around',  icon: '🚉', name: { en: 'Getting around',  fil: 'Paglalakbay',   zh: '出行',       ta: 'பயணம்' } },
  { id: 'shopping',        icon: '💸', name: { en: 'Shopping',        fil: 'Pamimili',      zh: '购物',       ta: 'கடை' } },
]

export const PHRASES = [
  // --- Greetings ---
  { id: 'p_hello',     category: 'greetings', en: 'Hello',                fil: 'Kamusta',                zh: '你好',                 ta: 'வணக்கம்' },
  { id: 'p_thanks',    category: 'greetings', en: 'Thank you very much',  fil: 'Maraming salamat',       zh: '非常感谢',            ta: 'மிக்க நன்றி' },
  { id: 'p_yes',       category: 'greetings', en: 'Yes',                  fil: 'Oo',                     zh: '是的',                 ta: 'ஆம்' },
  { id: 'p_no',        category: 'greetings', en: 'No',                   fil: 'Hindi',                  zh: '不是',                 ta: 'இல்லை' },
  { id: 'p_excuse',    category: 'greetings', en: 'Excuse me / Sorry',    fil: 'Pasensya na po',         zh: '不好意思',            ta: 'மன்னிக்கவும்' },
  { id: 'p_name',      category: 'greetings', en: 'My name is…',          fil: 'Ako po si…',             zh: '我叫……',              ta: 'என் பெயர்…' },

  // --- Emergencies ---
  { id: 'p_help',      category: 'emergencies', en: 'Please help me!',                 fil: 'Tulungan nyo po ako!',              zh: '请帮帮我！',        ta: 'எனக்கு உதவுங்கள்!' },
  { id: 'p_hospital',  category: 'emergencies', en: 'I need to go to the hospital.',   fil: 'Kailangan ko pong pumunta sa ospital.', zh: '我需要去医院。', ta: 'எனக்கு மருத்துவமனை செல்ல வேண்டும்.' },
  { id: 'p_police',    category: 'emergencies', en: 'Please call the police.',         fil: 'Patawag po ng pulis.',               zh: '请帮我报警。',      ta: 'காவல்துறையை அழைக்கவும்.' },
  { id: 'p_lost',      category: 'emergencies', en: "I'm lost. Can you help me?",      fil: 'Naligaw po ako. Pwede nyo akong tulungan?', zh: '我迷路了。你能帮我吗？', ta: 'நான் வழிதவறிவிட்டேன். எனக்கு உதவ முடியுமா?' },

  // --- At work ---
  { id: 'p_paid',      category: 'work', en: 'When will I be paid?',              fil: 'Kailan ako babayaran?',           zh: '我什么时候能拿到工资？',  ta: 'எனக்கு சம்பளம் எப்போது கிடைக்கும்?' },
  { id: 'p_restday',   category: 'work', en: 'Which day is my rest day?',         fil: 'Anong araw ang rest day ko?',     zh: '我的休息日是哪天？',     ta: 'எனது ஓய்வு நாள் எந்த நாள்?' },
  { id: 'p_unwell',    category: 'work', en: "I'm not well. May I rest?",         fil: 'Hindi po ako maganda ang pakiramdam. Pwede po akong magpahinga?', zh: '我不舒服，可以休息吗？', ta: 'எனக்கு உடம்பு சரியில்லை. ஓய்வெடுக்கலாமா?' },
  { id: 'p_phone',     category: 'work', en: 'May I use my phone?',              fil: 'Pwede ko bang gamitin ang telepono ko?', zh: '我可以用一下手机吗？', ta: 'என் ஃபோனை பயன்படுத்தலாமா?' },

  // --- Getting around ---
  { id: 'p_mrt',       category: 'getting_around', en: 'Where is the MRT station?', fil: 'Saan po ang istasyon ng MRT?',  zh: '地铁站在哪里？',      ta: 'MRT நிலையம் எங்கே?' },
  { id: 'p_getto',     category: 'getting_around', en: 'How do I get to…?',        fil: 'Paano po ako makakapunta sa…?', zh: '我怎么去……？',        ta: '…எப்படி போவது?' },
  { id: 'p_showmap',   category: 'getting_around', en: 'Can you show me on the map?', fil: 'Pwede po nyo bang ipakita sa mapa?', zh: '可以在地图上指给我看吗？', ta: 'வரைபடத்தில் காட்டலாமா?' },

  // --- Shopping ---
  { id: 'p_howmuch',   category: 'shopping', en: 'How much is this?',    fil: 'Magkano po ito?',        zh: '这个多少钱？',     ta: 'இது எவ்வளவு?' },
  { id: 'p_receipt',   category: 'shopping', en: 'May I have a receipt?', fil: 'Pwede po bang makahingi ng resibo?', zh: '可以给我收据吗？', ta: 'ரசீது கொடுங்கள்?' },
  { id: 'p_expensive', category: 'shopping', en: 'That is too expensive.', fil: 'Masyado pong mahal.',  zh: '太贵了。',          ta: 'மிகவும் விலை அதிகம்.' },
]

// Pick the right string for the user's language, dropping back to English.
export function getPhraseText(phrase, lang) {
  return phrase[lang] || phrase.en
}
