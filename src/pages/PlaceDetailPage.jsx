import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import PageHeader from '../components/PageHeader'
import {
  getCategory,
  getCategoryLabel,
  getPlaceById,
} from '../data/places'
import {
  isLocationSaved,
  subscribeSavedLocations,
  toggleSavedLocation,
} from '../lib/storage'

export default function PlaceDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const place = getPlaceById(id)
  const placeId = place?.id ? String(place.id) : ''

  const [saved, setSaved] = useState(() => (
    placeId
      ? isLocationSaved('place', placeId)
      : false
  ))

  useEffect(() => {
    if (!placeId) {
      setSaved(false)
      return undefined
    }

    setSaved(isLocationSaved('place', placeId))

    return subscribeSavedLocations(locations => {
      const currentlySaved = locations.some(item => (
        item.type === 'place' &&
        item.id === placeId
      ))

      setSaved(currentlySaved)
    })
  }, [placeId])

  if (!place) {
    return (
      <div>
        <PageHeader title={t('rights.notFound')} back />

        <Link to="/map" style={styles.back}>
          ← {t('map.title')}
        </Link>
      </div>
    )
  }

  const category = getCategory(place.category)

  const directionsUrl =
    `https://www.openstreetmap.org/?mlat=${place.lat}` +
    `&mlon=${place.lng}` +
    `#map=17/${place.lat}/${place.lng}`

  function handleToggleSaved() {
    const nextSavedState = toggleSavedLocation({
      type: 'place',
      id: placeId,
    })

    setSaved(nextSavedState)
  }

  return (
    <div>
      <PageHeader title={place.name} back />

      <span
        style={{
          ...styles.badge,
          background: `${category.color}18`,
          color: category.color,
        }}
      >
        {category.icon}{' '}
        {getCategoryLabel(place.category, lang)}
      </span>

      <p style={styles.blurb}>
        {place.blurb}
      </p>

      <div style={styles.block}>
        <p style={styles.blockLabel}>
          📍 {t('place.address')}
        </p>

        <p style={styles.blockValue}>
          {place.address}
        </p>
      </div>

      {place.tip && (
        <div style={styles.block}>
          <p style={styles.blockLabel}>
            💡 {t('place.tip')}
          </p>

          <p style={styles.blockValue}>
            {place.tip}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggleSaved}
        aria-pressed={saved}
        style={{
          ...styles.saveButton,
          ...(saved ? styles.saveButtonActive : {}),
        }}
      >
        {saved
          ? `★ ${t('place.savedLocation', {
              defaultValue: 'Saved location',
            })}`
          : `☆ ${t('place.saveLocation', {
              defaultValue: 'Save location',
            })}`}
      </button>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noreferrer"
        style={styles.directionsButton}
      >
        🧭 {t('map.directions')}
      </a>

      <Link to="/map" style={styles.back}>
        {t('place.back')}
      </Link>
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

  blurb: {
    fontSize: '15px',
    color: '#2a2a2a',
    lineHeight: 1.6,
    margin: '0 0 24px',
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

  directionsButton: {
    display: 'block',
    textAlign: 'center',
    marginTop: '10px',
    background: '#1a6b4a',
    color: '#fff',
    padding: '14px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 600,
    textDecoration: 'none',
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
