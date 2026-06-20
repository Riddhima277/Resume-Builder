// Simple, transparent ATS-style keyword matcher.
// Pulls all visible text out of resume data, normalizes it, and
// compares against words/phrases pulled from a pasted job description.

const STOPWORDS = new Set([
  'a','an','the','and','or','but','if','then','of','to','in','on','for','with','at','by',
  'from','as','is','are','was','were','be','been','being','this','that','these','those',
  'will','would','should','could','can','may','might','must','shall','it','its','we','you',
  'your','our','their','they','he','she','i','about','into','through','during','before',
  'after','above','below','up','down','out','off','over','under','again','further','than',
  'so','no','nor','not','only','own','same','too','very','just','also','etc','per',
])

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean)
}

// Extract candidate keywords from a job description: meaningful single
// words plus common 2-word phrases ("project management", "machine learning").
export function extractKeywords(jobText) {
  const tokens = tokenize(jobText).filter(w => w.length > 2 && !STOPWORDS.has(w))
  const freq = {}
  tokens.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

  // bigrams
  const rawWords = tokenize(jobText)
  const bigramFreq = {}
  for (let i = 0; i < rawWords.length - 1; i++) {
    const a = rawWords[i], b = rawWords[i + 1]
    if (a.length > 2 && b.length > 2 && !STOPWORDS.has(a) && !STOPWORDS.has(b)) {
      const phrase = `${a} ${b}`
      bigramFreq[phrase] = (bigramFreq[phrase] || 0) + 1
    }
  }

  const singles = Object.entries(freq)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([word]) => word)

  const bigrams = Object.entries(bigramFreq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([phrase]) => phrase)

  // Dedup: drop single words that are already part of a kept bigram
  const bigramWords = new Set(bigrams.flatMap(p => p.split(' ')))
  const finalSingles = singles.filter(w => !bigramWords.has(w))

  return [...bigrams, ...finalSingles].slice(0, 35)
}

// Flatten all resume text into one searchable string.
export function resumeToText(data) {
  const parts = []
  const p = data.personal
  parts.push(p.title, p.summary)
  data.education.forEach(e => parts.push(e.degree, e.institution))
  data.experience.forEach(e => parts.push(e.role, e.company, e.description))
  data.projects.forEach(pr => parts.push(pr.name, pr.tech, pr.description))
  data.skillGroups.forEach(g => parts.push(g.label, g.skills))
  data.activities.forEach(a => parts.push(a.title, a.description))
  return parts.filter(Boolean).join(' ').toLowerCase()
}

export function scoreResume(data, jobText) {
  if (!jobText || !jobText.trim()) return null
  const keywords = extractKeywords(jobText)
  const resumeText = resumeToText(data)

  const matched = []
  const missing = []
  keywords.forEach(kw => {
    if (resumeText.includes(kw)) matched.push(kw)
    else missing.push(kw)
  })

  const score = keywords.length === 0 ? 0 : Math.round((matched.length / keywords.length) * 100)
  return { score, matched, missing, total: keywords.length }
}
