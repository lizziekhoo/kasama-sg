import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { getSalaryEntries, addSalaryEntry, deleteSalaryEntry } from '../lib/storage'

// Everything here lives in localStorage — no account or network needed, which
// is the whole point: a helper can privately log what they've been paid,
// offline, on a borrowed phone.

function today() {
  // yyyy-mm-dd, in the user's local day (not UTC) so "today" feels right.
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

function monthKey(dateStr) {
  return (dateStr || '').slice(0, 7) // "2026-06"
}

export default function SalaryPage() {
  const { t } = useTranslation()

  const [entries, setEntries] = useState(() => getSalaryEntries())
  const [date, setDate] = useState(today())
  const [amount, setAmount] = useState('')
  const [hours, setHours] = useState('')
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value || value <= 0) {
      setErr('—')
      return
    }
    setErr('')
    addSalaryEntry({
      date,
      amount: value,
      hours: hours ? parseFloat(hours) : null,
      note: note.trim(),
    })
    setEntries(getSalaryEntries())
    // Reset the row but keep the date — usually you log a few in a sitting.
    setAmount('')
    setHours('')
    setNote('')
  }

  function handleDelete(id) {
    if (!window.confirm(t('salary.confirmDelete'))) return
    setEntries(deleteSalaryEntry(id))
  }

  const sorted = useMemo(
    () => [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [entries]
  )

  const thisMonth = monthKey(today())
  const totalThisMonth = entries
    .filter(e => monthKey(e.date) === thisMonth)
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const totalAllTime = entries.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div>
      <PageHeader title={t('salary.title')} subtitle={t('home.salaryDesc')} />

      {/* Summary cards */}
      <div style={styles.summaryRow}>
        <SummaryCard label={t('salary.thisMonth')} value={`$${totalThisMonth.toFixed(2)}`} accent="#1a6b4a" />
        <SummaryCard label={t('salary.allTime')} value={`$${totalAllTime.toFixed(2)}`} accent="#e84e7a" />
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} style={styles.form}>
        <div style={styles.formRow}>
          <div style={{ flex: '0 0 45%' }}>
            <label style={styles.label}>{t('salary.amount')}</label>
            <input
              type="number" step="0.01" min="0" inputMode="decimal"
              value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00" style={styles.input}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>{t('salary.date')}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} />
          </div>
        </div>

        <label style={styles.label}>{t('salary.hours')}</label>
        <input
          type="number" min="0" step="0.5" inputMode="decimal"
          value={hours} onChange={e => setHours(e.target.value)}
          placeholder="e.g. 8" style={styles.input}
        />

        <label style={styles.label}>{t('salary.note')}</label>
        <input
          type="text" value={note} onChange={e => setNote(e.target.value)}
          placeholder="…" style={styles.input}
        />

        {err && <p style={styles.err}>{t('salary.invalidAmount')}</p>}

        <button type="submit" style={styles.saveBtn}>{t('salary.add')}</button>
      </form>

      {/* Entries */}
      <h2 style={styles.groupTitle}>{t('salary.entries')}</h2>

      {sorted.length === 0 ? (
        <p style={styles.empty}>{t('salary.empty')}</p>
      ) : (
        sorted.map(e => (
          <div key={e.id} style={styles.entry}>
            <div style={styles.entryLeft}>
              <span style={styles.entryAmount}>${Number(e.amount).toFixed(2)}</span>
              <span style={styles.entryMeta}>
                {formatDate(e.date)}
                {e.hours ? ` · ${e.hours}h` : ''}
              </span>
              {e.note && <span style={styles.entryNote}>{e.note}</span>}
            </div>
            <button onClick={() => handleDelete(e.id)} style={styles.delBtn} aria-label={t('salary.delete')}>
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  )
}

function SummaryCard({ label, value, accent }) {
  return (
    <div style={{ ...styles.summaryCard, borderTop: `3px solid ${accent}` }}>
      <p style={styles.summaryLabel}>{label}</p>
      <p style={styles.summaryValue}>{value}</p>
    </div>
  )
}

// 2026-06-01 → "1 Jun 2026" — a friendlier read than the raw ISO string.
function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d)) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const styles = {
  summaryRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  summaryCard: {
    flex: 1,
    background: '#fff',
    borderRadius: '14px',
    padding: '14px',
    border: '1px solid #f0ece4',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#9a9a9a',
    fontWeight: 600,
    margin: '0 0 4px',
  },
  summaryValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: 0,
  },
  form: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #f0ece4',
    marginBottom: '24px',
  },
  formRow: {
    display: 'flex',
    gap: '10px',
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
  },
  err: {
    color: '#c0392b',
    fontSize: '12.5px',
    margin: '6px 0 0',
  },
  saveBtn: {
    width: '100%',
    marginTop: '16px',
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: '#1a6b4a',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  groupTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: '10px',
  },
  empty: {
    color: '#9a9a9a',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px 0',
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '8px',
    border: '1px solid #f0ece4',
  },
  entryLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  entryAmount: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a6b4a',
  },
  entryMeta: {
    fontSize: '12.5px',
    color: '#9a9a9a',
  },
  entryNote: {
    fontSize: '12.5px',
    color: '#6b6b6b',
    fontStyle: 'italic',
  },
  delBtn: {
    background: 'none',
    border: 'none',
    color: '#c8c4bc',
    fontSize: '15px',
    cursor: 'pointer',
    padding: '4px 8px',
  },
}
