import { useState } from 'react'
import './App.css'
import ResumePreview from './ResumePreview.jsx'

const DEGREE_OPTIONS = [
  '',
  // Undergraduate
  'B.Tech / B.E. — Computer Science & Engineering',
  'B.Tech / B.E. — Electronics & Communication',
  'B.Tech / B.E. — Mechanical Engineering',
  'B.Tech / B.E. — Civil Engineering',
  'B.Tech / B.E. — Electrical Engineering',
  'B.Tech / B.E. — Information Technology',
  'B.Sc — Physics',
  'B.Sc — Chemistry',
  'B.Sc — Mathematics',
  'B.Sc — Biology / Biotechnology',
  'B.Sc — Computer Science',
  'B.Sc — Nursing',
  'B.Com — General',
  'B.Com — Hons.',
  'BBA — Business Administration',
  'BCA — Computer Applications',
  'BA — English Literature',
  'BA — Economics',
  'BA — Psychology',
  'BA — History',
  'BA — Political Science',
  'BA — Sociology',
  'B.Arch — Architecture',
  'MBBS',
  'BDS — Dental Surgery',
  'B.Pharm — Pharmacy',
  'LLB — Law',
  'B.Ed — Education',
  'B.Des — Design',
  'B.FA — Fine Arts',
  'BHM — Hotel Management',
  // Postgraduate
  'M.Tech — Computer Science',
  'M.Tech — Electronics',
  'M.Sc — Physics / Chemistry / Math',
  'M.Sc — Computer Science',
  'MBA — Business Administration',
  'MCA — Computer Applications',
  'MA — English / Economics / Psychology',
  'LLM — Law',
  'MD / MS — Medicine',
  'M.Pharm — Pharmacy',
  // School
  'Class XII — Science (PCM)',
  'Class XII — Science (PCB)',
  'Class XII — Commerce',
  'Class XII — Arts / Humanities',
  'Class X — CBSE / ICSE / State Board',
  'Other / Custom',
]

const SKILL_PRESETS = {
  engineering: [
    { label: 'Programming Languages', skills: '' },
    { label: 'Frameworks & Libraries', skills: '' },
    { label: 'Tools & Software', skills: '' },
    { label: 'Concepts', skills: '' },
  ],
  commerce: [
    { label: 'Accounting & Finance', skills: '' },
    { label: 'Software & Tools', skills: '' },
    { label: 'Core Competencies', skills: '' },
  ],
  science: [
    { label: 'Laboratory Skills', skills: '' },
    { label: 'Software & Tools', skills: '' },
    { label: 'Research Methods', skills: '' },
  ],
  arts: [
    { label: 'Core Skills', skills: '' },
    { label: 'Languages', skills: '' },
    { label: 'Tools & Platforms', skills: '' },
  ],
  management: [
    { label: 'Management Skills', skills: '' },
    { label: 'Software & Tools', skills: '' },
    { label: 'Core Competencies', skills: '' },
  ],
  medical: [
    { label: 'Clinical Skills', skills: '' },
    { label: 'Medical Knowledge', skills: '' },
    { label: 'Tools & Equipment', skills: '' },
  ],
  design: [
    { label: 'Design Tools', skills: '' },
    { label: 'Design Skills', skills: '' },
    { label: 'Other Tools', skills: '' },
  ],
  custom: [
    { label: 'Skill Category 1', skills: '' },
    { label: 'Skill Category 2', skills: '' },
    { label: 'Skill Category 3', skills: '' },
  ],
}

const SKILL_EXAMPLES = {
  engineering: {
    'Programming Languages': 'Python, JavaScript, Java, C++',
    'Frameworks & Libraries': 'React, Node.js, Express, Django',
    'Tools & Software': 'Git, VS Code, Docker, Postman',
    'Concepts': 'REST APIs, OOP, Data Structures, Agile',
  },
  commerce: {
    'Accounting & Finance': 'Financial Reporting, Budgeting, Taxation, Auditing',
    'Software & Tools': 'Tally ERP, MS Excel, QuickBooks, SAP',
    'Core Competencies': 'Financial Analysis, Cost Accounting, GST Filing',
  },
  science: {
    'Laboratory Skills': 'Titration, Microscopy, PCR, Spectroscopy',
    'Software & Tools': 'MATLAB, SPSS, Origin, MS Excel',
    'Research Methods': 'Data Analysis, Literature Review, Report Writing',
  },
  arts: {
    'Core Skills': 'Research, Critical Thinking, Content Writing, Communication',
    'Languages': 'English, Hindi, Punjabi',
    'Tools & Platforms': 'MS Office, Google Workspace, Canva',
  },
  management: {
    'Management Skills': 'Team Leadership, Project Management, Strategic Planning',
    'Software & Tools': 'MS Office, Excel, Salesforce, Tableau',
    'Core Competencies': 'Marketing, HR Management, Operations, CRM',
  },
  medical: {
    'Clinical Skills': 'Patient Assessment, Diagnosis, First Aid, CPR',
    'Medical Knowledge': 'Anatomy, Pharmacology, Pathology',
    'Tools & Equipment': 'ECG, Stethoscope, Electronic Health Records',
  },
  design: {
    'Design Tools': 'Figma, Adobe XD, Photoshop, Illustrator',
    'Design Skills': 'UI/UX Design, Typography, Color Theory, Wireframing',
    'Other Tools': 'Canva, InVision, Zeplin',
  },
}

