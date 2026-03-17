/**
 * Save Manager Module
 * Persist saved/bookmarked concepts (LocalStorage or optional API)
 */

const STORAGE_KEY = 'tooltip-agent-saved'

/**
 * @param {string} [storageKey]
 * @returns {{ save: (id: string, payload: object) => Promise<void>, unsave: (id: string) => Promise<void>, getSaved: () => Promise<object[]>, isSaved: (id: string) => boolean }}
 */
export function createSaveManager(storageKey = STORAGE_KEY) {
  function getStored() {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return []
      const arr = JSON.parse(raw)
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  }

  function setStored(arr) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(arr))
    } catch {}
  }

  return {
    async save(id, payload) {
      const list = getStored()
      const idx = list.findIndex((item) => item.id === id)
      const entry = { id, ...payload, savedAt: Date.now() }
      if (idx >= 0) list[idx] = entry
      else list.push(entry)
      setStored(list)
    },

    async unsave(id) {
      const list = getStored().filter((item) => item.id !== id)
      setStored(list)
    },

    async getSaved() {
      return getStored()
    },

    isSaved(id) {
      return getStored().some((item) => item.id === id)
    },
  }
}
