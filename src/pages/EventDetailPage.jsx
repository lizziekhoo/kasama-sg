import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { useSession } from '../lib/session'
import { getEvent, deleteEvent } from '../lib/events'
import { googleMapsUrl } from '../lib/maps'
import { getEventCategory, getEventCategoryLabel } from '../data/events'
import { getPlaceById } from '../data/places'

// Detail view for a single community event. Shows the basics and a prominent
// "Open in Google Maps" button; the creator can delete their own event.

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d)) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(t) {
  if (!t) return ''
  // "14:30" → "2:30 PM"
  const [h, m] = t.split(':')
  const hr = parseInt(h, 10)
  if (isNaN(hr)) return t
  const suffix = hr >= 12 ? 'PM' : 'AM'
  const hr12 = ((hr + 11) % 12) + 1
  return `${hr12}:${m} ${suffix}`
}

export default function EventDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const navigate = useNavigate()
  const session = useSession()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let alive = true
    getEvent(id).then(ev => {
      if (alive) setEvent(ev)
      if (alive) setLoading(false)
    })
    return () => { alive = false }
  }, [id])

  if (loading) {
    return <p style={{ color: '#9a9a9a', fontSize: '14px' }}>{t('event.loading')}</p>
  }

  if (!event) {
    return (
      <div>
        <PageHeader title={t('event.notFound')} back />
        <Link to="/map" style={styles.back}>← {t('map.title')}</Link>
      </div>
    )
  }

  const cat = getEventCategory(event.category)
  const placeName = event.place_id ? getPlaceById(event.place_id)?.name : null
  const locationText = placeName || event.address
  const mapsUrl = googleMapsUrl({ lat: event.lat, lng: event.lng, address: event.address })
  const isOwner = Boolean(event.created_by && session?.user?.id && event.created_by === session.user.id)

  async function handleDelete() {
    if (!window.confirm(t('event.confirmDelete'))) return
    setDeleting(true)
    try {
      await deleteEvent(event.id)
      navigate('/map')
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader title={event.title} back />

      <span style={{ ...styles.badge, background: cat.color + '18', color: cat.color }}>
        {cat.icon} {getEventCategoryLabel(event.category, lang)}
      </span>

      {isOwner && <span style={styles.ownerBadge}>{t('event.byYou')}</span>}

      <div style={styles.block}>
        <p style={styles.blockLabel}>📅 {t('event.date')}</p>
        <p style={styles.blockValue}>
          {formatDate(event.event_date)}{event.event_time ? ` · ${formatTime(event.event_time)}` : ''}
        </p>
      </div>

      {locationText && (
        <div style={styles.block}>
          <p style={styles.blockLabel}>📍 {t('event.location')}</p>
          <p style={styles.blockValue}>{locationText}</p>
        </div>
      )}

      {event.description && (
        <div style={styles.block}>
          <p style={styles.blockValue}>{event.description}</p>
        </div>
      )}

      <a href={mapsUrl} target="_blank" rel="noreferrer" style={styles.mapsBtn}>
        🗺️ {t('event.openInMaps')}
      </a>

      {isOwner && (
        <button
          onClick={handleDelete} disabled={deleting}
          style={{ ...styles.deleteBtn, opacity: deleting ? 0.6 : 1 }}
        >
          {t('event.delete')}
        </button>
      )}

      <Link to="/map" style={styles.back}>{t('place.back')}</Link>
    </div>
  )
}

const styles = {
  badge: {
    display: 'inline-block',
    fontSize: '12.5px',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: '999px',
    marginBottom: '16px',
  },
  ownerBadge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '999px',
    marginLeft: '6px',
    background: '#1a6b4a14',
    color: '#1a6b4a',
    verticalAlign: 'middle',
  },
  block: {
    marginBottom: '18px',
  },
  blockLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1a6b4a',
    margin: '0 0 4px',
  },
  blockValue: {
    fontSize: '14.5px',
    color: '#444',
    lineHeight: 1.5,
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  mapsBtn: {
    display: 'block',
    textAlign: 'center',
    marginTop: '8px',
    background: '#1a6b4a',
    color: '#fff',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  deleteBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    marginTop: '10px',
    background: 'none',
    color: '#c0392b',
    padding: '10px',
    borderRadius: '12px',
    border: '1.5px solid #e3c3be',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  back: {
    display: 'inline-block',
    marginTop: '20px',
    color: '#2a7ab0',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
  },
}
