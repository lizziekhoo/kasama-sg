import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useProfile, upsertProfile, initialsOf } from '../lib/profiles'

// Same set as the language picker on the login screen, kept here so users can
// change language any time — not just at sign-up.
const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', native: 'English' },
  { code: 'fil', flag: '🇵🇭', native: 'Filipino' },
  { code: 'zh', flag: '🇨🇳', native: '中文' },
  { code: 'ta', flag: '🇮🇳', native: 'தமிழ்' },
]

export default function MePage() {
  const { t, i18n } = useTranslation()
  const session = useSession()
  const email = session?.user?.email || ''
  const currentLang = i18n.language?.split('-')[0] || 'en'

  const profile = useProfile()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [area, setArea] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(false)

  // Prefill the form once the profile arrives from Supabase.
  useEffect(() => {
    if (!profile) return
    setName(profile.name || '')
    setBio(profile.bio || '')
    setArea(profile.area || '')
  }, [profile])

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setSavedAt(false)
    try {
      await upsertProfile({
        id: session?.user?.id,
        name: name.trim(),
        bio: bio.trim() || null,
        area: area.trim() || null,
      })
      setSavedAt(true)
    } catch {
      // soft-fail — keep the form usable
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    // App.jsx listens for the auth change and bounces us to /auth.
  }

  function pickLanguage(code) {
    i18n.changeLanguage(code)
    localStorage.setItem('kasama_lang', code)
  }

  return (
    <div>
      <h1 style={styles.title}>{t('me.title')}</h1>

      {/* Profile */}
      <div style={styles.profileCard}>
        <span style={styles.avatar}>{initialsOf(name || profile?.name)}</span>
        <div>
          <p style={styles.signedInLabel}>{t('me.signedInAs')}</p>
          <p style={styles.email}>{(name || profile?.name)?.trim() || email}</p>
        </div>
      </div>

      {/* Edit profile */}
      <form onSubmit={handleSaveProfile} style={styles.form}>
        <label style={styles.label}>{t('profile.name')}</label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder={t('profile.namePlaceholder')} style={styles.input}
        />

        <label style={styles.label}>{t('profile.bio')}</label>
        <input
          type="text" value={bio} onChange={e => setBio(e.target.value)}
          placeholder={t('profile.bioPlaceholder')} style={styles.input}
        />

        <label style={styles.label}>{t('profile.area')}</label>
        <input
          type="text" value={area} onChange={e => setArea(e.target.value)}
          placeholder={t('profile.areaPlaceholder')} style={styles.input}
        />

        <button type="submit" disabled={saving} style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}>
          {saving ? t('profile.saving') : t('profile.save')}
        </button>
        {savedAt && <p style={styles.saved}>{t('profile.saved')}</p>}
      </form>

      {/* Language */}
      <h2 style={styles.groupTitle}>{t('me.language')}</h2>
      <div style={styles.langList}>
        {LANGUAGES.map(l => {
          const active = currentLang === l.code
          return (
            <button
              key={l.code}
              onClick={() => pickLanguage(l.code)}
              style={{
                ...styles.langRow,
                background: active ? '#f0faf5' : '#fff',
                borderColor: active ? '#1a6b4a' : '#f0ece4',
              }}
            >
              <span style={styles.langFlag}>{l.flag}</span>
              <span style={{ ...styles.langName, fontWeight: active ? 700 : 500 }}>
                {l.native}
              </span>
              {active && <span style={styles.langCheck}>✓</span>}
            </button>
          )
        })}
      </div>

      {/* Tools */}
      <h2 style={styles.groupTitle}>{t('me.tools')}</h2>

      <Link to="/salary" style={styles.toolRow}>
        <span style={styles.toolIcon}>💵</span>
        <span style={styles.toolText}>
          <strong>{t('home.salaryTitle')}</strong>
          <span style={styles.toolDesc}>{t('home.salaryDesc')}</span>
        </span>
        <span style={styles.chevron}>›</span>
      </Link>

      <Link to="/phrasebook" style={styles.toolRow}>
        <span style={styles.toolIcon}>💬</span>
        <span style={styles.toolText}>
          <strong>{t('home.phrasesTitle')}</strong>
          <span style={styles.toolDesc}>{t('home.phrasesDesc')}</span>
        </span>
        <span style={styles.chevron}>›</span>
      </Link>

      <button onClick={handleSignOut} style={styles.signOut}>
        {t('me.signOut')}
      </button>
    </div>
  )
}

const styles = {
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a1a',
    letterSpacing: '-0.4px',
    margin: '0 0 20px',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#1a6b4a',
    color: '#fff',
    borderRadius: '16px',
    padding: '18px',
    marginBottom: '26px',
  },
  avatar: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '17px',
    fontWeight: 700,
    color: '#fff',
  },
  signedInLabel: {
    fontSize: '12px',
    opacity: 0.8,
    margin: '0 0 2px',
  },
  email: {
    fontSize: '15px',
    fontWeight: 600,
    margin: 0,
    wordBreak: 'break-word',
  },
  form: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #f0ece4',
    marginBottom: '26px',
  },
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
  saveBtn: {
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
  saved: {
    color: '#1a6b4a',
    fontSize: '12.5px',
    margin: '8px 0 0',
    textAlign: 'center',
  },
  groupTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: '10px',
  },
  langList: {
    marginBottom: '16px',
  },
  langRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    borderRadius: '14px',
    padding: '13px 14px',
    marginBottom: '8px',
    border: '1.5px solid #f0ece4',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
  },
  langFlag: {
    fontSize: '20px',
  },
  langName: {
    flex: 1,
    fontSize: '15px',
    color: '#1a1a1a',
  },
  langCheck: {
    color: '#1a6b4a',
    fontSize: '16px',
    fontWeight: 700,
  },
  toolRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#fff',
    borderRadius: '14px',
    padding: '14px',
    marginBottom: '10px',
    border: '1px solid #f0ece4',
    textDecoration: 'none',
  },
  toolIcon: {
    fontSize: '20px',
    width: '26px',
    textAlign: 'center',
  },
  toolText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    color: '#1a1a1a',
    fontSize: '15px',
  },
  toolDesc: {
    fontSize: '12.5px',
    color: '#9a9a9a',
    marginTop: '1px',
  },
  chevron: {
    color: '#c8c4bc',
    fontSize: '22px',
    fontWeight: 700,
  },
  signOut: {
    width: '100%',
    marginTop: '24px',
    padding: '14px',
    borderRadius: '12px',
    border: '1.5px solid #e8e4dc',
    background: '#fff',
    color: '#c0392b',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
