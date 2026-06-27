import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { getPlaceById, getCategory, getCategoryLabel } from '../data/places'

export default function PlaceDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'

  const place = getPlaceById(id)
  if (!place) {
    return (
      <div>
        <PageHeader title={t('rights.notFound')} back />
        <Link to="/map" style={styles.back}>← {t('map.title')}</Link>
      </div>
    )
  }

  const cat = getCategory(place.category)
  // A free, no-API-key way to hand off to a directions view.
  const directionsUrl = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=17/${place.lat}/${place.lng}`

  return (
    <div>
      <PageHeader title={place.name} back />

      <span style={{ ...styles.badge, background: cat.color + '18', color: cat.color }}>
        {cat.icon} {getCategoryLabel(place.category, lang)}
      </span>

      <p style={styles.blurb}>{place.blurb}</p>

      <div style={styles.block}>
        <p style={styles.blockLabel}>📍 {t('place.address')}</p>
        <p style={styles.blockValue}>{place.address}</p>
      </div>

      {place.tip && (
        <div style={styles.block}>
          <p style={styles.blockLabel}>💡 {t('place.tip')}</p>
          <p style={styles.blockValue}>{place.tip}</p>
        </div>
      )}

      <a href={directionsUrl} target="_blank" rel="noreferrer" style={styles.directionsBtn}>
        🧭 {t('map.directions')}
      </a>

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
  directionsBtn: {
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
  back: {
    display: 'inline-block',
    marginTop: '20px',
    color: '#2a7ab0',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
  },
}