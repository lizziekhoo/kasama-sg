import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { useSession } from '../lib/session'
import { getNames } from '../lib/profiles'
import { getOrganization, eventsForOrg, updateOrganization, deleteOrganization } from '../lib/organizations'
import { ORG_CATEGORIES, getOrgCategory, getOrgCategoryLabel } from '../data/organizations'
import { getEventCategory } from '../data/events'

// An organization's page: its info plus the events tagged to it. The owner can
// edit the page or delete it; everyone else just reads.

function formatEventDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d)) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function OrganizationDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const navigate = useNavigate()
  const session = useSession()

  const [org, setOrg] = useState(null)
  const [events, setEvents] = useState([])
  const [ownerName, setOwnerName] = useState('')
  const [loading, setLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('community')
  const [icon, setIcon] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const o = await getOrganization(id)
    setOrg(o)
    if (o) {
      setName(o.name || '')
      setDescription(o.description || '')
      setCategory(o.category || 'community')
      setIcon(o.icon || '')
      setEvents(await eventsForOrg(id))
      const names = await getNames([o.owner_id])
      setOwnerName(names[o.owner_id] || '')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  if (loading) {
    return <p style={{ color: '#9a9a9a', fontSize: '14px' }}>{t('org.loading')}</p>
  }

  if (!org) {
    return (
      <div>
        <PageHeader title={t('org.notFound')} back />
        <Link to="/organizations" style={styles.back}>← {t('org.title')}</Link>
      </div>
    )
  }

  const isOwner = session?.user?.id === org.owner_id
  const cat = getOrgCategory(org.category)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateOrganization(id, {
        name: name.trim(),
        description: description.trim() || null,
        category,
        icon: icon.trim() || null,
      })
      setEditing(false)
      await load()
    } catch {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(t('org.confirmDelete'))) return
    await deleteOrganization(id)
    navigate('/organizations')
  }

  if (editing) {
    return (
      <div>
        <PageHeader title={t('org.editTitle')} back />
        <form onSubmit={handleSave} style={styles.form}>
          <label style={styles.label}>{t('org.nameField')}</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={styles.input} />

          <label style={styles.label}>{t('org.category')}</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={styles.input}>
            {Object.keys(ORG_CATEGORIES).map(c => (
              <option key={c} value={c}>{ORG_CATEGORIES[c].icon} {getOrgCategoryLabel(c, lang)}</option>
            ))}
          </select>

          <label style={styles.label}>{t('org.iconField')}</label>
          <input type="text" value={icon} onChange={e => setIcon(e.target.value)} maxLength={4} style={styles.input} />

          <label style={styles.label}>{t('org.descField')}</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            style={{ ...styles.input, minHeight: '84px', resize: 'vertical' }} />

          <button type="submit" disabled={saving} style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}>
            {saving ? t('org.saving') : t('org.save')}
          </button>
          <button type="button" onClick={() => setEditing(false)} style={styles.cancelBtn}>{t('org.cancel')}</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={org.name} back />

      <div style={styles.header}>
        <span style={{ ...styles.orgIcon, background: cat.color + '20' }}>{org.icon || cat.icon}</span>
        <span style={{ ...styles.badge, background: cat.color + '18', color: cat.color }}>
          {cat.icon} {getOrgCategoryLabel(org.category, lang)}
        </span>
      </div>

      {org.description && <p style={styles.desc}>{org.description}</p>}
      {ownerName && <p style={styles.owner}>{t('org.byOwner')} {ownerName}</p>}

      {isOwner && (
        <div style={styles.ownerActions}>
          <button onClick={() => setEditing(true)} style={styles.editBtn}>{t('org.edit')}</button>
          <button onClick={handleDelete} style={styles.deleteBtn}>{t('org.delete')}</button>
        </div>
      )}

      <h2 style={styles.groupTitle}>{t('org.events')}</h2>
      {events.length === 0 ? (
        <p style={styles.empty}>{t('org.noEvents')}</p>
      ) : (
        events.map(ev => {
          const ecat = getEventCategory(ev.category)
          return (
            <Link key={ev.id} to={`/event/${ev.id}`} style={styles.row}>
              <span style={{ ...styles.rowIcon, background: ecat.color + '20' }}>{ecat.icon}</span>
              <span style={styles.rowText}>
                <span style={styles.rowName}>{ev.title}</span>
                <span style={styles.rowCat}>
                  {formatEventDate(ev.event_date)}{ev.event_time ? ` · ${ev.event_time}` : ''}
                </span>
              </span>
              <span style={styles.chevron}>›</span>
            </Link>
          )
        })
      )}
      {isOwner && <p style={styles.hint}>{t('org.postHint')}</p>}

      <Link to="/organizations" style={styles.back}>{t('org.back')}</Link>
    </div>
  )
}

const styles = {
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' },
  orgIcon: {
    width: '48px', height: '48px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
  },
  badge: {
    display: 'inline-block', fontSize: '12.5px', fontWeight: 700,
    padding: '4px 12px', borderRadius: '999px',
  },
  desc: { fontSize: '14.5px', color: '#444', lineHeight: 1.6, margin: '0 0 8px', whiteSpace: 'pre-wrap' },
  owner: { fontSize: '12.5px', color: '#9a9a9a', margin: '0 0 16px' },
  ownerActions: { display: 'flex', gap: '10px', marginBottom: '20px' },
  editBtn: {
    flex: 1, padding: '11px', borderRadius: '12px', border: '1.5px solid #1a6b4a',
    background: '#fff', color: '#1a6b4a', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1, padding: '11px', borderRadius: '12px', border: '1.5px solid #e3c3be',
    background: '#fff', color: '#c0392b', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
  groupTitle: {
    fontSize: '13px', fontWeight: 700, color: '#1a1a1a',
    textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px',
  },
  empty: { color: '#9a9a9a', fontSize: '14px', padding: '8px 0' },
  row: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: '#fff', borderRadius: '14px', padding: '12px 14px', marginBottom: '10px',
    border: '1px solid #f0ece4', textDecoration: 'none',
  },
  rowIcon: {
    width: '40px', height: '40px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', flexShrink: 0,
  },
  rowText: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
  rowName: { fontSize: '15px', fontWeight: 700, color: '#1a1a1a' },
  rowCat: { fontSize: '12.5px', color: '#9a9a9a', marginTop: '1px' },
  chevron: { color: '#c8c4bc', fontSize: '22px', fontWeight: 700 },
  hint: { fontSize: '12.5px', color: '#9a9a9a', marginTop: '6px', fontStyle: 'italic' },
  back: { display: 'inline-block', marginTop: '20px', color: '#2a7ab0', fontSize: '14px', fontWeight: 600, textDecoration: 'none' },
  // edit form
  form: { background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #f0ece4' },
  label: { display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#555', margin: '12px 0 4px' },
  input: {
    width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1.5px solid #e8e4dc',
    background: '#faf8f2', fontSize: '15px', color: '#1a1a1a', fontFamily: 'inherit', boxSizing: 'border-box',
  },
  saveBtn: {
    width: '100%', marginTop: '18px', padding: '13px', borderRadius: '12px', border: 'none',
    background: '#1a6b4a', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    width: '100%', marginTop: '10px', padding: '12px', borderRadius: '12px',
    border: '1.5px solid #e8e4dc', background: '#fff', color: '#555', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
}
