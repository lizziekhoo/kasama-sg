import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import PageHeader from '../components/PageHeader'
import {
  PHRASE_CATEGORIES,
  PHRASES,
  getPhraseText,
} from '../data/phrases'
import {
  addCustomPhrase,
  deleteCustomPhrase,
  getCustomPhrases,
  subscribeCustomPhrases,
} from '../lib/customPhrases'

const SUPPORTED_LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'fil', label: 'Filipino' },
  { id: 'zh', label: '中文' },
  { id: 'ta', label: 'தமிழ்' },
]

const SPEECH_LANGUAGE_CODES = {
  en: 'en-SG',
  fil: 'fil-PH',
  zh: 'zh-CN',
  ta: 'ta-IN',
}

export default function PhrasebookPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] || 'en'

  const [activeCat, setActiveCat] = useState('all')
  const [copied, setCopied] = useState(null)
  const [speakingId, setSpeakingId] = useState(null)

  const [customPhrases, setCustomPhrases] = useState(
    () => getCustomPhrases()
  )

  const [showForm, setShowForm] = useState(false)
  const [phrase, setPhrase] = useState('')
  const [english, setEnglish] = useState('')
  const [category, setCategory] = useState(
    PHRASE_CATEGORIES[0]?.id || 'custom'
  )
  const [language, setLanguage] = useState(
    SUPPORTED_LANGUAGES.some(item => item.id === lang)
      ? lang
      : 'en'
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const speechSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window

  useEffect(() => {
    setCustomPhrases(getCustomPhrases())

    return subscribeCustomPhrases(nextPhrases => {
      setCustomPhrases(nextPhrases)
    })
  }, [])

  useEffect(() => {
    return () => {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window
      ) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const filteredBuiltIn = useMemo(() => {
    if (activeCat === 'custom') {
      return []
    }

    return PHRASES.filter(item => (
      activeCat === 'all' ||
      item.category === activeCat
    ))
  }, [activeCat])

  const filteredCustom = useMemo(() => {
    return customPhrases.filter(item => (
      activeCat === 'all' ||
      activeCat === 'custom' ||
      item.category === activeCat
    ))
  }, [activeCat, customPhrases])

  async function copy(text, id) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)

      setTimeout(() => {
        setCopied(current => (
          current === id ? null : current
        ))
      }, 1400)
    } catch {
      // Clipboard access may be unavailable in some browsers.
    }
  }

  function speak(text, languageId, id) {
    if (!speechSupported || !text?.trim()) {
      return
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(
      text.trim()
    )

    const speechLanguage =
      SPEECH_LANGUAGE_CODES[languageId] ||
      SPEECH_LANGUAGE_CODES.en

    utterance.lang = speechLanguage
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    const voices = window.speechSynthesis.getVoices()
    const baseLanguage = speechLanguage
      .split('-')[0]
      .toLowerCase()

    const matchingVoice =
      voices.find(voice => (
        voice.lang.toLowerCase() ===
        speechLanguage.toLowerCase()
      )) ||
      voices.find(voice => (
        voice.lang
          .toLowerCase()
          .startsWith(baseLanguage)
      ))

    if (matchingVoice) {
      utterance.voice = matchingVoice
    }

    utterance.onend = () => {
      setSpeakingId(current => (
        current === id ? null : current
      ))
    }

    utterance.onerror = () => {
      setSpeakingId(current => (
        current === id ? null : current
      ))
    }

    setSpeakingId(id)
    window.speechSynthesis.speak(utterance)
  }

  function resetForm() {
    setPhrase('')
    setEnglish('')
    setCategory(
      PHRASE_CATEGORIES[0]?.id || 'custom'
    )
    setLanguage(
      SUPPORTED_LANGUAGES.some(item => item.id === lang)
        ? lang
        : 'en'
    )
    setError('')
  }

  function closeForm() {
    resetForm()
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!phrase.trim()) {
      setError(
        t('phrase.required', {
          defaultValue: 'Please enter a phrase.',
        })
      )
      return
    }

    setSaving(true)

    try {
      addCustomPhrase({
        phrase,
        english,
        category,
        language,
      })

      resetForm()
      setShowForm(false)
    } catch (saveError) {
      setError(
        saveError?.message ||
        t('phrase.saveError', {
          defaultValue:
            'The phrase could not be saved.',
        })
      )
    } finally {
      setSaving(false)
    }
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      t('phrase.confirmDelete', {
        defaultValue: 'Delete this phrase?',
      })
    )

    if (!confirmed) {
      return
    }

    if (speakingId === `custom-${id}`) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
    }

    deleteCustomPhrase(id)
  }

  return (
    <div>
      <PageHeader
        title={t('phrase.title')}
        subtitle={t('home.phrasesDesc')}
      />

      <button
        type="button"
        onClick={() => setShowForm(current => !current)}
        style={styles.addButton}
      >
        {showForm
          ? `× ${t('phrase.cancelAdd', {
              defaultValue: 'Cancel',
            })}`
          : `＋ ${t('phrase.addOwn', {
              defaultValue: 'Add your own phrase',
            })}`}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <h2 style={styles.formTitle}>
            {t('phrase.addTitle', {
              defaultValue: 'Add a phrase',
            })}
          </h2>

          <label style={styles.label}>
            {t('phrase.phraseField', {
              defaultValue: 'Phrase',
            })}

            <textarea
              value={phrase}
              onChange={event => (
                setPhrase(event.target.value)
              )}
              placeholder={t(
                'phrase.phrasePlaceholder',
                {
                  defaultValue:
                    'Type the phrase you want to remember',
                }
              )}
              rows={2}
              style={styles.textarea}
            />
          </label>

          <label style={styles.label}>
            {t('phrase.englishField', {
              defaultValue:
                'English meaning (optional)',
            })}

            <input
              type="text"
              value={english}
              onChange={event => (
                setEnglish(event.target.value)
              )}
              placeholder={t(
                'phrase.englishPlaceholder',
                {
                  defaultValue:
                    'What does this phrase mean?',
                }
              )}
              style={styles.input}
            />
          </label>

          <div style={styles.formGrid}>
            <label style={styles.label}>
              {t('phrase.categoryField', {
                defaultValue: 'Category',
              })}

              <select
                value={category}
                onChange={event => (
                  setCategory(event.target.value)
                )}
                style={styles.select}
              >
                {PHRASE_CATEGORIES.map(item => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.icon}{' '}
                    {item.name[lang] || item.name.en}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              {t('phrase.languageField', {
                defaultValue: 'Language',
              })}

              <select
                value={language}
                onChange={event => (
                  setLanguage(event.target.value)
                )}
                style={styles.select}
              >
                {SUPPORTED_LANGUAGES.map(item => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}

          <div style={styles.formActions}>
            <button
              type="button"
              onClick={closeForm}
              style={styles.cancelButton}
            >
              {t('phrase.cancelAdd', {
                defaultValue: 'Cancel',
              })}
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.saveButton,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving
                ? t('phrase.saving', {
                    defaultValue: 'Saving…',
                  })
                : t('phrase.save', {
                    defaultValue: 'Save phrase',
                  })}
            </button>
          </div>
        </form>
      )}

      <div
        className="chips"
        style={styles.chips}
      >
        <Chip
          active={activeCat === 'all'}
          onClick={() => setActiveCat('all')}
        >
          {t('phrase.all')}
        </Chip>

        <Chip
          active={activeCat === 'custom'}
          onClick={() => setActiveCat('custom')}
        >
          ⭐{' '}
          {t('phrase.myPhrases', {
            defaultValue: 'My phrases',
          })}

          {customPhrases.length > 0 &&
            ` (${customPhrases.length})`}
        </Chip>

        {PHRASE_CATEGORIES.map(item => (
          <Chip
            key={item.id}
            active={activeCat === item.id}
            onClick={() => setActiveCat(item.id)}
          >
            {item.icon}{' '}
            {item.name[lang] || item.name.en}
          </Chip>
        ))}
      </div>

      {!speechSupported && (
        <p style={styles.audioWarning}>
          {t('phrase.audioUnavailable', {
            defaultValue:
              'Audio playback is unavailable in this browser.',
          })}
        </p>
      )}

      {filteredCustom.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {t('phrase.myPhrases', {
              defaultValue: 'My phrases',
            })}
          </h2>

          {filteredCustom.map(item => (
            <CustomPhraseCard
              key={item.id}
              item={item}
              copied={copied}
              speakingId={speakingId}
              speechSupported={speechSupported}
              copy={copy}
              speak={speak}
              handleDelete={handleDelete}
              t={t}
            />
          ))}
        </section>
      )}

      {filteredBuiltIn.length > 0 && (
        <section style={styles.section}>
          {filteredCustom.length > 0 && (
            <h2 style={styles.sectionTitle}>
              {t('phrase.suggestedPhrases', {
                defaultValue: 'Suggested phrases',
              })}
            </h2>
          )}

          {filteredBuiltIn.map(item => {
            const text = getPhraseText(item, lang)

            const showEnglish =
              lang !== 'en' &&
              item.en &&
              item.en !== text

            const audioId = `built-in-${item.id}`

            return (
              <div
                key={item.id}
                style={styles.card}
              >
                <p style={styles.phrase}>
                  {text}
                </p>

                {showEnglish && (
                  <p style={styles.english}>
                    {item.en}
                  </p>
                )}

                <div style={styles.cardActions}>
                  <button
                    type="button"
                    onClick={() => copy(text, item.id)}
                    style={styles.copyButton}
                  >
                    {copied === item.id
                      ? `✓ ${t('phrase.copied')}`
                      : `⧉ ${t('phrase.copy')}`}
                  </button>

                  <AudioButton
                    active={speakingId === audioId}
                    disabled={!speechSupported}
                    onClick={() => (
                      speak(text, lang, audioId)
                    )}
                    t={t}
                  />
                </div>
              </div>
            )
          })}
        </section>
      )}

      {activeCat === 'custom' &&
        filteredCustom.length === 0 && (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>
              💬
            </span>

            <p style={styles.emptyTitle}>
              {t('phrase.noCustom', {
                defaultValue:
                  'You have not added any phrases yet.',
              })}
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              style={styles.emptyButton}
            >
              {t('phrase.addFirst', {
                defaultValue:
                  'Add your first phrase',
              })}
            </button>
          </div>
        )}
    </div>
  )
}

