import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { getRightsCache, setRightsCache } from '../lib/storage'
import { RIGHTS } from '../data/rights'
import PageHeader from '../components/PageHeader'

export default function RightsDetailPage() {
  const { slug } = useParams()
  const { t } = useTranslation()

  // Show the cached copy immediately (works offline), then refresh in the
  // background if we're online.
  const cached = getRightsCache()
  const cachedPage = cached?.pages?.find(p => p.slug === slug)

  const [page, setPage] = useState(cachedPage || null)
  const [loading, setLoading] = useState(!cachedPage)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('rights_pages')
        .select('id, slug, category, title, summary, body, updated_at')
        .eq('slug', slug)
        .maybeSingle()

      if (cancelled) return
      if (error || !data) {
        // Network failed or no matching row — fall back to the bundled content
        // for this slug (then any cached copy) so the page still reads with no
        // backend.
        if (error) console.warn('rights detail fetch failed:', error.message)
        const fallback = cachedPage || RIGHTS.find(p => p.slug === slug)
        if (fallback) {
          setPage(fallback)
        } else {
          setNotFound(true)
        }
        setLoading(false)
        return
      }
      setPage(data)
      // Keep the cache fresh so this page is readable offline next time.
      const all = cached?.pages || []
      const next = all.some(p => p.id === data.id)
        ? all.map(p => (p.id === data.id ? data : p))
        : [...all, data]
      setRightsCache(next)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (loading) {
    return <p style={{ color: '#9a9a9a', marginTop: '40px', textAlign: 'center' }}>{t('rights.loading')}</p>
  }

  if (notFound) {
    return (
      <div>
        <PageHeader title={t('rights.notFound')} back />
        <Link to="/rights" style={styles.backLink}>← {t('rights.title')}</Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={page.title} back />
      <span style={styles.category}>{page.category}</span>
      <p style={styles.summary}>{page.summary}</p>

      <div style={styles.body}>
        {renderBody(page.body)}
      </div>

      <div style={styles.savedNote}>📥 {t('rights.savedForOffline')}</div>
    </div>
  )
}

// Turns the plain-text body into something readable: paragraphs and bullet
// lists. Good enough for our content without pulling in a markdown library.
function renderBody(body) {
  if (!body) return null
  const lines = body.split('\n')
  const blocks = []
  let bullets = []

  const flushBullets = () => {
    if (bullets.length) {
      blocks.push(<ul key={`ul-${blocks.length}`} style={styles.ul}>{bullets}</ul>)
      bullets = []
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      bullets.push(<li key={i} style={styles.li}>{trimmed.slice(2)}</li>)
    } else {
      flushBullets()
      if (trimmed) blocks.push(<p key={i} style={styles.p}>{trimmed}</p>)
    }
  })
  flushBullets()
  return blocks
}

const styles = {
  category: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#1a6b4a',
    background: '#f0faf5',
    padding: '3px 10px',
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: '12px',
  },
  summary: {
    fontSize: '15px',
    color: '#444',
    lineHeight: 1.55,
    margin: '0 0 22px',
    fontWeight: 500,
  },
  body: {
    fontSize: '15px',
    color: '#2a2a2a',
    lineHeight: 1.65,
  },
  p: {
    margin: '0 0 14px',
  },
  ul: {
    margin: '0 0 16px',
    paddingLeft: '20px',
  },
  li: {
    marginBottom: '6px',
  },
  savedNote: {
    marginTop: '28px',
    paddingTop: '16px',
    borderTop: '1px solid #f0ece4',
    fontSize: '12.5px',
    color: '#9a9a9a',
  },
  backLink: {
    color: '#1a6b4a',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
  },
}
