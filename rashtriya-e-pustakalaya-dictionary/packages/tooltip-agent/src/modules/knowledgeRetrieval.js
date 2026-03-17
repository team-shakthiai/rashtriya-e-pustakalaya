/**
 * Knowledge Retrieval Module
 * Loads and caches JSON knowledge; lookup by concept key + language.
 * No LLM; all content from pre-built JSON.
 */

const SUPPORTED_LANGS = ['en', 'hi', 'bn', 'ta', 'te', 'mr']
const FALLBACK_LANG = 'en'

let cachedStore = null
let loadPromise = null

/**
 * Normalize word for lookup key (lowercase, trim, optional punctuation strip)
 * @param {string} word
 * @returns {string}
 */
export function normalizeKey(word) {
  if (typeof word !== 'string') return ''
  return word.trim().toLowerCase().replace(/[^\w\s-]/g, '')
}

/**
 * Load knowledge from URL or in-memory object
 * @param {string | object} source - URL to JSON or plain object
 * @returns {Promise<void>}
 */
export function loadKnowledge(source) {
  if (loadPromise) return loadPromise
  loadPromise = Promise.resolve().then(async () => {
    if (typeof source === 'object' && source !== null) {
      cachedStore = source
      return
    }
    const res = await fetch(source)
    if (!res.ok) throw new Error(`Failed to load knowledge: ${res.status}`)
    cachedStore = await res.json()
  })
  return loadPromise
}

/**
 * Try to find a concept key that matches the word (direct key or alternate normalizations).
 * Matches case-insensitively so "Monographs" in JSON matches hover word "Monographs".
 * @param {string} word
 * @returns {string | null} key in cachedStore or null
 */
function findConceptKey(word) {
  if (!cachedStore) return null
  const key = normalizeKey(word)
  if (cachedStore[key]) return key
  const withUnderscores = key.replace(/\s+/g, '_')
  if (cachedStore[withUnderscores]) return withUnderscores
  const withSpaces = key.replace(/_/g, ' ')
  if (cachedStore[withSpaces]) return withSpaces
  // Match stored keys case-insensitively (e.g. "Monographs" in JSON vs "monographs" from normalizeKey)
  for (const storedKey of Object.keys(cachedStore)) {
    const n = normalizeKey(storedKey)
    if (n === key || n === withUnderscores || n === withSpaces) return storedKey
  }
  return null
}

/**
 * Get concept entry for a word in the given language
 * @param {string} word - Raw or normalized word
 * @param {string} language - Language code (en, hi, bn, ta, te, mr)
 * @returns {import('../types').ConceptEntry | null}
 */
export function getConcept(word, language = FALLBACK_LANG) {
  if (!cachedStore) return null
  const key = findConceptKey(word)
  if (!key) return null
  const concept = cachedStore[key]
  if (!concept || typeof concept !== 'object') return null
  const lang = SUPPORTED_LANGS.includes(language) ? language : FALLBACK_LANG
  const entry = concept[lang] ?? concept[FALLBACK_LANG]
  if (!entry || typeof entry !== 'object') return null
  if (!entry.definition || !entry.contextual_explanation) return null
  return {
    definition: entry.definition,
    contextual_explanation: entry.contextual_explanation,
    detailed_explanation: entry.detailed_explanation ?? '',
    example: entry.example ?? '',
    related_concepts: Array.isArray(entry.related_concepts) ? entry.related_concepts : [],
  }
}

const MAX_PHRASE_WORDS = 6

/**
 * Find a multi-word phrase in the sentence that matches a concept (e.g. "Drug Proving", "Homoeopathic Materia Medica").
 * Tries consecutive word runs from longest to shortest so longer phrases match first.
 * @param {string} sentence
 * @param {string} language
 * @returns {{ phrase: string, entry: object } | null}
 */
export function findConceptPhraseInSentence(sentence, language = FALLBACK_LANG) {
  if (!cachedStore || typeof sentence !== 'string') return null
  const words = sentence.trim().split(/\s+/).filter(Boolean)
  if (words.length < 2) return null
  for (let len = Math.min(MAX_PHRASE_WORDS, words.length); len >= 2; len--) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(' ')
      const entry = getConcept(phrase, language)
      if (entry) return { phrase, entry }
    }
  }
  return null
}

/**
 * Check if knowledge is loaded
 */
export function isLoaded() {
  return cachedStore !== null
}