function CustomPhraseCard({
  item,
  copied,
  speakingId,
  speechSupported,
  copy,
  speak,
  handleDelete,
  t,
}) {
  const languageLabel =
    SUPPORTED_LANGUAGES.find(
      language => language.id === item.language
    )?.label || item.language

  const audioId = `custom-${item.id}`

  return (
    <div style={styles.customCard}>
      <div style={styles.customHeader}>
        <span style={styles.customBadge}>
          ⭐{' '}
          {t('phrase.customBadge', {
            defaultValue: 'My phrase',
          })}
        </span>

        <span style={styles.languageBadge}>
          {languageLabel}
        </span>
      </div>

      <p style={styles.phrase}>
        {item.phrase}
      </p>

      {item.english && (
        <p style={styles.english}>
          {item.english}
        </p>
      )}

      <div style={styles.cardActions}>
        <button
          type="button"
          onClick={() => copy(
            item.phrase,
            `copy-${item.id}`
          )}
          style={styles.copyButton}
        >
          {copied === `copy-${item.id}`
            ? `✓ ${t('phrase.copied')}`
            : `⧉ ${t('phrase.copy')}`}
        </button>

        <AudioButton
          active={speakingId === audioId}
          disabled={!speechSupported}
          onClick={() => (
            speak(
              item.phrase,
              item.language,
              audioId
            )
          )}
          t={t}
        />

        <button
          type="button"
          onClick={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          🗑️{' '}
          {t('phrase.delete', {
            defaultValue: 'Delete',
          })}
        </button>
      </div>
    </div>
  )
}

function AudioButton({
  active,
  disabled,
  onClick,
  t,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      style={{
        ...styles.audioButton,
        ...(active ? styles.audioButtonActive : {}),
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {active
        ? `⏹ ${t('phrase.stopAudio', {
            defaultValue: 'Stop',
          })}`
        : `🔊 ${t('phrase.playAudio', {
            defaultValue: 'Play audio',
          })}`}
    </button>
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

const styles = {
  addButton: {
    display: 'block',
    width: '100%',
    marginBottom: '12px',
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    background: '#1a6b4a',
    color: '#fff',
    fontFamily: 'inherit',
    fontSize: '14.5px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  form: {
    marginBottom: '16px',
    padding: '16px',
    border: '1px solid #e8e4dc',
    borderRadius: '16px',
    background: '#fff',
  },

  formTitle: {
    margin: '0 0 14px',
    color: '#1a1a1a',
    fontSize: '17px',
  },

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px',
    color: '#444',
    fontSize: '13px',
    fontWeight: 700,
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 12px',
    border: '1.5px solid #ddd8cf',
    borderRadius: '10px',
    fontFamily: 'inherit',
    fontSize: '14px',
  },

  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    padding: '11px 12px',
    border: '1.5px solid #ddd8cf',
    borderRadius: '10px',
    fontFamily: 'inherit',
    fontSize: '14px',
    lineHeight: 1.45,
  },

  select: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 10px',
    border: '1.5px solid #ddd8cf',
    borderRadius: '10px',
    background: '#fff',
    fontFamily: 'inherit',
    fontSize: '14px',
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
  },

  formActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '4px',
  },

  cancelButton: {
    padding: '11px',
    border: '1.5px solid #d9d4ca',
    borderRadius: '10px',
    background: '#fff',
    color: '#555',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  saveButton: {
    padding: '11px',
    border: 'none',
    borderRadius: '10px',
    background: '#1a6b4a',
    color: '#fff',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  error: {
    margin: '0 0 10px',
    color: '#c0392b',
    fontSize: '13px',
    lineHeight: 1.4,
  },

  audioWarning: {
    margin: '0 0 14px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: '#fff4db',
    color: '#765500',
    fontSize: '12.5px',
    lineHeight: 1.4,
  },

  chips: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '4px 0 16px',
    scrollbarWidth: 'none',
  },

  chip: {
    flexShrink: 0,
    padding: '7px 14px',
    borderRadius: '999px',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  section: {
    marginBottom: '18px',
  },

  sectionTitle: {
    margin: '0 0 10px',
    color: '#777',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },

  card: {
    marginBottom: '10px',
    padding: '16px',
    border: '1px solid #f0ece4',
    borderRadius: '16px',
    background: '#fff',
  },

  customCard: {
    marginBottom: '10px',
    padding: '16px',
    border: '1px solid #ead589',
    borderRadius: '16px',
    background: '#fffdf5',
  },

  customHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '10px',
  },

  customBadge: {
    color: '#8b6900',
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },

  languageBadge: {
    padding: '3px 8px',
    borderRadius: '999px',
    background: '#f0ece4',
    color: '#666',
    fontSize: '10.5px',
    fontWeight: 700,
  },

  phrase: {
    margin: '0 0 4px',
    color: '#1a1a1a',
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: 1.35,
  },

  english: {
    margin: '0 0 12px',
    color: '#9a9a9a',
    fontSize: '13.5px',
    fontStyle: 'italic',
  },

  cardActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },

  copyButton: {
    padding: '7px 12px',
    border: 'none',
    borderRadius: '8px',
    background: '#f0faf5',
    color: '#1a6b4a',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  audioButton: {
    padding: '7px 12px',
    border: 'none',
    borderRadius: '8px',
    background: '#eef4ff',
    color: '#285b96',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 600,
  },

  audioButtonActive: {
    background: '#dfeaff',
    color: '#173f70',
  },

  deleteButton: {
    padding: '7px 12px',
    border: 'none',
    borderRadius: '8px',
    background: '#fff0ed',
    color: '#b33a2b',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  empty: {
    padding: '26px 18px',
    border: '1px dashed #d9d4ca',
    borderRadius: '16px',
    background: '#fff',
    textAlign: 'center',
  },

  emptyIcon: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '28px',
  },

  emptyTitle: {
    margin: '0 0 12px',
    color: '#777',
    fontSize: '14px',
  },

  emptyButton: {
    padding: '9px 14px',
    border: 'none',
    borderRadius: '9px',
    background: '#1a6b4a',
    color: '#fff',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
}

