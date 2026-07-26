import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
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
import {
  getSavedLocations,
  subscribeSavedLocations,
} from '../lib/storage'

const DEFAULT_MAP_CENTRE = [1.315, 103.84]
const DEFAULT_MAP_ZOOM = 12

function normaliseSearchText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function savedLocationKey(type, id) {
  return `${type}:${String(id)}`
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
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [savedLocations, setSavedLocations] = useState(
    () => getSavedLocations()
  )

  const searchTerm = normaliseSearchText(query)

  const savedKeys = useMemo(() => {
    return new Set(
      savedLocations.map(item => item.key)
    )
  }, [savedLocations])

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

  useEffect(() => {
    setSavedLocations(getSavedLocations())

    return subscribeSavedLocations(nextLocations => {
      setSavedLocations(nextLocations)
    })
  }, [])

  const filteredPlaces = useMemo(() => {
    return PLACES.filter(place => {
      const key = savedLocationKey('place', place.id)

      const matchesSaved =
        !showSavedOnly || savedKeys.has(key)

      const matchesCategory =
        activeCat === 'all' ||
        place.category === activeCat

      if (!matchesSaved || !matchesCategory) {
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
  }, [
    activeCat,
    lang,
    savedKeys,
    searchTerm,
    showSavedOnly,
  ])

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const key = savedLocationKey('event', event.id)

      if (showSavedOnly && !savedKeys.has(key)) {
        return false
      }

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
  }, [
    events,
    lang,
    savedKeys,
    searchTerm,
    showSavedOnly,
  ])

  useEffect(() => {
    if (!mapEl.current || mapRef.current) {
      return
    }

    const map = L.map(mapEl.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView(
      DEFAULT_MAP_CENTRE,
      DEFAULT_MAP_ZOOM
    )

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
      const isSaved = savedKeys.has(
        savedLocationKey('place', place.id)
      )

      const icon = L.divIcon({
        className: 'kasama-pin',
        html: `
          <div style="
            position: relative;
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${category.color};
            border: ${isSaved
              ? '3px solid #f6c344'
              : '2.5px solid #fff'};
            box-shadow: ${isSaved
              ? '0 0 0 3px rgba(246,195,68,.30), 0 3px 8px rgba(0,0,0,.35)'
              : '0 2px 6px rgba(0,0,0,.35)'};
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

            ${isSaved
              ? `
                <span style="
                  position: absolute;
                  right: -8px;
                  top: -8px;
                  width: 17px;
                  height: 17px;
                  border-radius: 50%;
                  background: #f6c344;
                  color: #604800;
                  border: 2px solid #fff;
                  transform: rotate(45deg);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  line-height: 1;
                ">
                  ★
                </span>
              `
              : ''}
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [17, 32],
      })

      const marker = L.marker(
        [place.lat, place.lng],
        { icon }
      ).addTo(layer)

      marker.bindTooltip(
        isSaved
          ? `★ ${place.name}`
          : place.name,
        {
          direction: 'top',
          offset: [0, -30],
        }
      )

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
      const isSaved = savedKeys.has(
        savedLocationKey('event', event.id)
      )

      const icon = L.divIcon({
        className:
          'kasama-pin kasama-pin--event',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 9px;
            background: ${category.color};
            border: ${isSaved
              ? '3px solid #f6c344'
              : '2.5px solid #fff'};
            box-shadow: ${isSaved
              ? '0 0 0 3px rgba(246,195,68,.30), 0 3px 8px rgba(0,0,0,.35)'
              : '0 2px 6px rgba(0,0,0,.35)'};
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

            ${isSaved
              ? `
                <span style="
                  position: absolute;
                  right: -8px;
                  top: -8px;
                  width: 17px;
                  height: 17px;
                  border-radius: 50%;
                  background: #f6c344;
                  color: #604800;
                  border: 2px solid #fff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  line-height: 1;
                ">
                  ★
                </span>
              `
              : ''}
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [16, 16],
      })

      const marker = L.marker(
        [event.lat, event.lng],
        { icon }
      ).addTo(layer)

      marker.bindTooltip(
        isSaved
          ? `★ ${event.title}`
          : event.title,
        {
          direction: 'top',
          offset: [0, -16],
        }
      )

      marker.on('click', () => {
        navigate(`/event/${event.id}`)
      })
    })
  }, [
    filteredEvents,
    filteredPlaces,
    navigate,
    savedKeys,
  ])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    const coordinates = [
      ...filteredPlaces.map(place => [
        place.lat,
        place.lng,
      ]),
      ...filteredEvents
        .filter(event => (
          typeof event.lat === 'number' &&
          typeof event.lng === 'number'
        ))
        .map(event => [
          event.lat,
          event.lng,
        ]),
    ]

    if (
      !searchTerm &&
      !showSavedOnly
    ) {
      return
    }

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
      return
    }

    map.setView(
      DEFAULT_MAP_CENTRE,
      DEFAULT_MAP_ZOOM
    )
  }, [
    filteredEvents,
    filteredPlaces,
    searchTerm,
    showSavedOnly,
  ])

  const categories = Object.keys(
    PLACE_CATEGORIES
  )

  const noResults =
    filteredPlaces.length === 0 &&
    filteredEvents.length === 0

  function clearSearch() {
    setQuery('')

    if (mapRef.current && !showSavedOnly) {
      mapRef.current.setView(
        DEFAULT_MAP_CENTRE,
        DEFAULT_MAP_ZOOM
      )
    }
  }

  function toggleSavedFilter() {
    setShowSavedOnly(current => !current)
  }

  return (
    <div>
      <PageHeader
        title={t('map.title')}
        subtitle={t('home.mapDesc')}
      />

      <div style={styles.searchWrapper}>
        <span
          aria-hidden="true"
          style={styles.searchIcon}
        >
          🔍
        </span>

        <input
          type="search"
          value={query}
          onChange={event => (
            setQuery(event.target.value)
          )}
          placeholder={t(
            'map.searchPlaceholder',
            {
              defaultValue:
                'Search places and events…',
            }
          )}
          aria-label={t(
            'map.searchPlaceholder',
            {
              defaultValue:
                'Search places and events',
            }
          )}
          style={styles.searchInput}
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label={t(
              'map.clearSearch',
              {
                defaultValue: 'Clear search',
              }
            )}
            style={styles.clearSearch}
          >
            ×
          </button>
        )}
      </div>

      <div style={styles.actionRow}>
        <button
          type="button"
          onClick={toggleSavedFilter}
          aria-pressed={showSavedOnly}
          style={{
            ...styles.savedFilter,
            ...(showSavedOnly
              ? styles.savedFilterActive
              : {}),
          }}
        >
          {showSavedOnly ? '★' : '☆'}{' '}
          {t('map.savedLocations', {
            defaultValue: 'Saved',
          })}

          {savedLocations.length > 0 && (
            <span style={styles.savedCount}>
              {savedLocations.length}
            </span>
          )}
        </button>

        <Link
          to="/events/add"
          style={styles.addBtn}
        >
          ＋ {t('event.addCta')}
        </Link>
      </div>

      <div
        ref={mapEl}
        style={styles.map}
      />

      <div
        className="chips"
        style={styles.chips}
      >
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
            onClick={() => (
              setActiveCat(categoryId)
            )}
          >
            {PLACE_CATEGORIES[categoryId].icon}{' '}
            {getCategoryLabel(categoryId, lang)}
          </Chip>
        ))}
      </div>

      {showSavedOnly &&
        savedLocations.length === 0 && (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>
              ☆
            </span>

            <p style={styles.emptyTitle}>
              {t('map.noSavedLocations', {
                defaultValue:
                  'You have not saved any locations yet.',
              })}
            </p>

            <p style={styles.emptyText}>
              {t('map.saveLocationHint', {
                defaultValue:
                  'Open a place or event and select Save location.',
              })}
            </p>

            <button
              type="button"
              onClick={() => setShowSavedOnly(false)}
              style={styles.emptyButton}
            >
              {t('map.showAll', {
                defaultValue: 'Show all locations',
              })}
            </button>
          </div>
        )}

      {noResults &&
        !(
          showSavedOnly &&
          savedLocations.length === 0
        ) && (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>
              🔎
            </span>

            <p style={styles.emptyTitle}>
              {t('map.noResults', {
                defaultValue:
                  'No matching places or events found.',
              })}
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery('')
                setActiveCat('all')
                setShowSavedOnly(false)
              }}
              style={styles.emptyButton}
            >
              {t('map.clearFilters', {
                defaultValue: 'Clear filters',
              })}
            </button>
          </div>
        )}

      {filteredPlaces.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          {filteredPlaces.map(place => {
            const category = getCategory(
              place.category
            )

            const isSaved = savedKeys.has(
              savedLocationKey(
                'place',
                place.id
              )
            )

            return (
              <Link
                key={place.id}
                to={`/place/${place.id}`}
                style={{
                  ...styles.row,
                  ...(isSaved
                    ? styles.savedRow
                    : {}),
                }}
              >
                <span
                  style={{
                    ...styles.rowIcon,
                    background:
                      `${category.color}20`,
                  }}
                >
                  {category.icon}
                </span>

                <span style={styles.rowText}>
                  <span style={styles.rowName}>
                    {place.name}
                  </span>

                  <span style={styles.rowCat}>
                    {getCategoryLabel(
                      place.category,
                      lang
                    )}
                  </span>

                  {searchTerm &&
                    place.address && (
                      <span
                        style={styles.rowAddress}
                      >
                        {place.address}
                      </span>
                    )}
                </span>

                {isSaved && (
                  <span
                    aria-label="Saved"
                    style={styles.savedStar}
                  >
                    ★
                  </span>
                )}

                <span style={styles.chevron}>
                  ›
                </span>
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
            const category = getEventCategory(
              event.category
            )

            const isSaved = savedKeys.has(
              savedLocationKey(
                'event',
                event.id
              )
            )

            return (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                style={{
                  ...styles.row,
                  ...(isSaved
                    ? styles.savedRow
                    : {}),
                }}
              >
                <span
                  style={{
                    ...styles.rowIcon,
                    background:
                      `${category.color}20`,
                  }}
                >
                  {category.icon}
                </span>

                <span style={styles.rowText}>
                  <span style={styles.rowName}>
                    {event.title}
                  </span>

                  <span style={styles.rowCat}>
                    {formatEventDate(
                      event.event_date
                    )}

                    {event.event_time
                      ? ` · ${event.event_time}`
                      : ''}
                  </span>

                  {searchTerm &&
                    event.address && (
                      <span
                        style={styles.rowAddress}
                      >
                        {event.address}
                      </span>
                    )}
                </span>

                {isSaved && (
                  <span
                    aria-label="Saved"
                    style={styles.savedStar}
                  >
                    ★
                  </span>
                )}

                <span style={styles.chevron}>
                  ›
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.chip,
        background:
          active ? '#1a6b4a' : '#fff',
        color:
          active ? '#fff' : '#555',
        border:
          active
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

  return date.toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
    }
  )
}

const styles = {
  searchWrapper: {
    position: 'relative',
    marginBottom: '10px',
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
    padding: '12px 42px',
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

  actionRow: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '10px',
    marginBottom: '12px',
  },

  savedFilter: {
    minWidth: '104px',
    padding: '11px 12px',
    borderRadius: '12px',
    border: '1.5px solid #d9d4ca',
    background: '#fff',
    color: '#555',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  savedFilterActive: {
    borderColor: '#f6c344',
    background: '#fff9df',
    color: '#604800',
  },

  savedCount: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18px',
    height: '18px',
    marginLeft: '6px',
    padding: '0 4px',
    borderRadius: '999px',
    background: '#f6c344',
    color: '#604800',
    fontSize: '11px',
  },

  addBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '12px',
    borderRadius: '12px',
    background: '#1a6b4a',
    color: '#fff',
    fontSize: '14.5px',
    fontWeight: 600,
    textDecoration: 'none',
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

  groupTitle: {
    marginBottom: '10px',
    color: '#1a1a1a',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },

  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #f0ece4',
    background: '#fff',
    textDecoration: 'none',
  },

  savedRow: {
    borderColor: '#ead589',
    background: '#fffdf5',
  },

  rowIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '19px',
  },

  rowText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },

  rowName: {
    color: '#1a1a1a',
    fontSize: '15px',
    fontWeight: 700,
  },

  rowCat: {
    marginTop: '1px',
    color: '#9a9a9a',
    fontSize: '12.5px',
  },

  rowAddress: {
    marginTop: '3px',
    overflow: 'hidden',
    color: '#777',
    fontSize: '12px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  savedStar: {
    color: '#d69f00',
    fontSize: '17px',
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
    marginBottom: '8px',
    fontSize: '26px',
  },

  emptyTitle: {
    margin: '0 0 8px',
    color: '#666',
    fontSize: '14px',
    lineHeight: 1.45,
  },

  emptyText: {
    margin: '0 0 12px',
    color: '#999',
    fontSize: '12.5px',
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
