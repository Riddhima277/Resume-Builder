export function dataToPlainText(data) {
  const lines = []
  const p = data.personal

  lines.push((p.name || 'Your Name').toUpperCase())
  if (p.title) lines.push(p.title)
  const contactLine = [p.email, p.phone, p.location].filter(Boolean).join('  |  ')
  if (contactLine) lines.push(contactLine)
  const linkLine = [p.linkedin, p.website].filter(Boolean).join('  |  ')
  if (linkLine) lines.push(linkLine)
  lines.push('')

  if (p.summary) {
    lines.push('PROFESSIONAL SUMMARY')
    lines.push('-'.repeat(40))
    lines.push(p.summary)
    lines.push('')
  }

  const hasEdu = data.education.some(e => e.degree || e.institution)
  if (hasEdu) {
    lines.push('EDUCATION')
    lines.push('-'.repeat(40))
    data.education.forEach(e => {
      if (!e.degree && !e.institution) return
      const head = [e.degree, e.institution].filter(Boolean).join(' — ')
      const tail = [e.location, e.year, e.grade].filter(Boolean).join(' | ')
      lines.push(tail ? `${head}  (${tail})` : head)
    })
    lines.push('')
  }

  const hasExp = data.experience.some(e => e.role || e.company)
  if (hasExp) {
    lines.push('WORK EXPERIENCE')
    lines.push('-'.repeat(40))
    data.experience.forEach(e => {
      if (!e.role && !e.company) return
      const head = [e.role, e.company].filter(Boolean).join(' — ')
      lines.push(e.duration ? `${head}  (${e.duration})` : head)
      if (e.description) {
        e.description.split('\n').filter(Boolean).forEach(l => lines.push(`  • ${l.replace(/^[•·\-\*]\s*/, '')}`))
      }
    })
    lines.push('')
  }

  const hasProj = data.projects.some(pr => pr.name)
  if (hasProj) {
    lines.push('PROJECTS')
    lines.push('-'.repeat(40))
    data.projects.forEach(pr => {
      if (!pr.name) return
      let head = pr.name
      if (pr.link) head += `  (${pr.link})`
      lines.push(head)
      if (pr.tech) lines.push(`  Tech: ${pr.tech}`)
      if (pr.description) {
        pr.description.split('\n').filter(Boolean).forEach(l => lines.push(`  • ${l.replace(/^[•·\-\*]\s*/, '')}`))
      }
    })
    lines.push('')
  }

  const hasSkills = data.skillGroups.some(g => g.skills.trim())
  if (hasSkills) {
    lines.push('SKILLS')
    lines.push('-'.repeat(40))
    data.skillGroups.filter(g => g.skills.trim()).forEach(g => {
      lines.push(`${g.label}: ${g.skills}`)
    })
    lines.push('')
  }

  const hasAct = data.activities.some(a => a.title)
  if (hasAct) {
    lines.push('EXTRA-CURRICULAR ACTIVITIES')
    lines.push('-'.repeat(40))
    data.activities.filter(a => a.title).forEach(a => {
      lines.push(`• ${a.title}${a.description ? ' — ' + a.description : ''}`)
    })
    lines.push('')
  }

  const hasPort = data.portfolio.some(pf => pf.url)
  if (hasPort) {
    lines.push('PORTFOLIO')
    lines.push('-'.repeat(40))
    data.portfolio.filter(pf => pf.url).forEach(pf => {
      lines.push(`${pf.label ? pf.label + ': ' : ''}${pf.url}`)
    })
  }

  return lines.join('\n').trim()
}

export function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
