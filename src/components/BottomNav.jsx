import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// The bottom tab bar — how you get around the app on a phone. We keep it to
// five tabs so a thumb can comfortably reach all of them. Salary and the
// phrasebook live under "Me" so the bar doesn't get crowded.
const TABS = [
  { to: '/',         icon: '🏠', labelKey: 'nav.home' },
  { to: '/help',     icon: '☎️', labelKey: 'nav.help' },
  { to: '/rights',   icon: '📖', labelKey: 'nav.rights' },
  { to: '/map',      icon: '🗺️', labelKey: 'nav.map' },
  { to: '/me',       icon: '👤', labelKey: 'nav.me' },
]

export default function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {TABS.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            // "end" on the home tab so it isn't always active
            end={tab.to === '/'}
            style={({ isActive }) => ({
              ...styles.tab,
              color: isActive ? '#1a6b4a' : '#9a9a9a',
            })}
          >
            <span style={styles.icon}>{tab.icon}</span>
            <span style={styles.label}>{t(tab.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    background: '#ffffff',
    borderTop: '1px solid #ece8e0',
    zIndex: 1000,
    // Respect the home indicator on iPhones
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  inner: {
    maxWidth: '480px',
    margin: '0 auto',
    display: 'flex',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    padding: '8px 0 6px',
    textDecoration: 'none',
    fontSize: '10.5px',
    fontWeight: 600,
  },
  icon: {
    fontSize: '19px',
    lineHeight: 1,
  },
  label: {
    letterSpacing: '0.2px',
  },
}
