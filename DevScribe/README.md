# ⚡ DevScribe — by Kanak

> A modern, zero-dependency Technical Publishing Platform & Personal Engineering Journal designed, architected, and built by **Kanak**.

Built using semantic **HTML5**, modern **CSS3** (custom multi-theme engine, CSS variables, glassmorphism, responsive grid), and vanilla **JavaScript (ES6+)** with persistent **LocalStorage** and the native **Web Speech API**.

---

## 🌟 Unique Architectural Features

1. **🎧 Native Speech Synthesizer ("Listen to Story")**:
   - Integrated with the browser's native `window.speechSynthesis` API. Readers can listen to any technical article read aloud with play and stop controls — requiring zero external speech libraries or API keys.
2. **📈 Dynamic Reading Progress Bar**:
   - A neon gradient indicator at the top of the browser that tracks reading depth and viewport scrolling in real-time.
3. **🎨 3-Tier Luxury Editorial Theme Engine**:
   - **🌑 Cosmic Obsidian** (Deep dark mode with neon emerald accents)
   - **📜 Warm Parchment** (Editorial book & paper aesthetic)
   - **🌌 Cyber Aurora** (Deep sapphire navy with neon indigo glow)
   - Complete with dynamic theme persistence in `localStorage`.
4. **🔍 Accessibility Font Size Engine (`A-` / `A+`)**:
   - Readers can adjust base font sizes dynamically between 14px and 20px on the fly.
5. **⚡ Multi-Reaction Matrix**:
   - Expressive developer reactions: 🔥 Fire (Mind-blown), 💡 Insightful, 🚀 Shipped, and ☕ Relatable with real-time animated counters.
6. **📋 Interactive Code Blocks with 1-Click Copy**:
   - Formatted technical code snippets with copy-to-clipboard functionality and animated feedback.
7. **✍️ Split-Screen Markdown Authoring Studio**:
   - Write in markdown with live side-by-side preview, formatting toolbar, dynamic tag chips, cover image previews, word counter, and estimated audio reading duration.

---

## 👩‍💻 About the Author: Kanak

- **Role**: Full Stack Software Engineer & Technical Writer
- **Handle**: `@kanak_codes`
- **GitHub**: [github.com/kanakpml25-ctrl](https://github.com/kanakpml25-ctrl)
- **Focus Areas**: Scalable distributed systems, zero-dependency JavaScript internals, and modern CSS architecture.

---

## 📁 Project Directory Structure

```
DevScribe/
├── assets/
│   └── kanak.jpg           # 👤 Kanak's official profile photograph
├── css/
│   ├── style.css           # Global design system, 3-theme engine, progress bar, audio UI, toasts
│   ├── home.css            # Hero spotlight, reaction matrix, category filter chips, cards
│   ├── auth.css            # Author portal layout, password strength meter, glass cards
│   ├── dashboard.css       # Analytics metric cards, stories table, action clusters
│   └── editor.css          # Split-screen editor, toolbar, tag chip manager, preview pane
├── js/
│   ├── app.js              # Author Kanak profile, seed stories, speech synthesizer, theme engine
│   ├── home.js             # Live search, reaction counters, reader modal & comments
│   ├── auth.js             # Form validation, session persistence, demo autofill
│   ├── dashboard.js        # Metrics calculation, tab filtering, delete confirmation modal
│   └── editor.js           # Markdown actions, tag chips, word counter, draft/publish logic
├── docs/
│   ├── HTML_CSS_JS_GUIDE.md# 📖 Comprehensive learning guide to HTML5, CSS3, and JavaScript
│   └── DEV_ENVIRONMENT.md  # 🛠️ Local development environment setup guide
├── index.html              # 🏠 Home Page (Author Spotlight with Kanak's photo, reactions, audio reader)
├── login.html              # 🔐 Author Portal Login (Kanak's credentials & quote banner)
├── register.html           # 📝 Community Registration (4-stage dynamic password meter)
├── dashboard.html          # 📊 Author Command Center (Kanak's metrics, story management, delete modal)
├── create-blog.html        # ✍️ Studio Editor (Markdown toolbar, split preview, dynamic tag chips)
├── DevScribe.zip           # 📦 Complete submission zip package ready for upload
├── serve.ps1               # ⚡ Zero-dependency local PowerShell web server (.NET HttpListener)
├── start.bat               # 🚀 1-Click launcher to run local server and open browser
└── README.md               # 📌 This documentation
```

---

## 🚀 How to Run Locally

### Method 1: 1-Click Launcher (Recommended)
Double-click `start.bat` or run in PowerShell:
```powershell
.\serve.ps1
```
This automatically starts an instant web server at `http://localhost:8080/` and opens your default browser.

### Method 2: Direct Browser Preview
Double-click `index.html` to open directly in Microsoft Edge, Google Chrome, or any modern web browser.

---

## 🔑 Demo Author Credentials

To access the Author Command Center on the Login page:
- **Email**: `kanak@devscribe.io`
- **Password**: `password123`
*(Or click the **"⚡ Click to Fill Kanak's Author Credentials"** button on the login screen).*

---

## 📜 License & Attribution
Designed, developed, and maintained by **Kanak**. Built for the CodeX engineering challenge. All rights reserved &copy; 2026.
