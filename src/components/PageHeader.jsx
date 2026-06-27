import { useNavigate } from 'react-router-dom'

// A simple header used at the top of most pages: a title, an optional line of
// sub-text, and (on sub-pages) a back chevron. Keeps things visually
// consistent without each page re-inventing it.
export default function PageHeader({ title, subtitle, back }) {
  const navigate = useNavigate()

  return (
    <div style={{ marginBottom: '20px' }}>
      {back && (
        <button onClick={() => navigate(-1)} style={styles.back}>
          ←
        </button>
      )}
      <h1 style={styles.title}>{title}</h1>
      {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}

const styles = {
  back: {
    background: 'none',
    border: 'none',
    color: '#1a6b4a',
    fontSize: '22px',
    cursor: 'pointer',
    padding: '0 0 8px',
    lineHeight: 1,
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a1a',
    letterSpacing: '-0.4px',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b6b6b',
    margin: '4px 0 0',
  },
}
