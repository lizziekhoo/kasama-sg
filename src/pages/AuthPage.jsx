import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'fil', label: 'Filipino', flag: '🇵🇭', native: 'Filipino' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'ta', label: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
]

export default function AuthPage() {
  const { t, i18n } = useTranslation()
  const [step, setStep] = useState('language') // 'language' | 'auth'
  const [mode, setMode] = useState('login')    // 'login' | 'register'
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'en')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function pickLanguage(code) {
    // Let's switch to this language
    setSelectedLang(code)
    i18n.changeLanguage(code)
    localStorage.setItem('kasama_lang', code)
  }

  function proceedToAuth() {
    // Ready for the next step!
    setStep('auth')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'register') {
        // Catch the common ones before we even bother the server.
        if (password.length < 6) {
          setError(t('errorWeakPassword'))
          setLoading(false)
          return
        }
        if (password !== confirmPassword) {
          setError(t('errorPasswordMismatch'))
          setLoading(false)
          return
        }
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError
        setSuccess(t('successRegister'))
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        // All good — App.jsx will handle the redirect
      }
    } catch (err) {
      // Match our friendly copy where we can — but otherwise show Supabase's
      // actual message. A vague "something went wrong" is useless when you're
      // trying to work out why sign up keeps failing.
      const msg = (err?.message || '').toLowerCase()
      if (msg.includes('invalid login')) setError(t('errorInvalidCredentials'))
      else if (msg.includes('already registered')) setError(t('errorEmailTaken'))
      else if (msg.includes('password') && msg.includes('6')) setError(t('errorWeakPassword'))
      else if (err?.message) setError(err.message)
      else setError(t('errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.root}>
      {/* Just some pretty background blobs */}
      <div style={styles.blobTop} />
      <div style={styles.blobBottom} />

      <div style={styles.card}>
        {/* Here's our logo */}
        <div style={styles.logoRow}>
          <span style={styles.logoHeart}>♥</span>
          <span style={styles.logoText}>Kasama</span>
        </div>
        <p style={styles.tagline}>{t('tagline')}</p>

        {step === 'language' ? (
          /* First things first — let's pick a language */
          <div>
            <p style={styles.sectionLabel}>{t('chooseLanguage')}</p>
            <div style={styles.langGrid}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => pickLanguage(lang.code)}
                  style={{
                    ...styles.langBtn,
                    ...(selectedLang === lang.code ? styles.langBtnActive : {})
                  }}
                >
                  <span style={styles.langFlag}>{lang.flag}</span>
                  <span style={styles.langNative}>{lang.native}</span>
                  {selectedLang === lang.code && (
                    <span style={styles.langCheck}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={proceedToAuth}
              style={styles.primaryBtn}
            >
              Continue →
            </button>
          </div>
        ) : (
          /* Now for the fun part — sign in or join up! */
          <div>
            {/* Tab toggle */}
            <div style={styles.tabRow}>
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
              >
                {t('signIn')}
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); setSuccess('') }}
                style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
              >
                {t('signUp')}
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>{t('email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                style={styles.input}
              />

              <label style={styles.label}>{t('password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                style={styles.input}
              />

              {mode === 'register' && (
                <>
                  <label style={styles.label}>{t('confirmPassword')}</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    style={styles.input}
                  />
                </>
              )}

              {error && <p style={styles.errorMsg}>{error}</p>}
              {success && <p style={styles.successMsg}>{success}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? t('loading') : mode === 'login' ? t('signIn') : t('createAccount')}
              </button>
            </form>

            {/* Changed your mind about the language? */}
            <button
              onClick={() => setStep('language')}
              style={styles.backBtn}
            >
              ← Change language
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#faf8f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  blobTop: {
    position: 'absolute',
    top: '-120px',
    right: '-80px',
    width: '380px',
    height: '380px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #1a6b4a22 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blobBottom: {
    position: 'absolute',
    bottom: '-100px',
    left: '-60px',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #f59e4422 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 40px rgba(26,107,74,0.10)',
    position: 'relative',
    zIndex: 1,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  logoHeart: {
    fontSize: '28px',
    color: '#e84e7a',
    lineHeight: 1,
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '13px',
    color: '#1a6b4a',
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '28px',
  },
  sectionLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '14px',
  },
  langGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '20px',
  },
  langBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #e8e4dc',
    background: '#faf8f2',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    position: 'relative',
  },
  langBtnActive: {
    border: '1.5px solid #1a6b4a',
    background: '#f0faf5',
    color: '#1a6b4a',
  },
  langFlag: {
    fontSize: '20px',
    lineHeight: 1,
  },
  langNative: {
    flex: 1,
    textAlign: 'left',
  },
  langCheck: {
    fontSize: '14px',
    color: '#1a6b4a',
    fontWeight: '700',
  },
  primaryBtn: {
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    background: '#1a6b4a',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    marginTop: '4px',
  },
  tabRow: {
    display: 'flex',
    gap: '4px',
    background: '#f4f2ec',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    padding: '9px',
    borderRadius: '7px',
    border: 'none',
    background: 'transparent',
    color: '#888',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tabActive: {
    background: '#ffffff',
    color: '#1a1a1a',
    fontWeight: '600',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '4px',
    marginTop: '12px',
  },
  input: {
    padding: '13px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e8e4dc',
    background: '#faf8f2',
    fontSize: '15px',
    color: '#1a1a1a',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    fontFamily: 'inherit',
  },
  errorMsg: {
    fontSize: '13px',
    color: '#c0392b',
    background: '#fdf0ee',
    borderRadius: '8px',
    padding: '10px 12px',
    marginTop: '8px',
  },
  successMsg: {
    fontSize: '13px',
    color: '#1a6b4a',
    background: '#f0faf5',
    borderRadius: '8px',
    padding: '10px 12px',
    marginTop: '8px',
  },
  backBtn: {
    marginTop: '16px',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '4px 0',
  },
}
