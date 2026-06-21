# ⚡ ResumeForge

**A free, AI-assisted resume builder with live preview, real-time resume scoring, and one-click PDF export.**

ResumeForge lets anyone — engineering students, commerce graduates, designers, medical students — build a polished, ATS-friendly resume in minutes. No sign-up, no paywall, no watermarks, and no data ever leaves your browser unless you explicitly ask it to.

🔗 **Live demo:** [your-deployed-url.vercel.app](#)
📦 **Repo:** [github.com/Riddhima277/Resume-Builder](#)

---

## ✨ Features

### Core builder
- **Live preview** — every field updates the resume instantly as you type
- **4 professional templates** — Modern, Classic, Minimal, and Compact (two-column sidebar layout), each with distinct typography and color treatment
- **Light/Dark resume themes** — toggle the document's own color scheme, independent of the builder UI
- **One-click PDF export** — pixel-accurate A4 PDF generated client-side, with real clickable links (email, LinkedIn, GitHub, project URLs) re-injected as proper PDF link annotations, not dead pixels
- **Built for every field of study** — skill-section presets for Engineering, Commerce, Science, Arts, Management, Medical, and Design, not just tech
- **40+ option degree picker** spanning undergraduate, postgraduate, and school-level qualifications
- **Optional sections** — Work Experience is opt-in, so students with no job history aren't forced to leave a section half-filled
- **Smart validation** — required fields are checked before download, with inline error messages and a jump-to-tab on failure

### Real-time resume intelligence (no fake AI claims — transparent, explainable logic)
- **Resume Strength meter** — a live header score computed from structure completeness, quantified-impact density, and action-verb strength, updating as you type
- **Bullet Coach** — inline, per-line feedback under every Experience/Project description: flags weak openers ("Worked on", "Helped with"), missing metrics, filler phrases, and bullets that are too short to say anything real
- **Resume Checker modal** — paste a job description for a weighted keyword match (terms in your Title/Skills count more than ones buried in a paragraph), plus an 8-point structural checklist, all shown with full transparency — no black-box score

### AI-assisted writing
- **✨ AI Rewrite** — on the Summary and every bullet field, get an LLM-generated rewrite (via Groq's free, ultra-fast Llama 3.3 70B) that tightens wording and strengthens verbs *without inventing facts you didn't provide*. Every suggestion is shown as an explicit accept/discard choice — nothing is silently overwritten
- Powered by a Vercel serverless function that proxies the request, so the API key is **never exposed in client-side code**

### Workflow features
- **Auto-save** — every edit is debounced and saved to `localStorage`; reload the page and your data is still there
- **Import from pasted text** — paste an existing resume (LinkedIn export, old Word doc, anything) and a heuristic parser auto-fills matching fields for you to review
- **Plain text export** — one click downloads an ATS-friendly `.txt` version
- **Shareable link** — generates a URL with your resume data encoded directly in it (no backend, no database) so anyone can view a read-only copy
- **Cover letter generator** — a matching-styled cover letter you can write and export alongside your resume

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| PDF generation | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) + custom jsPDF link-annotation injection |
| AI rewriting | [Groq API](https://groq.com) (Llama 3.3 70B), proxied through a Vercel serverless function |
| Persistence | Browser `localStorage` (auto-save) |
| Styling | Plain CSS (no framework dependency) |
| Hosting | Vercel (free Hobby tier, including serverless functions) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- (Optional, for AI rewrite locally) A free [Groq API key](https://console.groq.com/keys) and the [Vercel CLI](https://vercel.com/docs/cli)

### Installation
```bash
git clone https://github.com/Riddhima277/Resume-Builder.git
cd Resume-Builder
npm install
```

### Run locally
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

> **Note:** `npm run dev` runs the frontend only. The AI Rewrite feature depends on the `/api/ai-rewrite` serverless function, which requires running via `vercel dev` (see below) or testing on the deployed Vercel site.

### Run locally with AI Rewrite enabled
```bash
npm install -g vercel
cp .env.example .env   # then paste your Groq key into .env
vercel dev
```

### Build for production
```bash
npm run build
```
Output is generated in the `dist/` folder.

---

## ☁️ Deployment

This project is pre-configured for **Vercel**:

1. Push the repo to GitHub
2. Import it on [vercel.com](https://vercel.com) — Vite is auto-detected
3. In **Project Settings → Environment Variables**, add `GROQ_API_KEY` with a free key from [console.groq.com](https://console.groq.com) (only needed for the AI Rewrite feature — everything else works without it)
4. Click **Deploy**

The included `vercel.json` sets the correct build command and output directory automatically. The `api/ai-rewrite.js` file is auto-detected and deployed as a serverless function — no extra configuration needed.

---

## 📁 Project Structure

```
resume-builder/
├── api/
│   └── ai-rewrite.js       # Serverless function — proxies AI rewrite requests to Groq
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example             # Template for local AI-rewrite testing (no real key)
└── src/
    ├── main.jsx              # App entry point
    ├── index.css             # Global styles & CSS variables
    ├── App.jsx                # Form UI, state, validation, AI rewrite UI
    ├── App.css                # Form panel + modal styling
    ├── ResumePreview.jsx      # Resume rendering logic (all 4 templates)
    ├── ResumePreview.css      # Resume document styling
    └── lib/
        ├── aiAssist.js        # Client-side caller for /api/ai-rewrite
        ├── atsChecker.js      # Multi-factor resume scoring engine
        ├── bulletCoach.js     # Per-line bullet point analysis
        ├── resumeParser.js    # Heuristic text-to-form-data import
        ├── exportText.js      # Plain text (.txt) export
        └── shareLink.js       # URL-encoded shareable link generation
```

---

## 🔒 Privacy & Security

- All resume data lives in your browser (`localStorage`) until you explicitly export, share, or send it to the AI rewrite endpoint
- The AI Rewrite feature sends only the specific field you click "rewrite" on — never your full resume — to Groq via a server-side proxy
- The Groq API key is stored as a Vercel environment variable and is never present in any client-side code or the GitHub repo

---

## 👩‍💻 Author

**Riddhima Gupta**
📧 [guptariddhima75@gmail.com](mailto:guptariddhima75@gmail.com)
🔗 [GitHub](https://github.com/Riddhima277) · [LinkedIn](https://www.linkedin.com/in/riddhima-gupta-89527438b/)

---

<p align="center">
  <a href="https://digitalheroesco.com">
    <strong>✦ Built for Digital Heroes</strong>
  </a>
</p>