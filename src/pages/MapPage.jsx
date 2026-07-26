import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'react-i18next'

import PageHeader from '../components/PageHeader'
import {
  PLACES,
  PLACE_CATEGORIES,
  getCategory,
  getCategoryLabel,
  getPlaceById,
} from '../data/places'
import {
  getEventCategory,
  getEventCategoryLabel,
} from '../data/events'
import { listEvents } from '../lib/events'

const DEFAULT_MAP_CENTRE = [1.315, 103.84]
const DEFAULT_MAP_ZOOM = 12

function normaliseSearchText(value) {
  return String(value || '').trim().toLowerCase()
}

export default function MapPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const navigate = useNavigate()

  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(null)

  const [activeCat, setActiveCat] = useState('all')
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')

  const searchTerm = normaliseSearchText(query)

  useEffect(() => {
    let alive = true

    listEvents()
      .then(list => {
        if (alive) {
          setEvents(Array.isArray(list) ? list : [])
        }
      })
      .catch(() => {
        if (alive) {
          setEvents([])
        }
      })

    return () => {
      alive = false
    }
  }, [])

  const filteredPlaces = useMemo(() => {
    return PLACES.filter(place => {
      const matchesCategory =
        activeCat === 'all' || place.category === activeCat

      if (!matchesCategory) {
        return false
      }

      if (!searchTerm) {
        return true
      }

      const searchableText = normaliseSearchText([
        place.name,
        place.address,
        place.blurb,
        place.tip,
        place.category,
        getCategoryLabel(place.category, lang),
      ].join(' '))

      return searchableText.includes(searchTerm)
    })
  }, [activeCat, lang, searchTerm])

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (!searchTerm) {
        return true
      }

      const linkedPlace = event.place_id
        ? getPlaceById(event.place_id)
        : null

      const searchableText = normaliseSearchText([
        event.title,
        event.description,
        event.address,
        event.category,
        linkedPlace?.name,
        linkedPlace?.address,
        getEventCategoryLabel(event.category, lang),
      ].join(' '))

      return searchableText.includes(searchTerm)
    })
  }, [events, lang, searchTerm])

  useEffect(() => {
    if (!mapEl.current || mapRef.current) {
      return
    }

    const map = L.map(mapEl.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(DEFAULT_MAP_CENTRE, DEFAULT_MAP_ZOOM)

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map)

    markersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    setTimeout(() => {
      map.invalidateSize()
    }, 50)

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = null
    }
  }, [])

  useEffect(() => {
    const layer = markersRef.current

    if (!layer) {
      return
    }

    layer.clearLayers()

    filteredPlaces.forEach(place => {
      const category = getCategory(place.category)

      const icon = L.divIcon({
        className: 'kasama-pin',
        html: `
          <div style="
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${category.color};
            border: 2.5px solid #fff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 15px;
              line-height: 1;
            ">
              ${category.icon}
            </span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 32],
      })

      const marker = L.marker(
        [place.lat, place.lng],
        { icon }
      ).addTo(layer)

      marker.bindTooltip(place.name, {
        direction: 'top',
        offset: [0, -30],
      })

      marker.on('click', () => {
        navigate(`/place/${place.id}`)
      })
    })

    filteredEvents.forEach(event => {
      if (
        typeof event.lat !== 'number' ||
        typeof event.lng !== 'number'
      ) {
        return
      }

      const category = getEventCategory(event.category)

      const icon = L.divIcon({
        className: 'kasama-pin kasama-pin--event',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 9px;
            background: ${category.color};
            border: 2.5px solid #fff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              font-size: 15px;
              line-height: 1;
            ">
              ${category.icon}
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker(
        [event.lat, event.lng],
        { icon }
      ).addTo(layer)

      marker.bindTooltip(event.title, {
        direction: 'top',
        offset: [0, -16],
      })

      marker.on('click', () => {
        navigate(`/event/${event.id}`)
      })
    })
  }, [filteredEvents, filteredPlaces, navigate])

  useEffect(() => {
    const map = mapRef.current

    if (!map || !searchTerm) {
      return
    }

    const coordinates = [
      ...filteredPlaces.map(place => [place.lat, place.lng]),
      ...filteredEvents
        .filter(event => (
          typeof event.lat === 'number' &&
          typeof event.lng === 'number'
        ))
        .map(event => [event.lat, event.lng]),
    ]

    if (coordinates.length === 1) {
      map.flyTo(coordinates[0], 15, {
        duration: 0.5,
      })
      return
    }

    if (coordinates.length > 1) {
      map.fitBounds(
        L.latLngBounds(coordinates),
        {
          padding: [36, 36],
          maxZoom: 15,
        }
      )
    }
  }, [filteredEvents, filteredPlaces, searchTerm])

  const categories = Object.keys(PLACE_CATEGORIES)

  const noResults =
    filteredPlaces.length === 0 &&
    filteredEvents.length === 0

  function clearSearch() {
    setQuery('')

    if (mapRef.current) {
      mapRef.current.setView(
        DEFAULT_MAP_CENTRE,
        DEFAULT_MAP_ZOOM
      )
    }
  }

  return (
    <div>
      <PageHeader
        title={t('map.title')}
        subtitle={t('home.mapDesc')}
      />

      <div style={styles.searchWrapper}>
        <span aria-hidden="true" style={styles.searchIcon}>
          🔍
        </span>

        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={t('map.searchPlaceholder', {
            defaultValue: 'Search places and events…',
          })}
          aria-label={t('map.searchPlaceholder', {
            defaultValue: 'Search places and events',
          })}
          style={styles.searchInput}
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label={t('map.clearSearch', {
              defaultValue: 'Clear search',
            })}
            style={styles.clearSearch}
          >
            ×
          </button>
        )}
      </div>

      <Link to="/events/add" style={styles.addBtn}>
        ＋ {t('event.addCta')}
      </Link>

      <div ref={mapEl} style={styles.map} />

      <div className="chips" style={styles.chips}>
        <Chip
          active={activeCat === 'all'}
          onClick={() => setActiveCat('all')}
        >
          {t('map.all')}
        </Chip>

        {categories.map(categoryId => (
          <Chip
            key={categoryId}
            active={activeCat === categoryId}
            onClick={() => setActiveCat(categoryId)}
          >
            {PLACE_CATEGORIES[categoryId].icon}{' '}
            {getCategoryLabel(categoryId, lang)}
          </Chip>
        ))}
      </div>

      {noResults && (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>🔎</span>

          <p style={styles.emptyTitle}>
            {t('map.noResults', {
              defaultValue: 'No matching places or events found.',
            })}
          </p>

          <button
            type="button"
            onClick={clearSearch}
            style={styles.emptyButton}
          >
            {t('map.clearSearch', {
              defaultValue: 'Clear search',
            })}
          </button>
        </div>
      )}

      {filteredPlaces.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          {filteredPlaces.map(place => {
            const category = getCategory(place.category)

            return (
              <Link
                key={place.id}
                to={`/place/${place.id}`}
                style={styles.row}
              >
                <span
                  style={{
                    ...styles.rowIcon,
                    background: `${category.color}20`,
                  }}
                >
                  {category.icon}
                </span>

                <span style={styles.rowText}>
                  <span style={styles.rowName}>
                    {place.name}
                  </span>

                  <span style={styles.rowCat}>
                    {getCategoryLabel(place.category, lang)}
                  </span>

                  {searchTerm && place.address && (
                    <span style={styles.rowAddress}>
                      {place.address}
                    </span>
                  )}
                </span>

                <span style={styles.chevron}>›</span>
              </Link>
            )
          })}
        </div>
      )}

      {filteredEvents.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={styles.groupTitle}>
            {t('event.sectionTitle')}
          </h2>

          {filteredEvents.map(event => {
            const category = getEventCategory(event.category)

            return (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                style={styles.row}
              >
                <span
                  style={{
                    ...styles.rowIcon,
                    background: `${category.color}20`,
                  }}
                >
                  {category.icon}
                </span>

                <span style={styles.rowText}>
                  <span style={styles.rowName}>
                    {event.title}
                  </span>

                  <span style={styles.rowCat}>
                    {formatEventDate(event.event_date)}
                    {event.event_time
                      ? ` · ${event.event_time}`
                      : ''}
                  </span>

                  {searchTerm && event.address && (
                    <span style={styles.rowAddress}>
                      {event.address}
                    </span>
                  )}
                </span>

                <span style={styles.chevron}>›</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.chip,
        background: active ? '#1a6b4a' : '#fff',
        color: active ? '#fff' : '#555',
        border: active
          ? '1.5px solid #1a6b4a'
          : '1.5px solid #e8e4dc',
      }}
    >
      {children}
    </button>
  )
}

function formatEventDate(iso) {
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
  })
}

const styles = {
  searchWrapper: {
    position: 'relative',
    marginBottom: '12px',
  },

  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '15px',
    pointerEvents: 'none',
  },

  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 42px 12px 42px',
    borderRadius: '12px',
    border: '1.5px solid #e8e4dc',
    background: '#fff',
    color: '#1a1a1a',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
  },

  clearSearch: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: 'none',
    background: '#f0ece4',
    color: '#555',
    fontSize: '20px',
    lineHeight: 1,
    cursor: 'pointer',
  },

  map: {
    height: '360px',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #ece8e0',
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

  addBtn: {
    display: 'block',
    textAlign: 'center',
    marginBottom: '12px',
    padding: '12px',
    borderRadius: '12px',
    background: '#1a6b4a',
    color: '#fff',
    fontSize: '14.5px',
    fontWeight: 600,
    textDecoration: 'none',
  },

  groupTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: '10px',
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
    minWidth: 0,
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

  rowAddress: {
    marginTop: '3px',
    color: '#777',
    fontSize: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  chevron: {
    color: '#c8c4bc',
    fontSize: '22px',
    fontWeight: 700,
  },

  empty: {
    marginTop: '18px',
    padding: '24px 18px',
    borderRadius: '16px',
    border: '1px dashed #d9d4ca',
    background: '#fff',
    textAlign: 'center',
  },

  emptyIcon: {
    display: 'block',
    fontSize: '26px',
    marginBottom: '8px',
  },

  emptyTitle: {
    margin: '0 0 12px',
    color: '#666',
    fontSize: '14px',
    lineHeight: 1.45,
  },

  emptyButton: {
    padding: '8px 14px',
    borderRadius: '9px',
    border: 'none',
    background: '#f0faf5',
    color: '#1a6b4a',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
}
