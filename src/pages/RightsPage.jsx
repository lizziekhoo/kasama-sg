import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { getRightsCache, setRightsCache } from '../lib/storage'
import { RIGHTS } from '../data/rights'
import PageHeader from '../components/PageHeader'

export default function RightsPage() {
  const { t } = useTranslation()

  // Start with whatever we cached last time, so the page shows instantly and
  // still works with no connection. null = we've never fetched.
  const cached = getRightsCache()
  const [pages, setPages] = useState(cached?.pages || [])
  const [usingCache, setUsingCache] = useState(Boolean(cached))
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('rights_pages')
        .select('id, slug, category, title, summary, body, updated_at')
        .order('category', { ascending: true })

      if (cancelled) return
      if (!error && data && data.length) {
        setPages(data)
        setRightsCache(data) // stash for next offline visit
        setUsingCache(false)
      } else {
        // Backend missing / empty / unreachable — prefer a cached copy, then
        // fall back to the bundled library so the page is never blank.
        if (error) console.warn('rights fetch failed:', error.message)
        setPages(cached?.pages?.length ? cached.pages : RIGHTS)
        setUsingCache(Boolean(cached))
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Group by category so it's browsable, not just a wall of cards.
  const grouped = useMemo(() => {
    const map = {}
    for (const p of pages) (map[p.category] ||= []).push(p)
    return map
  }, [pages])

  return (
    <div>
      <PageHeader
        title={t('rights.title')}
        subtitle={t('home.rightsDesc')}
      />

      {usingCache && pages.length > 0 && (
        <div style={styles.offlineNote}>
          📴 {t('rights.offline')}
        </div>
      )}

      {loading && <p style={styles.muted}>{t('rights.loading')}</p>}

      {!loading && error && (
        <div style={styles.note}>
          {t('common.error')}{' '}
          <span style={styles.noteSub}>
            (Run <code>supabase/schema.sql</code> to create the <code>rights_pages</code> table.)
          </span>
        </div>
      )}

      {!loading && !error && pages.length === 0 && (
        <p style={styles.muted}>{t('rights.empty')}</p>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginTop: '20px' }}>
          <h2 style={styles.groupTitle}>{category}</h2>
          {items.map(p => (
            <Link key={p.id} to={`/rights/${p.slug}`} style={styles.cardLink}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>{p.title}</h3>
                <p style={styles.cardSummary}>{p.summary}</p>
                <span style={styles.readMore}>{t('rights.readMore')} →</span>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

const styles = {
  offlineNote: {
    fontSize: '12.5px',
    color: '#1a6b4a',
    background: '#f0faf5',
    borderRadius: '10px',
    padding: '8px 12px',
    marginBottom: '16px',
    fontWeight: 600,
  },
  groupTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  cardLink: {
    textDecoration: 'none',
    display: 'block',
    marginBottom: '12px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #f0ece4',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 6px',
  },
  cardSummary: {
    fontSize: '13.5px',
    color: '#6b6b6b',
    margin: '0 0 10px',
    lineHeight: 1.45,
  },
  readMore: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1a6b4a',
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
