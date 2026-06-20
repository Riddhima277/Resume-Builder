

const STOPWORDS = new Set([
  'a','an','the','and','or','but','if','then','of','to','in','on','for','with','at','by',
  'from','as','is','are','was','were','be','been','being','this','that','these','those',
  'will','would','should','could','can','may','might','must','shall','it','its','we','you',
  'your','our','their','they','he','she','i','about','into','through','during','before',
  'after','above','below','up','down','out','off','over','under','again','further','than',
  'so','no','nor','not','only','own','same','too','very','just','also','etc','per',
])

const STRONG_VERBS = new Set([
  'built','led','launched','designed','developed','created','implemented','architected',
  'optimized','reduced','increased','improved','automated','streamlined','spearheaded',
  'managed','delivered','achieved','drove','scaled','engineered','deployed','founded',
  'organized','coordinated','negotiated','analyzed','researched','presented','mentored',
  'trained','resolved','migrated','integrated','accelerated','generated','secured',
  'established','pioneered','transformed','executed','directed','authored','published',
])

const WEAK_OPENERS = new Set([
  'worked','helped','responsible','assisted','involved','participated','was','tasked',
])

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean)
}

// ── 1. Keyword extraction from job description ──
export function extractKeywords(jobText) {
  const tokens = tokenize(jobText).filter(w => w.length > 2 && !STOPWORDS.has(w))
  const freq = {}
  tokens.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

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

  const bigramWords = new Set(bigrams.flatMap(p => p.split(' ')))
  const finalSingles = singles.filter(w => !bigramWords.has(w))

  return [...bigrams, ...finalSingles].slice(0, 35)
}

// ── Weighted resume text: different sections carry different weight,
//    mirroring how ATS parsers and recruiters actually read a resume
//    (skills/title are scanned first and weighted heavily; a stray
//    mention buried in a long paragraph counts for less). ──
function weightedResumeSections(data) {
  const p = data.personal
  return {
    high: [p.title, ...data.skillGroups.map(g => g.skills)].filter(Boolean).join(' ').toLowerCase(),
    medium: [
      p.summary,
      ...data.experience.map(e => e.role),
      ...data.projects.map(pr => `${pr.name} ${pr.tech}`),
    ].filter(Boolean).join(' ').toLowerCase(),
    low: [
      ...data.experience.map(e => e.description),
      ...data.projects.map(pr => pr.description),
      ...data.education.map(e => e.degree),
      ...data.activities.map(a => `${a.title} ${a.description}`),
    ].filter(Boolean).join(' ').toLowerCase(),
  }
}

// ── 2. Keyword match sub-score (0-100), weighted by section ──
function keywordMatchScore(data, keywords) {
  if (keywords.length === 0) return { score: 0, matched: [], missing: [] }
  const sections = weightedResumeSections(data)
  const matched = []
  const missing = []
  let weightedHits = 0
  const maxWeight = 3 // high section match weight

  keywords.forEach(kw => {
    if (sections.high.includes(kw)) { matched.push(kw); weightedHits += 3 }
    else if (sections.medium.includes(kw)) { matched.push(kw); weightedHits += 2 }
    else if (sections.low.includes(kw)) { matched.push(kw); weightedHits += 1 }
    else missing.push(kw)
  })

  const maxPossible = keywords.length * maxWeight
  const score = maxPossible === 0 ? 0 : Math.round((weightedHits / maxPossible) * 100)
  return { score, matched, missing }
}

// ── 3. Structural completeness sub-score ──
function structureScore(data) {
  const checks = []
  const p = data.personal

  checks.push({ label: 'Full name', pass: !!p.name.trim() })
  checks.push({ label: 'Email address', pass: !!p.email.trim() })
  checks.push({ label: 'Phone or location', pass: !!(p.phone.trim() || p.location.trim()) })
  checks.push({ label: 'Professional summary', pass: !!p.summary.trim() && p.summary.trim().split(/\s+/).length >= 8 })
  checks.push({ label: 'Education section', pass: data.education.some(e => e.degree || e.institution) })
  checks.push({
    label: 'Experience or Projects',
    pass: data.experience.some(e => e.role || e.company) || data.projects.some(pr => pr.name),
  })
  checks.push({ label: 'Skills section', pass: data.skillGroups.some(g => g.skills.trim()) })
  checks.push({
    label: 'At least one clickable link (LinkedIn/GitHub/Portfolio)',
    pass: !!(p.linkedin.trim() || p.website.trim() || data.portfolio.some(pf => pf.url.trim())),
  })

  const passed = checks.filter(c => c.pass).length
  const score = Math.round((passed / checks.length) * 100)
  return { score, checks }
}