const INITIAL = {
  personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
  education: [{ id: 1, degree: '', institution: '', location: '', year: '', grade: '' }],
  experience: [],
  projects: [{ id: 1, name: '', link: '', tech: '', duration: '', description: '' }],
  skillGroups: [
    { id: 1, label: 'Skill Category 1', skills: '' },
    { id: 2, label: 'Skill Category 2', skills: '' },
    { id: 3, label: 'Skill Category 3', skills: '' },
  ],
  activities: [{ id: 1, title: '', description: '' }],
  portfolio: [{ id: 1, label: '', url: '' }],
}

const TEMPLATES = [
  { key: 'Modern' }, { key: 'Classic' }, { key: 'Minimal' },
]

function calcPct(data) {
  let f = 0
  if (data.personal.name.trim()) f++
  if (data.personal.email.trim()) f++
  if (data.personal.summary.trim()) f++
  if (data.education.some(e => e.degree.trim() || e.institution.trim())) f++
  if (data.projects.some(p => p.name.trim())) f++
  if (data.skillGroups.some(g => g.skills.trim())) f++
  if (data.portfolio.some(p => p.url.trim())) f++
  return Math.round((f / 7) * 100)
}

function validate(data) {
  const errs = {}
  if (!data.personal.name.trim()) errs['personal.name'] = 'Full name is required'
  if (!data.personal.email.trim()) errs['personal.email'] = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email)) errs['personal.email'] = 'Enter a valid email address'
  if (data.personal.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(data.personal.phone)) errs['personal.phone'] = 'Enter a valid phone number'
  if (!data.education.some(e => e.degree.trim() || e.institution.trim())) errs['education'] = 'Add at least one education entry'
  return errs
}

