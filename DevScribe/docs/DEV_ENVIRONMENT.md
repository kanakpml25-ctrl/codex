# Local Development Environment Setup Guide

This guide walks you through setting up, inspecting, and running your local development environment for the **TechPulse Blog Application**.

---

## 1. Project Overview & Folder Structure

```
codex-project/
├── index.html              # Home Page (Featured blog, category filters, search, article modal)
├── login.html              # Login Page (Client-side authentication & demo autofill)
├── register.html           # Register Page (Form validation & password strength meter)
├── dashboard.html          # Dashboard Page (User post management, analytics, delete modals)
├── create-blog.html        # Create Blog Page (Markdown editor, live split preview, tags)
├── css/
│   ├── style.css           # Global theme variables, reset, navbar, footer, buttons, toasts
│   ├── home.css            # Home specific styles (Hero, filter chips, blog grid)
│   ├── auth.css            # Auth forms, visual side banner, strength meter
│   ├── dashboard.css       # Metrics cards, post tables, empty states
│   └── editor.css          # Markdown editor, preview pane, tag pills
├── js/
│   ├── app.js              # Global state, LocalStorage database, session auth, theme toggle
│   ├── home.js             # Live search, category filtering, likes, reader modal
│   ├── auth.js             # Login/register validation, session persistence
│   ├── dashboard.js        # Post CRUD operations, user metrics, modal controls
│   └── editor.js           # Markdown parser, live preview, word counter, draft/publish
├── docs/
│   ├── HTML_CSS_JS_GUIDE.md# Educational manual covering HTML, CSS & JS
│   └── DEV_ENVIRONMENT.md  # This local setup guide
├── serve.ps1               # Built-in lightweight local HTTP server (PowerShell)
├── start.bat               # 1-Click launcher to start server & open browser
└── README.md               # Main project documentation
```

---

## 2. Running the Application Locally

You have two simple ways to view and run the application:

### Option A: 1-Click Launcher (Recommended)
Simply double-click `start.bat` in the project folder, or run the following in PowerShell:
```powershell
.\serve.ps1
```
This starts an instant local web server at `http://localhost:8080/` and opens your default browser automatically. It uses PowerShell's built-in `.NET HttpListener`, requiring **no third-party dependencies** (no Node.js or Python required!).

### Option B: Direct Browser Opening
Because all assets, styles, and scripts use standard relative paths:
1. Double-click `index.html` in Windows File Explorer.
2. It will open directly in Microsoft Edge, Google Chrome, or any modern web browser via `file://`.
3. All `localStorage` interactions, searches, theme toggles, and modals will function seamlessly!

---

## 3. Recommended Code Editors & Extensions

For the best developer experience, we recommend **Visual Studio Code**:

1. **Live Server Extension (by Ritwick Dey)**:
   - Provides live reloading when saving HTML/CSS/JS files.
   - Right-click `index.html` > *Open with Live Server*.
2. **Prettier - Code Formatter**:
   - Automatically formats HTML, CSS, and JS code neatly.
3. **Auto Rename Tag**:
   - Automatically renames paired HTML tags.

---

## 4. Using Browser Developer Tools (F12)

Every modern browser includes built-in DevTools to test, debug, and inspect your code:

1. **Inspect Elements (Ctrl+Shift+C / F12)**:
   - View HTML structure and inspect computed CSS rules in real time.
2. **Device Emulation (Ctrl+Shift+M)**:
   - Test responsive design on iPhone, iPad, and desktop viewports.
3. **Console Tab**:
   - Inspect JavaScript `console.log()` statements and errors.
4. **Application / Storage Tab**:
   - Go to **Application** > **Local Storage** > `http://localhost:8080` to inspect:
     - `techpulse_posts`: The JSON array of all blog posts.
     - `techpulse_user`: The currently logged-in user profile.
     - `techpulse_theme`: The active color theme (`light` or `dark`).

---

## 5. Testing & Grading Checklist

- [x] **Home (`index.html`)**: View cards, filter categories, search live, open reader modal, toggle theme.
- [x] **Login (`login.html`)**: Click "Quick Demo Account" to auto-fill credentials, log in with redirection.
- [x] **Register (`register.html`)**: Check password strength feedback and create a fresh user.
- [x] **Dashboard (`dashboard.html`)**: View user stats, manage posts, delete or edit existing blogs.
- [x] **Create Blog (`create-blog.html`)**: Use markdown editor, preview post in real time, add tags, and publish.
