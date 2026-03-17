/**
 * Language Selection Module
 * Store selected language (one of 6); used by Knowledge Retrieval.
 * No translation API — content is retrieved from JSON in chosen language.
 */

import { DEFAULT_LANGUAGE, LANGUAGE_CODES } from '../constants.js'

const STORAGE_KEY = 'tooltip-agent-language'

/**
 * @param {string} [storageKey]
 * @returns {{ getLanguage: () => string, setLanguage: (code: string) => void }}
 */
export function createLanguageSelection(storageKey = STORAGE_KEY) {
  function getStored() {
    try {
      const code = localStorage.getItem(storageKey)
      return LANGUAGE_CODES.includes(code) ? code : DEFAULT_LANGUAGE
    } catch {
      return DEFAULT_LANGUAGE
    }
  }

  return {
    getLanguage() {
      return getStored()
    },

    setLanguage(code) {
      if (!LANGUAGE_CODES.includes(code)) return
      try {
        localStorage.setItem(storageKey, code)
      } catch {}
    },
  }
}