// ── 4. Quantified impact sub-score — % of bullets containing a number/metric ──
function allBulletLines(data) {
  const lines = []
  data.experience.forEach(e => {
    if (e.description) lines.push(...e.description.split('\n').map(l => l.replace(/^[•·\-\*▸]\s*/, '').trim()).filter(Boolean))
  })
  data.projects.forEach(pr => {
    if (pr.description) lines.push(...pr.description.split('\n').map(l => l.replace(/^[•·\-\*▸]\s*/, '').trim()).filter(Boolean))
  })
  return lines
}

function impactScore(data) {
  const lines = allBulletLines(data)
  if (lines.length === 0) return { score: null, total: 0, withMetrics: 0 }
  const numberRe = /\d/
  const withMetrics = lines.filter(l => numberRe.test(l)).length
  const score = Math.round((withMetrics / lines.length) * 100)
  return { score, total: lines.length, withMetrics }
}

// ── 5. Action-verb strength sub-score ──
function actionVerbScore(data) {
  const lines = allBulletLines(data)
  if (lines.length === 0) return { score: null, total: 0, strong: 0, weak: [] }
  let strong = 0
  const weakLines = []
  lines.forEach(line => {
    const firstWord = tokenize(line)[0] || ''
    if (STRONG_VERBS.has(firstWord)) strong++
    else if (WEAK_OPENERS.has(firstWord)) weakLines.push(line)
  })
  const score = Math.round((strong / lines.length) * 100)
  return { score, total: lines.length, strong, weak: weakLines.slice(0, 5) }
}

// ── Combine everything into one explainable result ──
// Weights: keyword match matters most when a job description is given,
// but structure, impact, and verb strength always contribute — a resume
// can't game the score by stuffing keywords into a single line with no
// real substance behind it.
export function scoreResume(data, jobText) {
  const hasJob = !!(jobText && jobText.trim())
  const keywords = hasJob ? extractKeywords(jobText) : []
  const kw = hasJob ? keywordMatchScore(data, keywords) : { score: null, matched: [], missing: [] }
  const structure = structureScore(data)
  const impact = impactScore(data)
  const verbs = actionVerbScore(data)

  // Weighted overall — keyword match only counts if a job description was provided.
  // Impact/verb scores are `null` when there are no bullet points to judge at all
  // (not "0%", which would unfairly penalize someone who just hasn't written
  // Experience/Project bullets yet — there's nothing to score). Inapplicable
  // parts are dropped entirely and their weight redistributes across the
  // remaining applicable parts, so an empty resume scores low for the right
  // reason (missing structure) rather than being propped up by a fake neutral.
  const candidateParts = hasJob
    ? [
        { score: kw.score, weight: 0.4 },
        { score: structure.score, weight: 0.25 },
        { score: impact.score, weight: 0.2 },
        { score: verbs.score, weight: 0.15 },
      ]
    : [
        { score: structure.score, weight: 0.45 },
        { score: impact.score, weight: 0.3 },
        { score: verbs.score, weight: 0.25 },
      ]

  const parts = candidateParts.filter(p => p.score !== null && p.score !== undefined)
  const totalWeight = parts.reduce((s, p) => s + p.weight, 0)
  const overall = totalWeight === 0
    ? 0
    : Math.round(parts.reduce((s, p) => s + p.score * p.weight, 0) / totalWeight)

  return {
    overall,
    hasJob,
    keyword: kw,
    keywordTotal: keywords.length,
    structure,
    impact,
    verbs,
  }
}
