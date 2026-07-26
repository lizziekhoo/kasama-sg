import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { useProfile, getNames } from '../lib/profiles'
import { listAnnouncements, createAnnouncement, deleteAnnouncement } from '../lib/announcements'
import {
  ANNOUNCEMENT_CATEGORIES,
  DEFAULT_ANNOUNCEMENT_CATEGORY,
  getAnnouncementCategory,
  getAnnouncementCategoryLabel,
} from '../data/announcements'

// Admin-curated feed of community resources (legal aid, medical outreach,
// workshops, ...). Everyone reads; admins see an inline "new announcement"
// form and a delete button per item. Non-admins just browse.

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d)) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AnnouncementsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const profile = useProfile()
  const isAdmin = !!profile?.is_admin

  const [items, setItems] = useState([])
  const [names, setNames] = useState({})
  const [activeCat, setActiveCat] = useState('all')

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState(DEFAULT_ANNOUNCEMENT_CATEGORY)
  const [eventDate, setEventDate] = useState('')
  const [link, setLink] = useState('')
  const [err, setErr] = useState('')
  const [posting, setPosting] = useState(false)

  async function refresh() {
    const list = await listAnnouncements()
    setItems(list)
    setNames(await getNames(list.map(a => a.author_id)))
  }

  useEffect(() => { refresh() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setErr('')
    if (!title.trim()) { setErr('title'); return }
    setPosting(true)
    try {
      await createAnnouncement({
        title: title.trim(),
        body: body.trim() || null,
        category,
        link: link.trim() || null,
        event_date: eventDate || null,
      })
      setTitle(''); setBody(''); setLink(''); setEventDate('')
      await refresh()
    } catch {
      setErr('generic')
    } finally {
      setPosting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('ann.confirmDelete'))) return
    await deleteAnnouncement(id)
    await refresh()
  }

  const cats = Object.keys(ANNOUNCEMENT_CATEGORIES)
  const shown = items.filter(a => activeCat === 'all' || a.category === activeCat)

  return (
    <div>
      <PageHeader title={t('ann.title')} subtitle={t('ann.subtitle')} />

      {isAdmin && (
        <form onSubmit={handleCreate} style={styles.form}>
          <label style={styles.label}>{t('ann.titleField')}</label>
          <input
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder={t('ann.titlePlaceholder')} style={styles.input}
          />

          <label style={styles.label}>{t('ann.body')}</label>
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            placeholder={t('ann.bodyPlaceholder')}
            style={{ ...styles.input, minHeight: '72px', resize: 'vertical' }}
          />

          <div style={styles.formRow}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>{t('ann.category')}</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={styles.input}>
                {cats.map(c => (
                  <option key={c} value={c}>
                    {ANNOUNCEMENT_CATEGORIES[c].icon} {getAnnouncementCategoryLabel(c, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>{t('ann.date')}</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} style={styles.input} />
            </div>
          </div>

          <label style={styles.label}>{t('ann.link')}</label>
          <input
            type="text" value={link} onChange={e => setLink(e.target.value)}
            placeholder={t('ann.linkPlaceholder')} style={styles.input}
          />

          {err && <p style={styles.err}>{err === 'generic' ? t('common.error') : t('ann.required')}</p>}
          <button type="submit" disabled={posting} style={{ ...styles.postBtn, opacity: posting ? 0.6 : 1 }}>
            {posting ? t('ann.posting') : t('ann.post')}
          </button>
        </form>
      )}

      <div className="chips" style={styles.chips}>
        <Chip active={activeCat === 'all'} onClick={() => setActiveCat('all')}>{t('ann.all')}</Chip>
        {cats.map(c => (
          <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(c)}>
            {ANNOUNCEMENT_CATEGORIES[c].icon} {getAnnouncementCategoryLabel(c, lang)}
          </Chip>
        ))}
      </div>

      {shown.length === 0 ? (
        <p style={styles.empty}>{t('ann.empty')}</p>
      ) : (
        shown.map(a => {
          const cat = getAnnouncementCategory(a.category)
          const authorName = names[a.author_id]
          return (
            <div key={a.id} style={styles.card}>
              <span style={{ ...styles.badge, background: cat.color + '18', color: cat.color }}>
                {cat.icon} {getAnnouncementCategoryLabel(a.category, lang)}
              </span>
              <h3 style={styles.cardTitle}>{a.title}</h3>
              {a.body && <p style={styles.cardBody}>{a.body}</p>}
              <p style={styles.cardMeta}>
                {a.event_date ? formatDate(a.event_date) : ''}
                {a.event_date && authorName ? ' · ' : ''}
                {authorName ? `${t('ann.by')} ${authorName}` : ''}
              </p>
              {a.link && (
                <a href={a.link} target="_blank" rel="noreferrer" style={styles.link}>
                  {t('ann.openLink')} ↗
                </a>
              )}
              {isAdmin && (
                <button onClick={() => handleDelete(a.id)} style={styles.delBtn}>{t('ann.delete')}</button>
              )}
            </div>
          )
        })
      )}
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

const styles = {
  form: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #f0ece4',
    marginBottom: '20px',
  },
  formRow: { display: 'flex', gap: '10px' },
  label: {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#555',
    margin: '12px 0 4px',
  },
  input: {
    width: '100%',
    padding: '11px 12px',
    borderRadius: '10px',
    border: '1.5px solid #e8e4dc',
    background: '#faf8f2',
    fontSize: '15px',
    color: '#1a1a1a',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  err: { color: '#c0392b', fontSize: '12.5px', margin: '8px 0 0' },
  postBtn: {
    width: '100%',
    marginTop: '16px',
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: '#1a6b4a',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  chips: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '4px 0 12px',
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
  empty: {
    color: '#9a9a9a',
    fontSize: '14px',
    textAlign: 'center',
    padding: '24px 0',
  },
  card: {
    background: '#fff',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #f0ece4',
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '999px',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 4px',
  },
  cardBody: {
    fontSize: '14px',
    color: '#444',
    lineHeight: 1.5,
    margin: '0 0 8px',
    whiteSpace: 'pre-wrap',
  },
  cardMeta: {
    fontSize: '12.5px',
    color: '#9a9a9a',
    margin: '0 0 8px',
  },
  link: {
    display: 'inline-block',
    color: '#2a7ab0',
    fontSize: '13px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  delBtn: {
    marginTop: '8px',
    background: 'none',
    border: 'none',
    color: '#c0392b',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
  },
}
