import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageHeader from '../components/PageHeader'
import {
  getEventCategory,
  getEventCategoryLabel,
} from '../data/events'
import { getPlaceById } from '../data/places'
import {
  deleteEvent,
  getEvent,
} from '../lib/events'
import { googleMapsUrl } from '../lib/maps'
import { useSession } from '../lib/session'
import {
  isLocationSaved,
  removeSavedLocation,
  subscribeSavedLocations,
  toggleSavedLocation,
} from '../lib/storage'

function formatDate(iso) {
  if (!iso) {
    return ''
  }

  const date = new Date(`${iso}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return iso
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(time) {
  if (!time) {
    return ''
  }

  const [hours, minutes] = time.split(':')
  const hour = Number.parseInt(hours, 10)

  if (Number.isNaN(hour)) {
    return time
  }

  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = ((hour + 11) % 12) + 1

  return `${hour12}:${minutes} ${suffix}`
}

export default function EventDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const navigate = useNavigate()
  const session = useSession()

  const eventId = id ? String(id) : ''

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(() => (
    eventId
      ? isLocationSaved('event', eventId)
      : false
  ))

  useEffect(() => {
    let alive = true

    setLoading(true)

    getEvent(id)
      .then(result => {
        if (alive) {
          setEvent(result)
          setLoading(false)
        }
      })
      .catch(() => {
        if (alive) {
          setEvent(null)
          setLoading(false)
        }
      })

    return () => {
      alive = false
    }
  }, [id])

  useEffect(() => {
    if (!eventId) {
      setSaved(false)
      return undefined
    }

    setSaved(isLocationSaved('event', eventId))

    return subscribeSavedLocations(locations => {
      const currentlySaved = locations.some(item => (
        item.type === 'event' &&
        item.id === eventId
      ))

      setSaved(currentlySaved)
    })
  }, [eventId])

  if (loading) {
    return (
      <p style={styles.loading}>
        {t('event.loading')}
      </p>
    )
  }

  if (!event) {
    return (
      <div>
        <PageHeader
          title={t('event.notFound')}
          back
        />

        <Link to="/map" style={styles.back}>
          ← {t('map.title')}
        </Link>
      </div>
    )
  }

  const category = getEventCategory(event.category)

  const linkedPlace = event.place_id
    ? getPlaceById(event.place_id)
    : null

  const locationText =
    linkedPlace?.name ||
    event.address

  const mapsUrl = googleMapsUrl({
    lat: event.lat,
    lng: event.lng,
    address: event.address,
  })

  const isOwner = Boolean(
    event.created_by &&
    session?.user?.id &&
    event.created_by === session.user.id
  )

  function handleToggleSaved() {
    const nextSavedState = toggleSavedLocation({
      type: 'event',
      id: String(event.id),
    })

    setSaved(nextSavedState)
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      t('event.confirmDelete')
    )

    if (!confirmed) {
      return
    }

    setDeleting(true)

    try {
      await deleteEvent(event.id)

      removeSavedLocation(
        'event',
        String(event.id)
      )

      navigate('/map')
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader title={event.title} back />

      <span
        style={{
          ...styles.badge,
          background: `${category.color}18`,
          color: category.color,
        }}
      >
        {category.icon}{' '}
        {getEventCategoryLabel(event.category, lang)}
      </span>

      {isOwner && (
        <span style={styles.ownerBadge}>
          {t('event.byYou')}
        </span>
      )}

      <div style={styles.block}>
        <p style={styles.blockLabel}>
          📅 {t('event.date')}
        </p>

        <p style={styles.blockValue}>
          {formatDate(event.event_date)}

          {event.event_time
            ? ` · ${formatTime(event.event_time)}`
            : ''}
        </p>
      </div>

      {locationText && (
        <div style={styles.block}>
          <p style={styles.blockLabel}>
            📍 {t('event.location')}
          </p>

          <p style={styles.blockValue}>
            {locationText}
          </p>
        </div>
      )}

      {event.description && (
        <div style={styles.block}>
          <p style={styles.blockValue}>
            {event.description}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggleSaved}
        aria-pressed={saved}
        style={{
          ...styles.saveButton,
          ...(saved
            ? styles.saveButtonActive
            : {}),
        }}
      >
        {saved
          ? `★ ${t('event.savedLocation', {
              defaultValue: 'Saved event location',
            })}`
          : `☆ ${t('event.saveLocation', {
              defaultValue: 'Save event location',
            })}`}
      </button>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        style={styles.mapsButton}
      >
        🗺️ {t('event.openInMaps')}
      </a>

      {isOwner && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          style={{
            ...styles.deleteButton,
            opacity: deleting ? 0.6 : 1,
          }}
        >
          {deleting
            ? t('event.deleting', {
                defaultValue: 'Deleting…',
              })
            : t('event.delete')}
        </button>
      )}

      <Link to="/map" style={styles.back}>
        {t('place.back')}
      </Link>
    </div>
  )
}

const styles = {
  loading: {
    color: '#9a9a9a',
    fontSize: '14px',
  },

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
    margin: 0,
    color: '#444',
    fontSize: '14.5px',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },

  saveButton: {
    display: 'block',
    width: '100%',
    marginTop: '8px',
    padding: '13px',
    borderRadius: '12px',
    border: '1.5px solid #1a6b4a',
    background: '#fff',
    color: '#1a6b4a',
    fontFamily: 'inherit',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  saveButtonActive: {
    background: '#f0faf5',
    borderColor: '#1a6b4a',
    color: '#14583d',
  },

  mapsButton: {
    display: 'block',
    textAlign: 'center',
    marginTop: '10px',
    padding: '14px',
    borderRadius: '12px',
    background: '#1a6b4a',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    textDecoration: 'none',
  },

  deleteButton: {
    display: 'block',
    width: '100%',
    marginTop: '10px',
    padding: '10px',
    borderRadius: '12px',
    border: '1.5px solid #e3c3be',
    background: 'none',
    color: '#c0392b',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center',
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
