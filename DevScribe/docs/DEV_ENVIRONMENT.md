# Local Development & Backend Environment Guide

This guide walks you through setting up, inspecting, testing, and running your local development environment for the **DevScribe Full-Stack Application** by **Kanak**.

---

## 1. Project Overview & Folder Structure

```
DevScribe/
├── assets/
│   └── kanak.jpg                # Kanak's official profile photograph
├── css/
│   ├── style.css                # Global design system, theme variables, reset, navbar, toasts
│   ├── home.css                 # Home spotlight, reaction matrix, category filter chips
│   ├── auth.css                 # Login/Register cards, password strength meter
│   ├── dashboard.css            # Analytics metrics cards, story tables, action clusters
│   └── editor.css               # Split-screen markdown editor & preview pane
├── js/
│   ├── api.js                   # REST API client bridge with live backend health monitor
│   ├── app.js                   # Global state, theme engine, speech synthesizer
│   ├── home.js                  # Search, category filter, reactions, comments (API connected)
│   ├── auth.js                  # Form validation, JWT session handling (API connected)
│   ├── dashboard.js             # Metrics calculation, story management, delete modal (API connected)
│   └── editor.js                # Markdown studio, tag chips, word counter, publish/draft (API connected)
├── server/
│   ├── config/db.js             # Persistent JSON file database engine (Users & Posts)
│   ├── controllers/
│   │   ├── authController.js    # Register (bcrypt), Login (JWT), getMe
│   │   └── postController.js    # Create blog, get blogs, update, delete, reactions, comments
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/register, /api/auth/login, /api/auth/me
│   │   └── postRoutes.js        # /api/posts, /api/posts/:id, /react, /comments
│   ├── data/
│   │   ├── users.json           # User database store
│   │   └── posts.json           # Articles database store
│   ├── test-api.js              # Automated 10-point backend API test suite
│   └── server.js                # Express app entry point & static file server (port 5000)
├── docs/
│   ├── HTML_CSS_JS_GUIDE.md     # Learning manual for HTML5, CSS3, & JavaScript
│   └── DEV_ENVIRONMENT.md       # This local setup and backend guide
├── index.html                   # Home Page
├── login.html                   # Login Page
├── register.html                # Register Page
├── dashboard.html               # Author Dashboard
├── create-blog.html             # Studio Markdown Editor
├── package.json                 # Node.js project manifest & scripts
├── .env.example                 # Environment variables template
├── start.bat                    # 1-Click launcher
└── serve.ps1                    # Pure PowerShell static server alternative
```

---

## 2. Running the Full-Stack Application Locally

### Method A: 1-Click Launcher (Recommended for Windows)
Double-click `start.bat` in the project folder.
- Automatically checks for Node.js in the system PATH and `%LOCALAPPDATA%\Programs\nodejs`.
- Launches the Express backend server at `http://localhost:5000`.
- Automatically opens your default web browser to `http://localhost:5000`.

### Method B: Terminal / Command Prompt / PowerShell
Open PowerShell or Terminal in the project directory:
```powershell
# 1. Install dependencies
npm install

# 2. Run the Express backend server
npm start
```
The server will start listening at `http://localhost:5000`.
- **Application URL**: `http://localhost:5000/`
- **REST APIs**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

### Method C: Running the Automated Test Suite
To verify all REST API endpoints before deployment or grading:
```powershell
npm test
```
This runs `server/test-api.js`, which executes 10 end-to-end integration tests:
1. `GET /api/health` — Server health check
2. `POST /api/auth/register` — User registration with bcrypt hashing
3. `POST /api/auth/register` (Duplicate) — Conflict validation (HTTP 409)
4. `POST /api/auth/login` — Authentication and JWT token issuance
5. `POST /api/auth/login` (Kanak Demo) — Pre-seeded author login verification
6. `POST /api/posts` — Create Blog API with slug generation and author linking
7. `GET /api/posts` — Retrieve all posts with category filtering
8. `POST /api/posts/:id/react` — Multi-reaction counter update
9. `POST /api/posts/:id/comments` — Community comment submission
10. `DELETE /api/posts/:id` — Blog post deletion

---

## 3. Frontend-to-Backend Architecture

The frontend communicates with the backend via `js/api.js`:
- **Auto-Discovery**: On page load, `api.js` performs a background check to `http://localhost:5000/api/health`.
- **Live Indicator**: When connected, a glowing status badge (`🟢 Backend API Connected`) appears in the top navigation bar.
- **JWT Storage**: When a user registers or logs in, the returned JWT token is stored in `localStorage` under `devscribe_token`. All subsequent authenticated requests automatically pass the `Authorization: Bearer <token>` header.
- **Seamless Local Fallback**: If the server is offline or unreachable, the application gracefully falls back to local browser storage, ensuring uninterrupted evaluation and demonstration.

---

## 4. Browser Developer Tools (F12) Tips

1. **Console Tab**:
   - Inspect network logs and API request/response outputs prefixed with `[DevScribe API]`.
2. **Network Tab**:
   - Filter by `Fetch/XHR` to inspect live HTTP calls to `/api/auth/login`, `/api/auth/register`, `/api/posts`, etc.
   - Verify request payload, response status codes (`200`, `201`, `400`, `401`), and JSON responses.
3. **Application / Storage Tab**:
   - Inspect `localStorage`:
     - `devscribe_token`: Active JWT authentication token.
     - `devscribe_user`: Current logged-in user profile object.
     - `devscribe_theme`: Active editorial color theme (`cosmic-obsidian`, `warm-parchment`, `cyber-aurora`).

---

## 5. Pre-Seeded Author Account

- **Email**: `kanak@devscribe.io`
- **Password**: `password123`
- **Role**: Lead Architect & Author
