export const PHRASE_CATEGORIES = [
  { id: 'greetings',       icon: '👋', name: { en: 'Greetings',       fil: 'Bati',          zh: '问候',       ta: 'வாழ்த்துக்கள்' } },
  { id: 'emergencies',     icon: '🆘', name: { en: 'Emergencies',     fil: 'Emergency',     zh: '紧急',       ta: 'அவசரம்' } },
  { id: 'work',            icon: '💼', name: { en: 'At work',         fil: 'Sa trabaho',    zh: '工作',       ta: 'வேலை' } },
  { id: 'getting_around',  icon: '🚉', name: { en: 'Getting around',  fil: 'Paglalakbay',   zh: '出行',       ta: 'பயணம்' } },
  { id: 'shopping',        icon: '💸', name: { en: 'Shopping',        fil: 'Pamimili',      zh: '购物',       ta: 'கடை' } },
]

export const PHRASES = [
  // --- Greetings ---
  {
    id: 'p_hello', category: 'greetings',
    en: 'Hello', fil: 'Kamusta', zh: '你好', ta: 'வணக்கம்',
    tip: {
      en: 'Use to greet anyone, any time of day.',
      fil: 'Gamitin para bumati kahit kanino, anumang oras.',
      zh: '随时用来向任何人打招呼。',
      ta: 'எந்த நேரத்திலும் யாரை வேண்டுமானாலும் வாழ்த்த இதைப் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_thanks', category: 'greetings',
    en: 'Thank you very much', fil: 'Maraming salamat', zh: '非常感谢', ta: 'மிக்க நன்றி',
    tip: {
      en: 'Shows real gratitude, stronger than a plain thanks.',
      fil: 'Nagpapakita ng tunay na pasasalamat, mas malalim kaysa simpleng salamat.',
      zh: '表达真诚的感谢,比普通的谢谢更郑重。',
      ta: 'உண்மையான நன்றியைக் காட்டும், சாதாரண நன்றியை விட வலுவானது.',
    },
  },
  {
    id: 'p_yes', category: 'greetings',
    en: 'Yes', fil: 'Oo', zh: '是的', ta: 'ஆம்',
    tip: {
      en: 'A clear way to agree or confirm.',
      fil: 'Malinaw na paraan para sumang-ayon o kumpirmahin.',
      zh: '清楚地表示同意或确认。',
      ta: 'ஒப்புக்கொள்ள அல்லது உறுதிப்படுத்த தெளிவான வழி.',
    },
  },
  {
    id: 'p_no', category: 'greetings',
    en: 'No', fil: 'Hindi', zh: '不是', ta: 'இல்லை',
    tip: {
      en: 'Use to politely refuse or disagree.',
      fil: 'Gamitin para magalang na tumanggi o hindi sumang-ayon.',
      zh: '礼貌地拒绝或表示不同意。',
      ta: 'மரியாதையாக மறுக்க அல்லது மாறுபடப் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_excuse', category: 'greetings',
    en: 'Excuse me / Sorry', fil: 'Pasensya na po', zh: '不好意思', ta: 'மன்னிக்கவும்',
    tip: {
      en: 'Use to politely get attention, or to apologise.',
      fil: 'Gamitin para magalang na kumuha ng pansin, o humingi ng pasensya.',
      zh: '礼貌地引起注意或道歉时使用。',
      ta: 'மரியாதையாக கவனத்தை ஈர்க்க அல்லது மன்னி கேட்கப் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_name', category: 'greetings',
    en: 'My name is…', fil: 'Ako po si…', zh: '我叫……', ta: 'என் பெயர்…',
    tip: {
      en: 'Say this when introducing yourself, then say your name.',
      fil: 'Sabihin kapag nagpapakilala, kasunod ang pangalan mo.',
      zh: '自我介绍时说,然后说出你的名字。',
      ta: 'உங்களை அறிமுகப்படுத்தும்போது இதைச் சொல்லுங்கள், பின் பெயரைச் சொல்லுங்கள்.',
    },
  },

  // --- Emergencies ---
  {
    id: 'p_help', category: 'emergencies',
    en: 'Please help me!', fil: 'Tulungan nyo po ako!', zh: '请帮帮我！', ta: 'எனக்கு உதவுங்கள்!',
    tip: {
      en: 'Use in an emergency or when you urgently need help.',
      fil: 'Gamitin sa emergency o kapag desperadong nangangailangan ng tulong.',
      zh: '紧急情况或急需帮助时使用。',
      ta: 'அவசரத்தில் அல்லது உடனடி உதவி தேவைப்படும்போது பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_hospital', category: 'emergencies',
    en: 'I need to go to the hospital.', fil: 'Kailangan ko pong pumunta sa ospital.', zh: '我需要去医院。', ta: 'எனக்கு மருத்துவமனை செல்ல வேண்டும்.',
    tip: {
      en: 'Use if you are sick or hurt and need a doctor.',
      fil: 'Gamitin kung maysakit o nasugatan ka at kailangan ng doktor.',
      zh: '生病或受伤、需要看医生时使用。',
      ta: 'நோய்வாய்ப்பட்டு மருத்துவரைப் பார்க்க வேண்டுமாயின் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_police', category: 'emergencies',
    en: 'Please call the police.', fil: 'Patawag po ng pulis.', zh: '请帮我报警。', ta: 'காவல்துறையை அழைக்கவும்.',
    tip: {
      en: 'Use if you are in danger or see a crime happening.',
      fil: 'Gamitin kung nanganganib ka o may nakitang krimen.',
      zh: '身处危险或目击犯罪时使用。',
      ta: 'ஆபத்தில் இருந்தால் அல்லது குற்றம் நடப்பதைக் கண்டால் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_lost', category: 'emergencies',
    en: "I'm lost. Can you help me?", fil: 'Naligaw po ako. Pwede nyo akong tulungan?', zh: '我迷路了。你能帮我吗？', ta: 'நான் வழிதவறிவிட்டேன். எனக்கு உதவ முடியுமா?',
    tip: {
      en: 'Use when you do not know where you are and need directions.',
      fil: 'Gamitin kapag hindi mo alam ang lugar at kailangan ng direksyon.',
      zh: '不知道身在何处、需要问路时使用。',
      ta: 'எங்கு இருக்கிறீர்கள் எனத் தெரியாமல் வழிகேட்கும்போது பயன்படுத்துங்கள்.',
    },
  },

  // --- At work ---
  {
    id: 'p_paid', category: 'work',
    en: 'When will I be paid?', fil: 'Kailan ako babayaran?', zh: '我什么时候能拿到工资？', ta: 'எனக்கு சம்பளம் எப்போது கிடைக்கும்?',
    tip: {
      en: 'Ask politely to find out your payday.',
      fil: 'Magalang na itanong para malaman ang araw ng pasahod.',
      zh: '礼貌地询问发薪日。',
      ta: 'சம்பள நாளை அறிய மரியாதையாகக் கேளுங்கள்.',
    },
  },
  {
    id: 'p_restday', category: 'work',
    en: 'Which day is my rest day?', fil: 'Anong araw ang rest day ko?', zh: '我的休息日是哪天？', ta: 'எனது ஓய்வு நாள் எந்த நாள்?',
    tip: {
      en: 'Use to confirm your weekly rest day with your employer.',
      fil: 'Gamitin para kumpirmahin ang lingguhang rest day sa iyong amo.',
      zh: '用来跟雇主确认每周的休息日。',
      ta: 'உங்கள் வாராந்திர ஓய்வு நாளை உங்கள் முதலாளியிடம் உறுதிப்படுத்தப் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_unwell', category: 'work',
    en: "I'm not well. May I rest?", fil: 'Hindi po ako maganda ang pakiramdam. Pwede po akong magpahinga?', zh: '我不舒服，可以休息吗？', ta: 'எனக்கு உடம்பு சரியில்லை. ஓய்வெடுக்கலாமா?',
    tip: {
      en: 'Use to tell your employer you are sick and need to rest.',
      fil: 'Gamitin para ipaalam sa iyong amo na maysakit ka at kailangan magpahinga.',
      zh: '用来告诉雇主你生病了、需要休息。',
      ta: 'நோய்வாய்ப்பட்டு ஓய்வு தேவை என உங்கள் முதலாளியிடம் கூறப் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_phone', category: 'work',
    en: 'May I use my phone?', fil: 'Pwede ko bang gamitin ang telepono ko?', zh: '我可以用一下手机吗？', ta: 'என் ஃபோனை பயன்படுத்தலாமா?',
    tip: {
      en: 'Use to politely ask permission to use your own phone.',
      fil: 'Gamitin para magalang na humingi ng pahintulot na gamitin ang sariling telepono.',
      zh: '礼貌地请求使用自己的手机时使用。',
      ta: 'உங்கள் சொந்த ஃபோனைப் பயன்படுத்த மரியாதையாக அனுமதி கேட்கப் பயன்படுத்துங்கள்.',
    },
  },

  // --- Getting around ---
  {
    id: 'p_mrt', category: 'getting_around',
    en: 'Where is the MRT station?', fil: 'Saan po ang istasyon ng MRT?', zh: '地铁站在哪里？', ta: 'MRT நிலையம் எங்கே?',
    tip: {
      en: 'Use to ask the way to the nearest train station.',
      fil: 'Gamitin para magtanong ng daan papunta sa pinakamalapit na istasyon ng tren.',
      zh: '询问去最近的地铁站的路时使用。',
      ta: 'அருகில் உள்ள ரயில் நிலையத்திற்கான வழியைக் கேட்கப் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_getto', category: 'getting_around',
    en: 'How do I get to…?', fil: 'Paano po ako makakapunta sa…?', zh: '我怎么去……？', ta: '…எப்படி போவது?',
    tip: {
      en: 'Use to ask for directions, then say the name of the place.',
      fil: 'Gamitin para magtanong ng direksyon, kasunod ang pangalan ng lugar.',
      zh: '用来问路,然后说出地名。',
      ta: 'வழிகேட்கப் பயன்படுத்துங்கள், பின் இடத்தின் பெயரைச் சொல்லுங்கள்.',
    },
  },
  {
    id: 'p_showmap', category: 'getting_around',
    en: 'Can you show me on the map?', fil: 'Pwede po nyo bang ipakita sa mapa?', zh: '可以在地图上指给我看吗？', ta: 'வரைபடத்தில் காட்டலாமா?',
    tip: {
      en: 'Use to ask someone to point out a place on a map.',
      fil: 'Gamitin para pakihingi na ipakita ang lugar sa mapa o telepono.',
      zh: '请别人在地图或手机上指出地点时使用。',
      ta: 'வரைபடம் அல்லது ஃபோனில் ஒரு இடத்தைக் காட்டச் சொல்லப் பயன்படுத்துங்கள்.',
    },
  },

  // --- Shopping ---
  {
    id: 'p_howmuch', category: 'shopping',
    en: 'How much is this?', fil: 'Magkano po ito?', zh: '这个多少钱？', ta: 'இது எவ்வளவு?',
    tip: {
      en: 'Use to ask the price of something before buying.',
      fil: 'Gamitin para itanong ang presyo bago bumili.',
      zh: '购买前询问价格时使用。',
      ta: 'வாங்கும் முன் ஒரு பொருளின் விலையைக் கேட்கப் பயன்படுத்துங்கள்.',
    },
  },
  {
    id: 'p_receipt', category: 'shopping',
    en: 'May I have a receipt?', fil: 'Pwede po bang makahingi ng resibo?', zh: '可以给我收据吗？', ta: 'ரசீது கொடுங்கள்?',
    tip: {
      en: 'Use to ask for a receipt, handy for tracking your spending.',
      fil: 'Gamitin para humingi ng resibo, nakakatulong sa pagsubaybay ng gastos.',
      zh: '索取收据时使用,方便记录开销。',
      ta: 'ரசீது கேட்கப் பயன்படுத்துங்கள், செலவுகளைக் கண்காணிக்க உதவும்.',
    },
  },
  {
    id: 'p_expensive', category: 'shopping',
    en: 'That is too expensive.', fil: 'Masyado pong mahal.', zh: '太贵了。', ta: 'மிகவும் விலை அதிகம்.',
    tip: {
      en: 'Use to say a price is too high. You can then walk away politely.',
      fil: 'Gamitin para sabihing masyadong mahal. Pwede kang magalang na lumayo.',
      zh: '表示价格太高时使用,然后可以礼貌地离开。',
      ta: 'விலை மிக அதிகம் எனச் சொல்லப் பயன்படுத்துங்கள். பின் மரியாதையாக விலகலாம்.',
    },
  },
]

// Pick the right string for the user's language, dropping back to English.
export function getPhraseText(phrase, lang) {
  return phrase[lang] || phrase.en
}

// Same idea for the usage tip.
export function getPhraseTip(phrase, lang) {
  return phrase.tip?.[lang] || phrase.tip?.en
}
