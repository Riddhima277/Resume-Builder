

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
const PHONE_RE = /(\+?\d{1,3}[\s-]?)?\d{10}|\+?\d{1,3}[\s-]?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4}/
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/i
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/i
const URL_RE = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g

const SECTION_HEADERS = {
  summary: /^(professional\s+)?summary|objective|profile$/i,
  education: /^education(al)?(\s+(background|qualifications?))?$/i,
  experience: /^(work\s+)?experience|employment(\s+history)?$/i,
  projects: /^projects?$/i,
  skills: /^(technical\s+)?skills?$/i,
  activities: /^(extra[\s-]?curricular|activities|achievements|certifications?)$/i,
}

function looksLikeSectionHeader(line) {
  const clean = line.trim().replace(/[:：]\s*$/, '')
  if (clean.length > 40 || clean.length < 3) return null
  for (const [key, re] of Object.entries(SECTION_HEADERS)) {
    if (re.test(clean)) return key
  }
  return null
}

export function parseResumeText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const result = {
    personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
    educationLines: [],
    experienceLines: [],
    projectLines: [],
    skillsLines: [],
    activityLines: [],
  }

  const emailMatch = text.match(EMAIL_RE)
  if (emailMatch) result.personal.email = emailMatch[0]

  const phoneMatch = text.match(PHONE_RE)
  if (phoneMatch) result.personal.phone = phoneMatch[0].trim()

  const linkedinMatch = text.match(LINKEDIN_RE)
  if (linkedinMatch) result.personal.linkedin = linkedinMatch[0]

  const githubMatch = text.match(GITHUB_RE)
  if (githubMatch) result.personal.website = githubMatch[0]

  if (lines.length > 0) {
    const first = lines[0]
    if (first.length < 50 && !EMAIL_RE.test(first) && !/\d{3,}/.test(first)) {
      result.personal.name = first
    }
  }

  if (lines.length > 1) {
    const second = lines[1]
    if (second.length < 80 && !EMAIL_RE.test(second) && !PHONE_RE.test(second) && !looksLikeSectionHeader(second)) {
      result.personal.title = second
    }
  }

  let currentSection = null
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const header = looksLikeSectionHeader(line)
    if (header) {
      currentSection = header
      continue
    }
    if (!currentSection) continue
    if (EMAIL_RE.test(line) || PHONE_RE.test(line) || LINKEDIN_RE.test(line)) continue

    switch (currentSection) {
      case 'summary':
        result.personal.summary = result.personal.summary ? result.personal.summary + ' ' + line : line
        break
      case 'education':
        result.educationLines.push(line)
        break
      case 'experience':
        result.experienceLines.push(line)
        break
      case 'projects':
        result.projectLines.push(line)
        break
      case 'skills':
        result.skillsLines.push(line)
        break
      case 'activities':
        result.activityLines.push(line)
        break
      default:
        break
    }
  }

  return result
}

export function parsedToFormData(parsed, idSeed = Date.now()) {
  let id = idSeed
  const nextId = () => ++id

  const education = []
  if (parsed.educationLines.length) {
    let current = null
    parsed.educationLines.forEach(line => {
      const yearMatch = line.match(/(19|20)\d{2}\s*[—–-]\s*(19|20)\d{2}|(19|20)\d{2}/)
      if (!current || (current.degree && current.institution)) {
        current = { id: nextId(), degree: '', institution: '', location: '', year: '', grade: '' }
        education.push(current)
      }
      if (!current.degree) current.degree = line.replace(/(19|20)\d{2}.*$/, '').trim()
      else if (!current.institution) current.institution = line
      if (yearMatch) current.year = yearMatch[0]
    })
  }

  const projects = []
  if (parsed.projectLines.length) {
    let current = null
    parsed.projectLines.forEach(line => {
      const isBullet = /^[•·\-\*]/.test(line)
      if (!isBullet) {
        current = { id: nextId(), name: line, link: '', tech: '', duration: '', description: '' }
        const urlMatch = line.match(URL_RE)
        if (urlMatch) {
          current.link = urlMatch[0]
          current.name = line.replace(urlMatch[0], '').trim()
        }
        projects.push(current)
      } else if (current) {
        current.description = current.description
          ? current.description + '\n' + line.replace(/^[•·\-\*]\s*/, '')
          : line.replace(/^[•·\-\*]\s*/, '')
      }
    })
  }

  const experience = []
  if (parsed.experienceLines.length) {
    let current = null
    parsed.experienceLines.forEach(line => {
      const isBullet = /^[•·\-\*]/.test(line)
      if (!isBullet) {
        current = { id: nextId(), role: line, company: '', duration: '', description: '' }
        experience.push(current)
      } else if (current) {
        current.description = current.description
          ? current.description + '\n' + line.replace(/^[•·\-\*]\s*/, '')
          : line.replace(/^[•·\-\*]\s*/, '')
      }
    })
  }

  const skillGroups = []
  if (parsed.skillsLines.length) {
    parsed.skillsLines.forEach((line, i) => {
      const colonSplit = line.split(/[:：]/)
      if (colonSplit.length >= 2) {
        skillGroups.push({ id: nextId(), label: colonSplit[0].trim(), skills: colonSplit.slice(1).join(':').trim() })
      } else {
        skillGroups.push({ id: nextId(), label: `Skills ${i + 1}`, skills: line })
      }
    })
  }

  const activities = parsed.activityLines.map(line => {
    const parts = line.replace(/^[•·\-\*]\s*/, '').split(/\s+—\s+|\s+-\s+(?=[A-Z])/)
    return { id: nextId(), title: parts[0] || line, description: parts.slice(1).join(' — ') || '' }
  })

  return {
    personal: parsed.personal,
    education: education.length ? education : undefined,
    experience: experience.length ? experience : undefined,
    projects: projects.length ? projects : undefined,
    skillGroups: skillGroups.length ? skillGroups : undefined,
    activities: activities.length ? activities : undefined,
  }
}