export default function App() {
  const [data, setData] = useState(INITIAL)
  const [template, setTemplate] = useState('Modern')
  const [tab, setTab] = useState('personal')
  const [downloading, setDownloading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState('')

  const sp = (f, v) => {
    setData(d => ({ ...d, personal: { ...d.personal, [f]: v } }))
    if (errors[`personal.${f}`]) setErrors(e => { const n = { ...e }; delete n[`personal.${f}`]; return n })
  }

  const arrSet = (key, id, field, val) => setData(d => ({
    ...d, [key]: d[key].map(e => e.id === id ? { ...e, [field]: val } : e)
  }))
  const arrAdd = (key, tpl) => setData(d => ({ ...d, [key]: [...d[key], { ...tpl, id: Date.now() }] }))
  const arrDel = (key, id) => setData(d => ({ ...d, [key]: d[key].filter(e => e.id !== id) }))

  const applyPreset = (preset) => {
    setSelectedPreset(preset)
    const groups = (SKILL_PRESETS[preset] || SKILL_PRESETS.custom).map((g, i) => ({ ...g, id: Date.now() + i }))
    setData(d => ({ ...d, skillGroups: groups }))
  }

  const handleDownload = async () => {
    const errs = validate(data)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      if (errs['personal.name'] || errs['personal.email'] || errs['personal.phone']) setTab('personal')
      else if (errs['education']) setTab('education')
      return
    }
    setDownloading(true)
    try {
      const h = (await import('html2pdf.js')).default
      const el = document.getElementById('resume-print')
      // Temporarily expand for full capture
      const origStyle = el.style.cssText
      el.style.height = 'auto'
      el.style.minHeight = 'unset'
      el.style.overflow = 'visible'
      await h().set({
        margin: 0,
        filename: `${data.personal.name.replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.99 },
        html2canvas: { scale: 3, useCORS: true, letterRendering: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(el).save()
      el.style.cssText = origStyle
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (e) {
      alert('Download failed. Please try again.')
    }
    setDownloading(false)
  }

  const complete = calcPct(data)
  const errCount = Object.keys(errors).length
  const hasPersonalErr = errors['personal.name'] || errors['personal.email'] || errors['personal.phone']
  const hasEduErr = errors['education']

  const tabs = [
    { k: 'personal',   label: 'Personal',   icon: '👤' },
    { k: 'education',  label: 'Education',  icon: '🎓' },
    { k: 'experience', label: 'Experience', icon: '💼', optional: true },
    { k: 'projects',   label: 'Projects',   icon: '🚀' },
    { k: 'skills',     label: 'Skills',     icon: '⚡' },
    { k: 'extras',     label: 'Extras',     icon: '🏆' },
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo"><span>⚡</span><span className="logo-text">ResumeForge</span></div>
          <div className="header-right">
            <div className="template-pills">
              {TEMPLATES.map(t => (
                <button key={t.key} className={`pill ${template === t.key ? 'active' : ''}`} onClick={() => setTemplate(t.key)}>{t.key}</button>
              ))}
            </div>
            <button className="btn-dl" onClick={handleDownload} disabled={downloading}>
              {downloading ? <><span className="spin">↻</span> Generating…</> : <>↓ Download PDF</>}
            </button>
          </div>
        </div>
      </header>

      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: complete + '%' }} />
        <span className="progress-txt">{complete}% complete</span>
      </div>

      {errCount > 0 && (
        <div className="err-banner">⚠️ Please fix {errCount} error{errCount > 1 ? 's' : ''} before downloading</div>
      )}
      {showSuccess && <div className="success-toast">✅ Resume downloaded!</div>}

      <main className="main">
        <section className="form-panel">
          <nav className="tabs">
            {tabs.map(t => (
              <button key={t.k}
                className={`tab ${tab === t.k ? 'active' : ''} ${(t.k === 'personal' && hasPersonalErr) || (t.k === 'education' && hasEduErr) ? 'tab-err' : ''}`}
                onClick={() => setTab(t.k)}>
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {t.optional && <span className="tab-opt">opt</span>}
                {((t.k === 'personal' && hasPersonalErr) || (t.k === 'education' && hasEduErr)) && <span className="tab-err-dot">!</span>}
              </button>
            ))}
          </nav>

          <div className="form-body">

            {/* ── PERSONAL ── */}
            {tab === 'personal' && (
              <div className="sf">
                <div className="si">
                  <h2 className="st">Personal Info</h2>
                  <p className="sd">Appears at the top of your resume.</p>
                </div>
                <div className="g2">
                  <F label="Full Name" required error={errors['personal.name']}>
                    <input value={data.personal.name} onChange={e => sp('name', e.target.value)} placeholder="Your full name" className={errors['personal.name'] ? 'inp-err' : ''} />
                  </F>
                  <F label="Professional Title" hint="Shown right under your name">
                    <input value={data.personal.title} onChange={e => sp('title', e.target.value)} placeholder="e.g. B.Tech CSE Student | Web Developer" />
                  </F>
                  <F label="Email" required error={errors['personal.email']}>
                    <input type="email" value={data.personal.email} onChange={e => sp('email', e.target.value)} placeholder="Your email address" className={errors['personal.email'] ? 'inp-err' : ''} />
                  </F>
                  <F label="Phone" error={errors['personal.phone']}>
                    <input value={data.personal.phone} onChange={e => sp('phone', e.target.value)} placeholder="Your phone number" className={errors['personal.phone'] ? 'inp-err' : ''} />
                  </F>
                  <F label="Location">
                    <input value={data.personal.location} onChange={e => sp('location', e.target.value)} placeholder="City, State, Country" />
                  </F>
                  <F label="LinkedIn Profile URL">
                    <input value={data.personal.linkedin} onChange={e => sp('linkedin', e.target.value)} placeholder="linkedin.com/in/your-name" />
                  </F>
                  <F label="GitHub / Portfolio / Website">
                    <input value={data.personal.website} onChange={e => sp('website', e.target.value)} placeholder="github.com/username or yoursite.com" />
                  </F>
                </div>
                <F label="Professional Summary" hint="2–4 sentences about who you are, what you study, and what you bring.">
                  <textarea rows={5} value={data.personal.summary} onChange={e => sp('summary', e.target.value)}
                    placeholder="Briefly describe your background, field of study, key strengths, and what kind of opportunity you're looking for." />
                </F>
                <Tip>💡 Your title line is the first thing recruiters read — keep it clear: <em>"B.Com Hons. Student | Finance & Accounting"</em> or <em>"Mechanical Engineering Graduate | CAD & Design"</em></Tip>
              </div>
            )}

            {/* ── EDUCATION ── */}
            {tab === 'education' && (
              <div className="sf">
                <div className="si">
                  <div className="shr">
                    <div>
                      <h2 className="st">Education</h2>
                      <p className="sd">Add your degrees, diplomas, or school certificates. Most recent first.</p>
                    </div>
                    <button className="btn-add" onClick={() => arrAdd('education', { degree: '', institution: '', location: '', year: '', grade: '' })}>+ Add</button>
                  </div>
                  {errors['education'] && <p className="err-msg">⚠️ {errors['education']}</p>}
                </div>
                {data.education.map((e, i) => (
                  <Card key={e.id} label={`Qualification ${i + 1}`} onRemove={data.education.length > 1 ? () => arrDel('education', e.id) : null}>
                    <F label="Degree / Course / Qualification">
                      <select
                        value={e.degree}
                        onChange={v => arrSet('education', e.id, 'degree', v.target.value)}
                        className="select-input"
                      >
                        {DEGREE_OPTIONS.map(d => (
                          <option key={d} value={d}>{d || '— Select your degree —'}</option>
                        ))}
                      </select>
                      {e.degree === 'Other / Custom' && (
                        <input
                          style={{ marginTop: 8 }}
                          placeholder="Type your degree or course name"
                          onChange={v => arrSet('education', e.id, 'degree', v.target.value === '' ? 'Other / Custom' : v.target.value)}
                        />
                      )}
                    </F>
                    <div className="g2">
                      <F label="University / School / Institution">
                        <input value={e.institution} onChange={v => arrSet('education', e.id, 'institution', v.target.value)} placeholder="Name of your institution" />
                      </F>
                      <F label="City / Location">
                        <input value={e.location} onChange={v => arrSet('education', e.id, 'location', v.target.value)} placeholder="City where you studied" />
                      </F>
                      <F label="Year">
                        <input value={e.year} onChange={v => arrSet('education', e.id, 'year', v.target.value)} placeholder="e.g. 2021 — 2025 or 2023" />
                      </F>
                      <F label="Grade / CGPA / Percentage">
                        <input value={e.grade} onChange={v => arrSet('education', e.id, 'grade', v.target.value)} placeholder="e.g. 8.5 CGPA or 82%" />
                      </F>
                    </div>
                  </Card>
                ))}
                <Tip>💡 Add all qualifications — degree, 12th, and 10th if relevant. Recruiters often check your complete academic history.</Tip>
              </div>
            )}

            {/* ── EXPERIENCE (OPTIONAL) ── */}
            {tab === 'experience' && (
              <div className="sf">
                <div className="si">
                  <div className="shr">
                    <div>
                      <h2 className="st">Work Experience <span className="opt-badge">Optional</span></h2>
                      <p className="sd">Internships, part-time roles, volunteering. Leave empty to hide this section.</p>
                    </div>
                    <button className="btn-add" onClick={() => arrAdd('experience', { role: '', company: '', duration: '', description: '' })}>+ Add</button>
                  </div>
                </div>
                {data.experience.length === 0 && (
                  <div className="empty-state">
                    <span className="empty-icon">💼</span>
                    <p>No experience added yet.</p>
                    <p className="empty-sub">This section is <strong>optional</strong> — leave it empty and it won't appear on your resume.</p>
                    <button className="btn-add-lg" onClick={() => arrAdd('experience', { role: '', company: '', duration: '', description: '' })}>+ Add an Entry</button>
                  </div>
                )}
                {data.experience.map((e, i) => (
                  <Card key={e.id} label={`Entry ${i + 1}`} onRemove={() => arrDel('experience', e.id)}>
                    <div className="g2">
                      <F label="Job Title / Role">
                        <input value={e.role} onChange={v => arrSet('experience', e.id, 'role', v.target.value)} placeholder="e.g. Marketing Intern" />
                      </F>
                      <F label="Organisation / Company">
                        <input value={e.company} onChange={v => arrSet('experience', e.id, 'company', v.target.value)} placeholder="e.g. ABC Pvt. Ltd." />
                      </F>
                      <F label="Duration">
                        <input value={e.duration} onChange={v => arrSet('experience', e.id, 'duration', v.target.value)} placeholder="e.g. May 2024 — Jul 2024" />
                      </F>
                    </div>
                    <F label="Key responsibilities / achievements" hint="One per line. Use action verbs: Managed, Analysed, Created, Assisted…">
                      <textarea rows={4} value={e.description}
                        onChange={v => arrSet('experience', e.id, 'description', v.target.value)}
                        placeholder={"Managed social media accounts and grew followers by 30%\nAssisted in preparing financial reports and audit documents\nConducted market research for product launch campaign"} />
                    </F>
                  </Card>
                ))}
                <Tip>💡 No formal job yet? Add <strong>internships, college fests, NGO volunteering, freelance work</strong>, or club responsibilities.</Tip>
              </div>
            )}

            {/* ── PROJECTS ── */}
            {tab === 'projects' && (
              <div className="sf">
                <div className="si">
                  <div className="shr">
                    <div>
                      <h2 className="st">Projects / Work Samples</h2>
                      <p className="sd">Academic projects, personal work, case studies, or any hands-on work.</p>
                    </div>
                    <button className="btn-add" onClick={() => arrAdd('projects', { name: '', link: '', tech: '', duration: '', description: '' })}>+ Add</button>
                  </div>
                </div>
                {data.projects.map((p, i) => (
                  <Card key={p.id} label={`Project ${i + 1}`} onRemove={data.projects.length > 1 ? () => arrDel('projects', p.id) : null}>
                    <div className="g2">
                      <F label="Project / Work Title">
                        <input value={p.name} onChange={v => arrSet('projects', p.id, 'name', v.target.value)} placeholder="Name of your project or work" />
                      </F>
                      <F label="Link (optional)">
                        <input value={p.link} onChange={v => arrSet('projects', p.id, 'link', v.target.value)} placeholder="Website, GitHub, or Drive link" />
                      </F>
                      <F label="Tools / Technologies / Methods used">
                        <input value={p.tech} onChange={v => arrSet('projects', p.id, 'tech', v.target.value)} placeholder="e.g. MS Excel | SPSS | Tally | React | Figma" />
                      </F>
                      <F label="Duration (optional)">
                        <input value={p.duration} onChange={v => arrSet('projects', p.id, 'duration', v.target.value)} placeholder="e.g. Jan 2025 — Mar 2025" />
                      </F>
                    </div>
                    <F label="What you did / key outcomes" hint="One point per line. Be specific — mention numbers, results, or impact where possible.">
                      <textarea rows={4} value={p.description}
                        onChange={v => arrSet('projects', p.id, 'description', v.target.value)}
                        placeholder={"Describe what the project was about and what you achieved\nMention tools used, problems solved, or results obtained\ne.g. Analysed survey data of 500+ respondents using SPSS"} />
                    </F>
                  </Card>
                ))}
                <Tip>💡 Projects don't have to be technical! Add <strong>case studies, research papers, design portfolios, business plans, lab experiments</strong>, or event organisation work.</Tip>
              </div>
            )}

            {/* ── SKILLS ── */}
            {tab === 'skills' && (
              <div className="sf">
                <div className="si">
                  <h2 className="st">Skills</h2>
                  <p className="sd">Organise your skills by category. Choose a preset or customise your own.</p>
                </div>

                {/* Preset selector */}
                <div className="preset-box">
                  <p className="preset-label">Quick setup — pick your field:</p>
                  <div className="preset-pills">
                    {[
                      { key: 'engineering', label: '💻 Engineering / Tech' },
                      { key: 'commerce',    label: '📊 Commerce / Finance' },
                      { key: 'science',     label: '🔬 Science / Research' },
                      { key: 'arts',        label: '📝 Arts / Humanities' },
                      { key: 'management',  label: '🏢 Management / MBA' },
                      { key: 'medical',     label: '🏥 Medical / Health' },
                      { key: 'design',      label: '🎨 Design / Creative' },
                      { key: 'custom',      label: '✏️ Start from Scratch' },
                    ].map(p => (
                      <button key={p.key}
                        className={`preset-pill ${selectedPreset === p.key ? 'active' : ''}`}
                        onClick={() => applyPreset(p.key)}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="shr" style={{ marginTop: 4 }}>
                  <span className="sub-label" style={{ fontSize: 13 }}>Your skill rows</span>
                  <button className="btn-add" onClick={() => arrAdd('skillGroups', { label: '', skills: '' })}>+ Add Row</button>
                </div>

                {data.skillGroups.map((g, i) => (
                  <Card key={g.id} label={`Row ${i + 1}`} onRemove={data.skillGroups.length > 1 ? () => arrDel('skillGroups', g.id) : null}>
                    <div className="g2">
                      <F label="Category / Label">
                        <input value={g.label} onChange={v => arrSet('skillGroups', g.id, 'label', v.target.value)}
                          placeholder="e.g. Core Skills, Software Tools…" />
                      </F>
                      <F label="Your skills (comma separated)">
                        <input value={g.skills} onChange={v => arrSet('skillGroups', g.id, 'skills', v.target.value)}
                          placeholder={
                            selectedPreset && SKILL_EXAMPLES[selectedPreset]?.[g.label]
                              ? SKILL_EXAMPLES[selectedPreset][g.label]
                              : 'List your skills here, separated by commas'
                          } />
                      </F>
                    </div>
                  </Card>
                ))}
                <Tip>💡 Include both <strong>hard skills</strong> (tools, software, techniques) and <strong>soft skills</strong> (leadership, communication, teamwork) that match the job you want.</Tip>
              </div>
            )}

            {/* ── EXTRAS ── */}
            {tab === 'extras' && (
              <div className="sf">
                <div className="si">
                  <h2 className="st">Extras</h2>
                  <p className="sd">Achievements, activities, certifications, and portfolio links.</p>
                </div>

                <div className="subsection">
                  <div className="shr">
                    <span className="sub-label">🏆 Activities / Achievements / Certifications</span>
                    <button className="btn-add-sm" onClick={() => arrAdd('activities', { title: '', description: '' })}>+ Add</button>
                  </div>
                  {data.activities.map((a, i) => (
                    <Card key={a.id} label={`Entry ${i + 1}`} onRemove={data.activities.length > 1 ? () => arrDel('activities', a.id) : null}>
                      <F label="Title / Role / Certificate name">
                        <input value={a.title} onChange={v => arrSet('activities', a.id, 'title', v.target.value)} placeholder="e.g. National Level Debate Winner" />
                      </F>
                      <F label="Brief description (optional)">
                        <input value={a.description} onChange={v => arrSet('activities', a.id, 'description', v.target.value)} placeholder="e.g. Represented college at inter-university competition" />
                      </F>
                    </Card>
                  ))}
                </div>

                <div className="subsection">
                  <div className="shr">
                    <span className="sub-label">🔗 Portfolio / Links</span>
                    <button className="btn-add-sm" onClick={() => arrAdd('portfolio', { label: '', url: '' })}>+ Add</button>
                  </div>
                  {data.portfolio.map((p, i) => (
                    <Card key={p.id} label={`Link ${i + 1}`} onRemove={data.portfolio.length > 1 ? () => arrDel('portfolio', p.id) : null}>
                      <div className="g2">
                        <F label="Label"><input value={p.label} onChange={v => arrSet('portfolio', p.id, 'label', v.target.value)} placeholder="e.g. GitHub, Behance, Kaggle…" /></F>
                        <F label="URL"><input value={p.url} onChange={v => arrSet('portfolio', p.id, 'url', v.target.value)} placeholder="Full link to your profile or work" /></F>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        <section className="preview-panel">
          <div className="preview-header">
            <div className="ph-left">
              <span className="preview-label">Live Preview</span>
              <span className="pdot" />
              <span className="plive">Updates as you type</span>
            </div>
            <span className="pbadge">A4 · PDF Ready</span>
          </div>
          <div className="preview-wrapper">
            <ResumePreview data={data} template={template} />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="fi">
          <div className="fc">
            <span>Built by <strong>Riddhima Gupta</strong></span>
            <a href="mailto:guptariddhima75@gmail.com">guptariddhima75@gmail.com</a>
          </div>
          <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="btn-dh">✦ Built for Digital Heroes</a>
        </div>
      </footer>
    </div>
  )
}

function F({ label, required, hint, error, children }) {
  return (
    <div className="field">
      <label>{label}{required && <span className="req"> *</span>}</label>
      {hint && <p className="fh">{hint}</p>}
      {children}
      {error && <p className="err-msg">⚠️ {error}</p>}
    </div>
  )
}
function Card({ label, onRemove, children }) {
  return (
    <div className="card-entry">
      <div className="ce-header">
        <span className="entry-badge">{label}</span>
        {onRemove && <button className="btn-remove" onClick={onRemove}>✕ Remove</button>}
      </div>
      {children}
    </div>
  )
}
function Tip({ children }) {
  return <div className="tip-box">{children}</div>
}
