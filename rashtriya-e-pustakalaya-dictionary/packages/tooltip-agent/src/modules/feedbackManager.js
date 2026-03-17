/**
 * Feedback Manager Module
 * Capture thumbs up/down for analytics (LocalStorage or optional API)
 */

const STORAGE_KEY = 'tooltip-agent-feedback'

/**
 * @param {string} [storageKey]
 * @returns {{ submit: (conceptId: string, helpful: boolean) => Promise<void>, hasVoted: (conceptId: string) => boolean }}
 */
export function createFeedbackManager(storageKey = STORAGE_KEY) {
  function getStored() {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return {}
      const obj = JSON.parse(raw)
      return typeof obj === 'object' && obj !== null ? obj : {}
    } catch {
      return {}
    }
  }

  function setStored(obj) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(obj))
    } catch {}
  }

  return {
    async submit(conceptId, helpful) {
      const map = getStored()
      map[conceptId] = { helpful, at: Date.now() }
      setStored(map)
    },

    hasVoted(conceptId) {
      const map = getStored()
      return conceptId in map
    },

    async removeFeedback(conceptId) {
      const map = getStored()
      delete map[conceptId]
      setStored(map)
    },

    /** @returns {{ [conceptId: string]: { helpful: boolean, at: number } }} */
    getFeedback() {
      return getStored()
    },
  }
}
