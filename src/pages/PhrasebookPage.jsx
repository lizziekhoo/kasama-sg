import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { PHRASE_CATEGORIES, PHRASES, getPhraseText } from '../data/phrases'

export default function PhrasebookPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'

  const [activeCat, setActiveCat] = useState('all')
  const [copied, setCopied] = useState(null)

  const filtered = useMemo(
    () => PHRASES.filter(p => activeCat === 'all' || p.category === activeCat),
    [activeCat]
  )

  async function copy(text, id) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      // Flash "Copied!" for a sec, then clear it.
      setTimeout(() => setCopied(c => (c === id ? null : c)), 1400)
    } catch {
      // Clipboard can be blocked (older browsers / insecure context) — ignore.
    }
  }

  return (
    <div>
      <PageHeader title={t('phrase.title')} subtitle={t('home.phrasesDesc')} />

      <div className="chips" style={styles.chips}>
        <Chip active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
          {t('phrase.all')}
        </Chip>
        {PHRASE_CATEGORIES.map(c => (
          <Chip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
            {c.icon} {c.name[lang] || c.name.en}
          </Chip>
        ))}
      </div>

      {filtered.map(p => {
        const text = getPhraseText(p, lang)
        const showEnglish = lang !== 'en' && p.en && p.en !== text
        return (
          <div key={p.id} style={styles.card}>
            <p style={styles.phrase}>{text}</p>
            {showEnglish && <p style={styles.english}>{p.en}</p>}
            <button
              onClick={() => copy(text, p.id)}
              style={styles.copyBtn}
            >
              {copied === p.id ? `✓ ${t('phrase.copied')}` : `⧉ ${t('phrase.copy')}`}
            </button>
          </div>
        )
      })}
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
  chips: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '4px 0 16px',
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
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '10px',
    border: '1px solid #f0ece4',
  },
  phrase: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 4px',
    lineHeight: 1.35,
  },
  english: {
    fontSize: '13.5px',
    color: '#9a9a9a',
    margin: '0 0 12px',
    fontStyle: 'italic',
  },
  copyBtn: {
    background: '#f0faf5',
    color: '#1a6b4a',
    border: 'none',
    borderRadius: '8px',
    padding: '7px 12px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
