import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { useSession } from '../lib/session'
import { PLACES, getPlaceById } from '../data/places'
import { EVENT_CATEGORIES, DEFAULT_EVENT_CATEGORY, getEventCategoryLabel } from '../data/events'
import { createEvent } from '../lib/events'
import { geocodeAddress } from '../lib/geocode'
import { listMyOrganizations } from '../lib/organizations'

// Lets a signed-in user add a community event that shows up on the map.
// Location is set two ways: pick a curated place (known coordinates), or type
// an address (geocoded via Nominatim so it can still be pinned). Built to
// mirror the salary form's structure and styles.

function today() {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

export default function AddEventPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const navigate = useNavigate()
  const session = useSession()
  const userId = session?.user?.id

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(DEFAULT_EVENT_CATEGORY)
  const [date, setDate] = useState(today())
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')

  const [locationMode, setLocationMode] = useState('place') // 'place' | 'address'
  const [placeId, setPlaceId] = useState('')
  const [address, setAddress] = useState('')

  // If this user runs any organization pages, let them tag the event to one.
  const [myOrgs, setMyOrgs] = useState([])
  const [orgId, setOrgId] = useState('')
  useEffect(() => { listMyOrganizations(userId).then(setMyOrgs) }, [userId])

  const [err, setErr] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    setErr('')
    setNote('')

    const cleanTitle = title.trim()
    if (!cleanTitle) { setErr('title'); return }

    let lat = null
    let lng = null
    let addressVal = null
    let placeIdVal = null

    if (locationMode === 'place') {
      const place = getPlaceById(placeId)
      if (!place) { setErr('location'); return }
      lat = place.lat
      lng = place.lng
      addressVal = place.address
      placeIdVal = place.id
    } else {
      const addr = address.trim()
      if (!addr) { setErr('location'); return }
      addressVal = addr
      // Best-effort: if it can't be placed, we still save the event (its
      // address + the Google Maps link still work), it just gets no pin.
      const coords = await geocodeAddress(addr)
      if (coords) {
        lat = coords.lat
        lng = coords.lng
      } else {
        setNote('geocode')
      }
    }

    setSubmitting(true)
    try {
      await createEvent({
        title: cleanTitle,
        description: description.trim() || null,
        category,
        event_date: date,
        event_time: time || null,
        address: addressVal,
        place_id: placeIdVal,
        organization_id: orgId ? Number(orgId) : null,
        lat,
        lng,
      }, userId)
      navigate('/map')
    } catch {
      setErr('generic')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title={t('event.addTitle')} subtitle={t('event.addSubtitle')} back />

      <form onSubmit={handleAdd} style={styles.form}>
        <label style={styles.label}>{t('event.name')}</label>
        <input
          type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder={t('event.namePlaceholder')} style={styles.input}
        />

        {myOrgs.length > 0 && (
          <>
            <label style={styles.label}>{t('event.postAs')}</label>
            <select value={orgId} onChange={e => setOrgId(e.target.value)} style={styles.input}>
              <option value="">{t('event.postAsPersonal')}</option>
              {myOrgs.map(o => (
                <option key={o.id} value={o.id}>{o.icon ? o.icon + ' ' : ''}{o.name}</option>
              ))}
            </select>
          </>
        )}

        <div style={styles.formRow}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>{t('event.category')}</label>
            <select
              value={category} onChange={e => setCategory(e.target.value)}
              style={styles.input}
            >
              {Object.keys(EVENT_CATEGORIES).map(c => (
                <option key={c} value={c}>
                  {EVENT_CATEGORIES[c].icon} {getEventCategoryLabel(c, lang)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>{t('event.date')}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>{t('event.time')}</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={styles.input} />
          </div>
        </div>

        <label style={styles.label}>{t('event.location')}</label>
        <div style={styles.segmented}>
          <button
            type="button" onClick={() => setLocationMode('place')}
            style={segStyle(locationMode === 'place')}
          >
            {t('event.pickPlace')}
          </button>
          <button
            type="button" onClick={() => setLocationMode('address')}
            style={segStyle(locationMode === 'address')}
          >
            {t('event.typeAddress')}
          </button>
        </div>

        {locationMode === 'place' ? (
          <>
            <label style={styles.label}>{t('event.choosePlace')}</label>
            <select value={placeId} onChange={e => setPlaceId(e.target.value)} style={styles.input}>
              <option value="">{t('event.choosePlacePlaceholder')}</option>
              {PLACES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </>
        ) : (
          <>
            <label style={styles.label}>{t('event.address')}</label>
            <input
              type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder={t('event.addressPlaceholder')} style={styles.input}
            />
          </>
        )}

        <label style={styles.label}>{t('event.description')}</label>
        <textarea
          value={description} onChange={e => setDescription(e.target.value)}
          placeholder={t('event.descriptionPlaceholder')}
          style={{ ...styles.input, minHeight: '84px', resize: 'vertical' }}
        />

        {note === 'geocode' && <p style={styles.note}>{t('event.geocodeFailed')}</p>}
        {err && <p style={styles.err}>{err === 'generic' ? t('common.error') : t('event.required')}</p>}

        <button type="submit" disabled={submitting} style={{ ...styles.saveBtn, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? t('event.saving') : t('event.save')}
        </button>
      </form>
    </div>
  )
}

function segStyle(active) {
  return {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    border: active ? '1.5px solid #1a6b4a' : '1.5px solid #e8e4dc',
    background: active ? '#1a6b4a' : '#faf8f2',
    color: active ? '#fff' : '#555',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
  }
}

const styles = {
  form: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #f0ece4',
  },
  formRow: {
    display: 'flex',
    gap: '10px',
  },
  segmented: {
    display: 'flex',
    gap: '8px',
  },
  label: {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#555',
    margin: '12px 0 4px',
  },
  input: {
    width: '100%',
    padding: '11px 12px',
    borderRadius: '10px',
    border: '1.5px solid #e8e4dc',
    background: '#faf8f2',
    fontSize: '15px',
    color: '#1a1a1a',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  note: {
    color: '#b7791f',
    fontSize: '12.5px',
    margin: '8px 0 0',
  },
  err: {
    color: '#c0392b',
    fontSize: '12.5px',
    margin: '8px 0 0',
  },
  saveBtn: {
    width: '100%',
    marginTop: '18px',
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: '#1a6b4a',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
