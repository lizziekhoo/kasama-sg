import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { listOrganizations } from '../lib/organizations'
import { getOrgCategory, getOrgCategoryLabel } from '../data/organizations'

// Directory of organization pages. Anyone can browse; the ＋ button lets any
// signed-in user create one (e.g. a volleyball club, a community group).

export default function OrganizationsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'
  const [orgs, setOrgs] = useState([])

  useEffect(() => { listOrganizations().then(setOrgs) }, [])

  return (
    <div>
      <PageHeader title={t('org.title')} subtitle={t('org.subtitle')} />

      <Link to="/orgs/new" style={styles.addBtn}>＋ {t('org.create')}</Link>

      {orgs.length === 0 ? (
        <p style={styles.empty}>{t('org.empty')}</p>
      ) : (
        orgs.map(o => {
          const cat = getOrgCategory(o.category)
          return (
            <Link key={o.id} to={`/org/${o.id}`} style={styles.row}>
              <span style={{ ...styles.rowIcon, background: cat.color + '20' }}>{o.icon || cat.icon}</span>
              <span style={styles.rowText}>
                <span style={styles.rowName}>{o.name}</span>
                {(o.description || getOrgCategoryLabel(o.category, lang)) && (
                  <span style={styles.rowCat}>
                    {o.description ? truncate(o.description) : getOrgCategoryLabel(o.category, lang)}
                  </span>
                )}
              </span>
              <span style={styles.chevron}>›</span>
            </Link>
          )
        })
      )}
    </div>
  )
}

function truncate(s, n = 48) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

const styles = {
  addBtn: {
    display: 'block',
    textAlign: 'center',
    marginBottom: '16px',
    padding: '12px',
    borderRadius: '12px',
    background: '#1a6b4a',
    color: '#fff',
    fontSize: '14.5px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  empty: {
    color: '#9a9a9a',
    fontSize: '14px',
    textAlign: 'center',
    padding: '24px 0',
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
  rowText: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
  rowName: { fontSize: '15px', fontWeight: 700, color: '#1a1a1a' },
  rowCat: { fontSize: '12.5px', color: '#9a9a9a', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chevron: { color: '#c8c4bc', fontSize: '22px', fontWeight: 700 },
}
