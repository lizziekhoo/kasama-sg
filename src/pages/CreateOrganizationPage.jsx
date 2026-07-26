import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { useSession } from '../lib/session'
import { createOrganization } from '../lib/organizations'
import { ORG_CATEGORIES, DEFAULT_ORG_CATEGORY, getOrgCategoryLabel } from '../data/organizations'

// Create an organization page. The signed-in user becomes its owner. Mirrors
// the Add Event form's structure and styles.

export default function CreateOrganizationPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const navigate = useNavigate()
  const session = useSession()
  const userId = session?.user?.id

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(DEFAULT_ORG_CATEGORY)
  const [icon, setIcon] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setErr('')
    if (!name.trim()) { setErr('name'); return }
    setSaving(true)
    try {
      const org = await createOrganization({
        name: name.trim(),
        description: description.trim() || null,
        category,
        icon: icon.trim() || null,
        owner_id: userId,
      })
      navigate(`/org/${org.id}`)
    } catch {
      setErr('generic')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title={t('org.createTitle')} subtitle={t('org.subtitle')} back />

      <form onSubmit={handleCreate} style={styles.form}>
        <label style={styles.label}>{t('org.nameField')}</label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder={t('org.namePlaceholder')} style={styles.input}
        />

        <label style={styles.label}>{t('org.category')}</label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={styles.input}>
          {Object.keys(ORG_CATEGORIES).map(c => (
            <option key={c} value={c}>
              {ORG_CATEGORIES[c].icon} {getOrgCategoryLabel(c, lang)}
            </option>
          ))}
        </select>

        <label style={styles.label}>{t('org.iconField')}</label>
        <input
          type="text" value={icon} onChange={e => setIcon(e.target.value)}
          placeholder={t('org.iconPlaceholder')} style={styles.input} maxLength={4}
        />

        <label style={styles.label}>{t('org.descField')}</label>
        <textarea
          value={description} onChange={e => setDescription(e.target.value)}
          placeholder={t('org.descPlaceholder')}
          style={{ ...styles.input, minHeight: '84px', resize: 'vertical' }}
        />

        {err && <p style={styles.err}>{err === 'generic' ? t('common.error') : t('org.required')}</p>}

        <button type="submit" disabled={saving} style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}>
          {saving ? t('org.saving') : t('org.save')}
        </button>
      </form>
    </div>
  )
}

const styles = {
  form: { background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #f0ece4' },
  label: { display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#555', margin: '12px 0 4px' },
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
  saveBtn: {
    width: '100%',
    marginTop: '18px',
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: '#1a6b4a',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
