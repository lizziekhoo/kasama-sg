// src/lib/customPhrases.js
// Stores user-created phrasebook entries locally on the current device.

const CUSTOM_PHRASES_KEY = 'kasama_custom_phrases'
const CUSTOM_PHRASES_EVENT = 'kasama:custom-phrases-changed'

function readCustomPhrases() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(CUSTOM_PHRASES_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map(normaliseCustomPhrase)
      .filter(Boolean)
  } catch {
    return []
  }
}

function writeCustomPhrases(phrases) {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    window.localStorage.setItem(
      CUSTOM_PHRASES_KEY,
      JSON.stringify(phrases)
    )

    notifyCustomPhrasesChanged()

    return true
  } catch {
    return false
  }
}

export function getCustomPhrases() {
  return readCustomPhrases()
}

export function addCustomPhrase({
  phrase,
  english,
  category,
  language,
}) {
  const cleanPhrase = String(phrase || '').trim()
  const cleanEnglish = String(english || '').trim()
  const cleanCategory = String(category || '').trim()
  const cleanLanguage = String(language || '').trim()

  if (!cleanPhrase) {
    throw new Error('Phrase is required.')
  }

  const newPhrase = {
    id: makeId(),
    phrase: cleanPhrase,
    english: cleanEnglish,
    category: cleanCategory || 'custom',
    language: cleanLanguage || 'en',
    createdAt: new Date().toISOString(),
  }

  const phrases = getCustomPhrases()
  const success = writeCustomPhrases([
    newPhrase,
    ...phrases,
  ])

  if (!success) {
    throw new Error('The phrase could not be saved.')
  }

  return newPhrase
}

export function deleteCustomPhrase(id) {
  const cleanId = String(id || '').trim()

  if (!cleanId) {
    return false
  }

  const phrases = getCustomPhrases()
  const updated = phrases.filter(
    phrase => phrase.id !== cleanId
  )

  if (updated.length === phrases.length) {
    return true
  }

  return writeCustomPhrases(updated)
}

export function subscribeCustomPhrases(callback) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  function handleLocalChange() {
    callback(getCustomPhrases())
  }

  function handleStorageChange(event) {
    if (event.key === CUSTOM_PHRASES_KEY) {
      callback(getCustomPhrases())
    }
  }

  window.addEventListener(
    CUSTOM_PHRASES_EVENT,
    handleLocalChange
  )

  window.addEventListener(
    'storage',
    handleStorageChange
  )

  return () => {
    window.removeEventListener(
      CUSTOM_PHRASES_EVENT,
      handleLocalChange
    )

    window.removeEventListener(
      'storage',
      handleStorageChange
    )
  }
}

function normaliseCustomPhrase(item) {
  if (!item || typeof item !== 'object') {
    return null
  }

  const id = String(item.id || '').trim()
  const phrase = String(item.phrase || '').trim()

  if (!id || !phrase) {
    return null
  }

  return {
    id,
    phrase,
    english: String(item.english || '').trim(),
    category: String(item.category || 'custom').trim(),
    language: String(item.language || 'en').trim(),
    createdAt:
      typeof item.createdAt === 'string'
        ? item.createdAt
        : '',
  }
}

function notifyCustomPhrasesChanged() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(CUSTOM_PHRASES_EVENT)
  )
}

function makeId() {
  return (
    `custom_${Date.now().toString(36)}_` +
    Math.random().toString(36).slice(2, 8)
  )
}
