import { useEffect, useRef, useState } from 'react'
import './ResumePreview.css'

const http = url => !url ? '#' : /^https?:\/\//.test(url) ? url : 'https://' + url
const strip = url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const tc = s => s ? s.replace(/\b\w/g, c => c.toUpperCase()) : ''

export default function ResumePreview({ data, template }) {
  const { personal, experience, education, projects, skillGroups, activities, portfolio } = data
  const wrapRef = useRef()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const upd = () => {
      if (!wrapRef.current) return
      // 794 = A4 at 96dpi. Leave 24px padding.
      const available = wrapRef.current.offsetWidth - 24
      setScale(Math.min(1, available / 794))
    }
    upd()
    const ro = new ResizeObserver(upd)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const tpl = (template || 'Modern').toLowerCase()
  const name = tc(personal.name) || 'Your Name'

  const hasExp   = experience.some(e => e.role || e.company)
  const hasEdu   = education.some(e => e.degree || e.institution)
  const hasProj  = projects.some(p => p.name)
  const hasSkill = skillGroups.some(g => g.skills.trim())
  const hasAct   = activities.some(a => a.title)
  const hasPort  = portfolio.some(p => p.url)

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      {/*
        Outer div: collapses to scaled width so no horizontal scroll.
        Inner div: 794px wide, scaled down, grows naturally in height.
        The preview-wrapper parent has overflow-y:auto so long resumes scroll.
      */}
      <div style={{ width: `${Math.round(794 * scale)}px`, margin: '0 auto', overflow: 'visible' }}>
        <div style={{
          width: 794,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          /* height auto — let content grow, don't clip */
        }}>
          <div id="resume-print" className={`resume tpl-${tpl}`}>

            {/* ══ HEADER ══ */}
            <header className="rh">
              <h1 className="rh-name">{name}</h1>
              {personal.title && <p className="rh-title">{personal.title}</p>}
              <div className="rh-contacts">
                {personal.email    && <CI href={`mailto:${personal.email}`}    icon="email">{personal.email}</CI>}
                {personal.phone    && <CI icon="phone">{personal.phone}</CI>}
                {personal.location && <CI icon="loc">{personal.location}</CI>}
                {personal.linkedin && <CI href={http(personal.linkedin)} icon="li">{strip(personal.linkedin)}</CI>}
                {personal.website  && <CI href={http(personal.website)}  icon="web">{strip(personal.website)}</CI>}
              </div>
            </header>

            {/* ══ BODY ══ */}
            <div className="rb">

              {/* Summary */}
              {personal.summary && (
                <Sec title="Professional Summary" tpl={tpl}>
                  <p className="r-summary">{personal.summary}</p>
                </Sec>
              )}

              {/* Education */}
              {hasEdu && (
                <Sec title="Education" tpl={tpl}>
                  {education.map(e => (e.degree || e.institution) ? (
                    <div key={e.id} className="r-entry">
                      <div className="r-row">
                        <div className="r-left">
                          <span className="r-etitle">{e.degree === 'Other / Custom' ? '' : e.degree}</span>
                          <span className="r-esub">{[e.institution, e.location].filter(Boolean).join(', ')}</span>
                        </div>
                        <div className="r-right-col">
                          {e.year  && <span className="r-date accent">{e.year}</span>}
                          {e.grade && <span className="r-grade">{e.grade}</span>}
                        </div>
                      </div>
                    </div>
                  ) : null)}
                </Sec>
              )}

              {/* Experience */}
              {hasExp && (
                <Sec title="Work Experience" tpl={tpl}>
                  {experience.map(e => (e.role || e.company) ? (
                    <div key={e.id} className="r-entry">
                      <div className="r-row">
                        <div className="r-left">
                          <span className="r-etitle">{e.role}</span>
                          {e.company && <span className="r-esub">{e.company}</span>}
                        </div>
                        {e.duration && <span className="r-date">{e.duration}</span>}
                      </div>
                      {e.description && <Bul text={e.description} />}
                    </div>
                  ) : null)}
                </Sec>
              )}

              {/* Projects */}
              {hasProj && (
                <Sec title="Projects" tpl={tpl}>
                  {projects.map(p => p.name ? (
                    <div key={p.id} className="r-entry">
                      <div className="r-row">
                        <div className="r-left">
                          <span className="r-etitle r-proj-line">
                            {p.link
                              ? <a className="r-pname" href={http(p.link)} target="_blank" rel="noreferrer">{p.name}</a>
                              : <span className="r-pname-plain">{p.name}</span>
                            }
                            {p.link && (
                              <a className="r-purl-inline" href={http(p.link)} target="_blank" rel="noreferrer">
                                🔗 {strip(p.link)}
                              </a>
                            )}
                          </span>
                          {p.tech && <span className="r-tech-text">{p.tech}</span>}
                        </div>
                        {p.duration && <span className="r-date">{p.duration}</span>}
                      </div>
                      {p.description && <Bul text={p.description} />}
                    </div>
                  ) : null)}
                </Sec>
              )}

              {/* Skills table */}
              {hasSkill && (
                <Sec title="Skills" tpl={tpl}>
                  <table className="r-skill-tbl">
                    <tbody>
                      {skillGroups.filter(g => g.skills.trim()).map(g => (
                        <tr key={g.id}>
                          <td className="r-sk-label">{g.label}</td>
                          <td className="r-sk-val">{g.skills}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Sec>
              )}

              {/* Activities */}
              {hasAct && (
                <Sec title="Extra-Curricular Activities" tpl={tpl}>
                  {activities.filter(a => a.title).map(a => (
                    <div key={a.id} className="r-act">
                      <span className="r-act-dot">•</span>
                      <span><strong>{a.title}</strong>{a.description ? ` — ${a.description}` : ''}</span>
                    </div>
                  ))}
                </Sec>
              )}

              {/* Portfolio */}
              {hasPort && (
                <Sec title="Portfolio" tpl={tpl}>
                  {portfolio.filter(p => p.url).map(p => (
                    <div key={p.id} className="r-act">
                      <span className="r-act-dot">•</span>
                      <span>
                        {p.label && <strong>{p.label}: </strong>}
                        <a className="r-portlink" href={http(p.url)} target="_blank" rel="noreferrer">{strip(p.url)}</a>
                      </span>
                    </div>
                  ))}
                </Sec>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sec({ title, tpl, children }) {
  return (
    <section className="r-sec">
      <div className="r-sec-hd">
        <span className="r-sec-ttl">{title.toUpperCase()}</span>
        <div className="r-sec-ln" />
      </div>
      {children}
    </section>
  )
}

function Bul({ text }) {
  const lines = text.split('\n').map(l => l.replace(/^[•·\-\*▸]\s*/, '').trim()).filter(Boolean)
  if (!lines.length) return null
  return (
    <ul className="r-bul">
      {lines.map((l, i) => <li key={i}>{l}</li>)}
    </ul>
  )
}

function CI({ icon, href, children }) {
  const icons = {
    email: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    phone: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.17 6.17l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    loc:   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    li:    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
    web:   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  }
  const inner = <>{icons[icon]}<span>{children}</span></>
  return href
    ? <a className="r-ci" href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">{inner}</a>
    : <span className="r-ci">{inner}</span>
}
