import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { PLACES, PLACE_CATEGORIES, getCategory, getCategoryLabel } from '../data/places'

export default function MapPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const navigate = useNavigate()

  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(null)
  const [activeCat, setActiveCat] = useState('all')

  useEffect(() => {
    const map = L.map(mapEl.current, { zoomControl: true, attributionControl: true })
      .setView([1.315, 103.84], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    markersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    // Tiles sometimes need a nudge to paint after the container sizes itself.
    setTimeout(() => map.invalidateSize(), 50)

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = null
    }
  }, [])
  
  useEffect(() => {
    const layer = markersRef.current
    if (!layer) return
    layer.clearLayers()

    const shown = PLACES.filter(p => activeCat === 'all' || p.category === activeCat)
    shown.forEach(p => {
      const cat = getCategory(p.category)
      const icon = L.divIcon({
        className: 'kasama-pin',
        html: `<div style="
          width:34px;height:34px;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          background:${cat.color};border:2.5px solid #fff;
          box-shadow:0 2px 6px rgba(0,0,0,.35);
          display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);font-size:15px;line-height:1;">${cat.icon}</span>
        </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 32],
      })
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(layer)
      marker.bindTooltip(p.name, { direction: 'top', offset: [0, -30] })
      marker.on('click', () => navigate(`/place/${p.id}`))
    })
  }, [activeCat, navigate])

  const shown = PLACES.filter(p => activeCat === 'all' || p.category === activeCat)
  const cats = Object.keys(PLACE_CATEGORIES)

  return (
    <div>
      <PageHeader title={t('map.title')} subtitle={t('home.mapDesc')} />

      <div ref={mapEl} style={styles.map} />

      <div className="chips" style={styles.chips}>
        <Chip active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
          {t('map.all')}
        </Chip>
        {cats.map(c => (
          <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(c)}>
            {PLACE_CATEGORIES[c].icon} {getCategoryLabel(c, lang)}
          </Chip>
        ))}
      </div>

      {/* A browsable list under the map — tapping tiny pins on a phone is hard. */}
      <div style={{ marginTop: '16px' }}>
        {shown.map(p => {
          const cat = getCategory(p.category)
          return (
            <Link key={p.id} to={`/place/${p.id}`} style={styles.row}>
              <span style={{ ...styles.rowIcon, background: cat.color + '20' }}>{cat.icon}</span>
              <span style={styles.rowText}>
                <span style={styles.rowName}>{p.name}</span>
                <span style={styles.rowCat}>{getCategoryLabel(p.category, lang)}</span>
              </span>
              <span style={styles.chevron}>›</span>
            </Link>
          )
        })}
      </div>
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
  map: {
    height: '360px',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #ece8e0',
    // Leaflet needs a z-index lower than the bottom nav (1000)
    zIndex: 1,
  },
  chips: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '12px 0 4px',
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
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#fff',
    borderRadius: '14px',
    padding: '12px 14px',
    marginBottom: '10px',
    border: '1px solid #f0ece4',
    textDecoration: 'none',
  },
  rowIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '19px',
    flexShrink: 0,
  },
  rowText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  rowName: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  rowCat: {
    fontSize: '12.5px',
    color: '#9a9a9a',
    marginTop: '1px',
  },
  chevron: {
    color: '#c8c4bc',
    fontSize: '22px',
    fontWeight: 700,
  },
}