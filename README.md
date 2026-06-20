# ⚡ ResumeForge

**A free, professional resume builder with live preview and one-click PDF export.**

ResumeForge lets anyone — engineering students, commerce graduates, designers, medical students — build a polished, ATS-friendly resume in minutes. No sign-up, no paywall, no watermarks.

🔗 **Live demo:** [your-deployed-url.vercel.app](#)
📦 **Repo:** [github.com/Riddhima277/Resume-Builder](#)

---

## ✨ Features

- **Live preview** — every field updates the resume instantly as you type, no "refresh to see changes"
- **3 professional templates** — Modern, Classic, and Minimal, each with distinct typography and color treatment
- **One-click PDF export** — pixel-accurate A4 PDF generated client-side, ready to send to recruiters
- **Built for every field of study** — skill-section presets for Engineering, Commerce, Science, Arts, Management, Medical, and Design, not just tech
- **Smart validation** — required fields are checked before download, with inline error messages so nothing gets submitted incomplete
- **Optional sections** — Work Experience is opt-in, so students with no job history aren't forced to leave a section half-filled
- **Comprehensive sections** — Personal Info, Education (with a 40+ option degree picker), Experience, Projects, Skills, Activities, and Portfolio links
- **Fully responsive** — works smoothly on desktop and mobile
- **Clickable links** — email, LinkedIn, GitHub, and project links all stay clickable in the exported PDF

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| PDF generation | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) |
| Styling | Plain CSS (no framework dependency) |
| Hosting | Vercel (free Hobby tier) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

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
3. Click **Deploy** — no environment variables or extra config needed

The included `vercel.json` sets the correct build command and output directory automatically.

---

## 📁 Project Structure

```
resume-builder/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── src/
    ├── main.jsx           # App entry point
    ├── index.css          # Global styles & CSS variables
    ├── App.jsx            # Form UI, state management, validation
    ├── App.css            # Form panel styling
    ├── ResumePreview.jsx  # Resume rendering logic (all 3 templates)
    └── ResumePreview.css  # Resume document styling
```

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