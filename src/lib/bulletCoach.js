
import { STRONG_VERBS, WEAK_OPENERS, tokenize } from './atsChecker.js'

const FILLER_PHRASES = [
  'in order to', 'a lot of', 'various', 'things', 'stuff', 'etc.',
  'responsible for', 'duties included', 'tasked with',
]


export function analyzeBullet(line) {
  const text = (line || '').trim()
  if (!text) return null

  const words = tokenize(text)
  const firstWord = words[0] || ''
  const wordCount = words.length

  const tags = []
  let verdict = 'ok' // 'good' | 'ok' | 'weak'

  // 1. Opening verb strength
  if (STRONG_VERBS.has(firstWord)) {
    tags.push({ label: 'strong verb', kind: 'good' })
  } else if (WEAK_OPENERS.has(firstWord)) {
    tags.push({ label: 'weak opener', kind: 'bad' })
    verdict = 'weak'
  }

  // 2. Quantified impact
  const hasNumber = /\d/.test(text)
  if (hasNumber) {
    tags.push({ label: 'has metric', kind: 'good' })
  } else {
    tags.push({ label: 'no number', kind: 'neutral' })
  }

  // 3. Length sanity — too short to say anything real, or runs on
  if (wordCount > 0 && wordCount < 4) {
    tags.push({ label: 'too short', kind: 'bad' })
    verdict = 'weak'
  } else if (wordCount > 28) {
    tags.push({ label: 'quite long — consider splitting', kind: 'neutral' })
  }

  // 4. Filler phrases
  const lower = text.toLowerCase()
  const foundFiller = FILLER_PHRASES.find(f => lower.includes(f))
  if (foundFiller) {
    tags.push({ label: `filler: "${foundFiller}"`, kind: 'bad' })
    verdict = 'weak'
  }

  // Promote to "good" only if it has a strong verb AND a metric AND
  // no negative tags — this is intentionally strict so "good" means
  // something real, not just "not terrible".
  const hasBad = tags.some(t => t.kind === 'bad')
  if (!hasBad && STRONG_VERBS.has(firstWord) && hasNumber) {
    verdict = 'good'
  } else if (!hasBad && verdict === 'ok') {
    verdict = 'ok'
  }

  return { text, tags, verdict, wordCount }
}

// Analyze a full multi-line description block (as stored in the
// Experience/Projects textareas) and return one result per line.
export function analyzeDescriptionBlock(description) {
  if (!description) return []
  return description
    .split('\n')
    .map(l => l.replace(/^[•·\-\*▸]\s*/, ''))
    .map(analyzeBullet)
    .filter(Boolean)
}
