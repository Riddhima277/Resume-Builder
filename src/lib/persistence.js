// Auto-save to localStorage — debounced so we don't write on every keystroke.
const STORAGE_KEY = 'resumeforge:data'
const STORAGE_META_KEY = 'resumeforge:meta'

export function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function loadSavedMeta() {
  try {
    const raw = localStorage.getItem(STORAGE_META_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

let saveTimer = null
export function saveData(data, meta = {}) {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      localStorage.setItem(STORAGE_META_KEY, JSON.stringify({ ...meta, savedAt: Date.now() }))
    } catch {
      // localStorage full or unavailable — fail silently, not critical
    }
  }, 600)
}

export function clearSavedData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_META_KEY)
  } catch {
    /* noop */
  }
}
