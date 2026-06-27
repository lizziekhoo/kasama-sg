import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { CONTACTS } from '../data/contacts'
import PageHeader from '../components/PageHeader'

// Display info for each contact category. The actual contacts themselves come
// from the Supabase `contacts` table; this just tells us how to draw each one.
const CONTACT_CATEGORIES = {
  emergency:  { icon: '🚨', color: '#c0392b', label: { en: 'Emergency',   fil: 'Emergency',          zh: '紧急',      ta: 'அவசரம்' } },
  work:       { icon: '💼', color: '#1a6b4a', label: { en: 'Work & pay',  fil: 'Trabaho at sahod',   zh: '工作与工资', ta: 'வேலை & சம்பளம்' } },
  embassies:  { icon: '🌍', color: '#2a7ab0', label: { en: 'Embassies',   fil: 'Embahada',           zh: '大使馆',    ta: 'தூதரகங்கள்' } },
  wellbeing:  { icon: '💙', color: '#6b4a9e', label: { en: 'Wellbeing',   fil: 'Kabutihang pakiramdam', zh: '身心健康', ta: 'நலன்' } },
}

function categoryLabel(categoryId, lang) {
  const cat = CONTACT_CATEGORIES[categoryId]
  return cat ? (cat.label[lang] || cat.label.en) : categoryId
}

export default function ContactsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'

  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('all')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(false)
      // Pull the helplines straight from Supabase.
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name, category, phone, description, place_id, sort_order')
        .order('sort_order', { ascending: true })

      if (cancelled) return
      if (error || !data || data.length === 0) {
        // Backend missing / empty / unreachable — fall back to the bundled
        // directory so the page is never blank.
        if (error) console.warn('contacts fetch failed:', error.message)
        setContacts(CONTACTS)
      } else {
        setContacts(data)
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Which categories actually have entries (so we don't show empty chips).
  const availableCats = useMemo(() => {
    const set = new Set(contacts.map(c => c.category))
    return Object.keys(CONTACT_CATEGORIES).filter(c => set.has(c))
  }, [contacts])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return contacts.filter(c => {
      const matchesCat = activeCat === 'all' || c.category === activeCat
      const matchesQuery = !q ||
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [contacts, query, activeCat])

  // Group what's left by category so it reads nicely.
  const grouped = useMemo(() => {
    const map = {}
    for (const c of filtered) (map[c.category] ||= []).push(c)
    return map
  }, [filtered])

  return (
    <div>
      <PageHeader title={t('contacts.title')} subtitle={t('home.helpDesc')} />

      {/* Search */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={t('contacts.search')}
        style={styles.search}
      />

      {/* Category filter */}
      {availableCats.length > 0 && (
        <div className="chips" style={styles.chips}>
          <Chip active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
            {t('contacts.all')}
          </Chip>
          {availableCats.map(cat => (
            <Chip key={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)}>
              {CONTACT_CATEGORIES[cat].icon} {categoryLabel(cat, lang)}
            </Chip>
          ))}
        </div>
      )}

      {loading && <p style={styles.muted}>{t('contacts.loading')}</p>}

      {!loading && error && (
        <div style={styles.note}>
          {t('common.error')}{' '}
          <span style={styles.noteSub}>
            (Make sure the <code>contacts</code> table exists in Supabase — see <code>supabase/schema.sql</code>.)
          </span>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p style={styles.muted}>{t('contacts.empty')}</p>
      )}

      {/* Contacts grouped by category */}
      {!loading && Object.keys(grouped).map(cat => (
        <div key={cat} style={{ marginTop: '22px' }}>
          <h2 style={styles.groupTitle}>
            {CONTACT_CATEGORIES[cat]?.icon} {categoryLabel(cat, lang)}
          </h2>
          {grouped[cat].map(c => (
            <ContactCard key={c.id} contact={c} t={t} lang={lang} />
          ))}
        </div>
      ))}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.chip,
        background: active ? '#1a6b4a' : '#fff',
        color: active ? '#fff' : '#555',
        border: active ? '1.5px solid #1a6b4a' : '1.5px solid #e8e4dc',
      }}
    >
      {children}
    </button>
  )
}

function ContactCard({ contact, t, lang }) {
  // tel: links want digits only, so strip the spaces out.
  const telHref = `tel:${(contact.phone || '').replace(/\s+/g, '')}`
  const cat = CONTACT_CATEGORIES[contact.category]

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <h3 style={styles.cardName}>{contact.name}</h3>
        {cat && (
          <span style={{ ...styles.badge, background: cat.color + '18', color: cat.color }}>
            {categoryLabel(contact.category, lang)}
          </span>
        )}
      </div>
      {contact.description && <p style={styles.cardDesc}>{contact.description}</p>}

      <div style={styles.cardActions}>
        <a href={telHref} style={styles.callBtn}>
          📞 {t('contacts.call')} · {contact.phone}
        </a>
        {contact.place_id && (
          <Link to={`/place/${contact.place_id}`} style={styles.mapLink}>
            🗺️ {t('contacts.seeMap')}
          </Link>
        )}
      </div>
    </div>
  )
}

const styles = {
  search: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1.5px solid #e8e4dc',
    background: '#fff',
    fontSize: '14px',
    color: '#1a1a1a',
    fontFamily: 'inherit',
  },
  chips: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '12px 0 2px',
    // hide the scrollbar but keep it scrollable
    scrollbarWidth: 'none',
  },
  chip: {
    flexShrink: 0,
    padding: '7px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  groupTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #f0ece4',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
  },
  cardName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: 0,
  },
  badge: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
  },
  cardDesc: {
    fontSize: '13.5px',
    color: '#6b6b6b',
    margin: '6px 0 14px',
    lineHeight: 1.45,
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  callBtn: {
    display: 'inline-block',
    background: '#1a6b4a',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  mapLink: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#2a7ab0',
    textDecoration: 'none',
  },
  muted: {
    color: '#9a9a9a',
    fontSize: '14px',
    marginTop: '24px',
    textAlign: 'center',
  },
  note: {
    fontSize: '13.5px',
    color: '#c0392b',
    background: '#fdf0ee',
    borderRadius: '12px',
    padding: '14px',
    marginTop: '20px',
    lineHeight: 1.5,
  },
  noteSub: {
    color: '#8a4a42',
    fontSize: '12.5px',
  },
}