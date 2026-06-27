import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSession } from '../lib/session'

export default function HomePage() {
  const { t } = useTranslation()
  const session = useSession()
  const email = session?.user?.email || ''
  const firstName = email.split('@')[0] || ''

  return (
    <div>
      {/* Greeting */}
      <p style={styles.hello}>{t('home.greeting')}{firstName ? `, ${firstName}` : ''} 👋</p>
      <p style={styles.subhead}>{t('home.subhead')}</p>

      {/* Emergency shortcut — always at the top, one glance away */}
      <Link to="/help" style={styles.emergency}>
        <span style={{ fontSize: '22px' }}>🆘</span>
        <span>
          <strong>999 / 995</strong>
          <span style={styles.emergencySub}> — {t('home.emergencyBanner')}</span>
        </span>
        <span style={styles.emergencyCta}>{t('home.emergencyCta')} →</span>
      </Link>

      {/* Feature cards */}
      <div style={styles.grid}>
        <FeatureCard to="/help" icon="☎️" color="#c0392b" title={t('home.helpTitle')} desc={t('home.helpDesc')} />
        <FeatureCard to="/rights" icon="📖" color="#1a6b4a" title={t('home.rightsTitle')} desc={t('home.rightsDesc')} />
        <FeatureCard to="/map" icon="🗺️" color="#2a7ab0" title={t('home.mapTitle')} desc={t('home.mapDesc')} />
        <FeatureCard to="/phrasebook" icon="💬" color="#6b4a9e" title={t('home.phrasesTitle')} desc={t('home.phrasesDesc')} />
        <FeatureCard to="/salary" icon="💵" color="#d98324" title={t('home.salaryTitle')} desc={t('home.salaryDesc')} />
      </div>
    </div>
  )
}

function FeatureCard({ to, icon, color, title, desc }) {
  return (
    <Link to={to} style={styles.card}>
      <span style={{ ...styles.cardIcon, background: color + '1a', color }}>{icon}</span>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDesc}>{desc}</p>
    </Link>
  )
}

const styles = {
  hello: {
    fontSize: '13px',
    color: '#9a9a9a',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '4px 0 2px',
  },
  subhead: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#1a1a1a',
    letterSpacing: '-0.4px',
    margin: '0 0 20px',
  },
  emergency: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, #b8423a 0%, #c0392b 100%)',
    color: '#fff',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '22px',
    textDecoration: 'none',
  },
  emergencySub: {
    opacity: 0.85,
    fontSize: '13px',
  },
  emergencyCta: {
    marginLeft: 'auto',
    fontSize: '12.5px',
    fontWeight: 700,
    background: 'rgba(255,255,255,0.18)',
    padding: '5px 10px',
    borderRadius: '999px',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #f0ece4',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  cardIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '21px',
    marginBottom: '12px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#1a1a1a',
    margin: '0 0 4px',
  },
  cardDesc: {
    fontSize: '12.5px',
    color: '#8a8a8a',
    lineHeight: 1.4,
    margin: 0,
  },
}
