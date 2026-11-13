# ⚡ DevScribe — by Kanak

> A modern Full-Stack Technical Publishing Platform & Personal Engineering Journal designed, architected, and built by **Kanak**.

Built using **Node.js** & **Express.js** REST API backend with JSON persistence, JWT authentication, and bcrypt password hashing, paired with a semantic **HTML5**, **CSS3** (custom multi-theme engine, CSS variables, glassmorphism, responsive grid), and vanilla **JavaScript (ES6+)** frontend featuring native **Web Speech API** integration and real-time backend API connectivity.

---

## 🚀 Key Highlights & New Full-Stack Architecture

1. **⚡ Node.js & Express.js REST API Backend**:
   - Modular MVC architecture (`server/routes/`, `server/controllers/`, `server/middleware/`, `server/config/db.js`).
   - Persistent file database engine (`server/data/users.json` and `server/data/posts.json`) seeded with Kanak's technical publications.
   - Comprehensive REST APIs for **User Registration**, **User Login**, **Create Blog**, **Get All Blogs**, **Get Single Blog**, **Update Blog**, **Delete Blog**, **Post Reactions**, and **Comments**.
   - Dual route aliases (`/api/auth/register` & `/api/register`, `/api/auth/login` & `/api/login`, `/api/posts` & `/api/blogs`).
   - Standard JWT token authorization (`Authorization: Bearer <token>`) & `bcryptjs` password hashing.
   - Live health check endpoint at `/api/health`.
   - Dual-mode server: Express serves both REST APIs on `/api/*` and all static frontend assets on `/*`.

2. **🔗 Seamless Frontend-to-Backend Integration (`js/api.js`)**:
   - Lightweight zero-dependency API bridge (`window.DevScribeAPI`) with automatic backend probing.
   - Real-time **"🟢 Backend API Connected"** status indicator rendered in the navigation header.
   - Seamless authentication persistence with JWT stored in `localStorage` and sent in HTTP headers.
   - Graceful offline fallback to LocalStorage if the backend server is stopped.

3. **🎧 Native Speech Synthesizer ("Listen to Story")**:
   - Integrated with the browser's native `window.speechSynthesis` API. Readers can listen to any technical article read aloud with play and stop controls — requiring zero external speech libraries or API keys.

4. **📈 Dynamic Reading Progress Bar**:
   - A neon gradient indicator at the top of the browser that tracks reading depth and viewport scrolling in real-time.

5. **🎨 3-Tier Luxury Editorial Theme Engine**:
   - **🌑 Cosmic Obsidian** (Deep dark mode with neon emerald accents)
   - **📜 Warm Parchment** (Editorial book & paper aesthetic)
   - **🌌 Cyber Aurora** (Deep sapphire navy with neon indigo glow)
   - Complete with dynamic theme persistence in `localStorage`.

6. **🔍 Accessibility Font Size Engine (`A-` / `A+`)**:
   - Readers can adjust base font sizes dynamically between 14px and 20px on the fly.

7. **⚡ Multi-Reaction Matrix**:
   - Expressive developer reactions: 🔥 Fire (Mind-blown), 💡 Insightful, 🚀 Shipped, and ☕ Relatable with real-time backend-synced counters.

8. **✍️ Split-Screen Markdown Authoring Studio**:
   - Write in markdown with live side-by-side preview, formatting toolbar, dynamic tag chips, cover image previews, word counter, and estimated audio reading duration.

---

## 👩‍💻 About the Author: Kanak

- **Role**: Full Stack Software Engineer & Technical Writer
- **Handle**: `@kanak_codes`
- **GitHub**: [github.com/kanakpml25-ctrl](https://github.com/kanakpml25-ctrl)
- **Focus Areas**: Scalable distributed systems, zero-dependency JavaScript internals, Node.js REST APIs, and modern CSS architecture.

---

## 📁 Project Directory Structure

```
DevScribe/
├── assets/
│   └── kanak.jpg                # 👤 Kanak's official profile photograph
├── css/
│   ├── style.css                # Global design system, 3-theme engine, progress bar, audio UI, toasts
│   ├── home.css                 # Hero spotlight, reaction matrix, category filter chips, cards
│   ├── auth.css                 # Author portal layout, password strength meter, glass cards
│   ├── dashboard.css            # Analytics metric cards, stories table, action clusters
│   └── editor.css               # Split-screen editor, toolbar, tag chip manager, preview pane
├── js/
│   ├── api.js                   # ⚡ Backend REST API Client & live connection monitor
│   ├── app.js                   # Author Kanak profile, theme engine, speech synthesizer
│   ├── home.js                  # Live search, reaction counters, reader modal & comments (API connected)
│   ├── auth.js                  # Login/Register validation & JWT session auth (API connected)
│   ├── dashboard.js             # Metrics calculation, story management, delete modal (API connected)
│   └── editor.js                # Markdown studio, tag chips, word counter, publish/draft (API connected)
├── server/
│   ├── config/
│   │   └── db.js                # Persistent JSON file database engine (Users & Posts)
│   ├── controllers/
│   │   ├── authController.js    # Register, login (bcrypt + JWT), and getMe controllers
│   │   └── postController.js    # Create, read, update, delete posts, reactions, & comments
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware (requireAuth & optionalAuth)
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/register, /api/auth/login, /api/auth/me
│   │   └── postRoutes.js        # /api/posts CRUD, /react, /comments
│   ├── data/
│   │   ├── users.json           # User database store
│   │   └── posts.json           # Articles database store
│   ├── test-api.js              # Automated 10-point backend API test suite
│   └── server.js                # Express app entry point & static file server (port 5000)
├── docs/
│   ├── HTML_CSS_JS_GUIDE.md     # 📖 Comprehensive learning guide to HTML5, CSS3, and JavaScript
│   └── DEV_ENVIRONMENT.md       # 🛠️ Development & Node.js backend setup guide
├── index.html                   # 🏠 Home Page (Author Spotlight with Kanak's photo, reactions, audio reader)
├── login.html                   # 🔐 Author Portal Login (Kanak's credentials & backend authentication)
├── register.html                # 📝 Community Registration (4-stage dynamic password meter + API registration)
├── dashboard.html               # 📊 Author Command Center (Kanak's metrics, story management, delete modal)
├── create-blog.html             # ✍️ Studio Editor (Markdown toolbar, split preview, tags, API publication)
├── package.json                 # Node.js project manifest & scripts (start, dev, test)
├── .env.example                 # Environment configuration template
├── start.bat                    # 🚀 1-Click launcher: auto-detects Node.js, runs backend, opens browser
├── serve.ps1                    # ⚡ Alternative lightweight PowerShell static server (.NET HttpListener)
└── README.md                    # 📌 Main documentation
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Health Check
- **`GET /api/health`**
  - **Response `200 OK`**:
    ```json
    {
      "status": "ok",
      "app": "DevScribe Backend",
      "author": "Kanak",
      "timestamp": "2026-11-13T16:45:00.000Z"
    }
    ```

### 2. User Authentication
- **`POST /api/auth/register`** (or alias **`POST /api/register`**)
  - **Body**:
    ```json
    {
      "name": "Jane Developer",
      "email": "jane@example.com",
      "password": "SecurePassword123"
    }
    ```
  - **Response `201 Created`**:
    ```json
    {
      "success": true,
      "message": "User registered successfully.",
      "token": "eyJhbGciOi...",
      "user": {
        "id": "user_1731518000000",
        "name": "Jane Developer",
        "email": "jane@example.com",
        "role": "author"
      }
    }
    ```

- **`POST /api/auth/login`** (or alias **`POST /api/login`**)
  - **Body**:
    ```json
    {
      "email": "kanak@devscribe.io",
      "password": "password123"
    }
    ```
  - **Response `200 OK`**:
    ```json
    {
      "success": true,
      "message": "Login successful.",
      "token": "eyJhbGciOi...",
      "user": {
        "id": "usr_kanak_001",
        "name": "Kanak",
        "email": "kanak@devscribe.io",
        "role": "Lead Architect & Author"
      }
    }
    ```

- **`GET /api/auth/me`**
  - **Headers**: `Authorization: Bearer <token>`
  - **Response `200 OK`**: Current authenticated user profile.

### 3. Blog Posts
- **`POST /api/posts`** (or alias **`POST /api/blogs`**)
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**:
    ```json
    {
      "title": "Scaling Distributed Node.js Services",
      "category": "Architecture",
      "tags": ["NodeJS", "Microservices", "Scalability"],
      "excerpt": "A deep dive into event loops, clustering, and Redis caching.",
      "content": "Full markdown content goes here...",
      "cover": "",
      "status": "published"
    }
    ```
  - **Response `201 Created`**:
    ```json
    {
      "success": true,
      "message": "Blog post published successfully.",
      "post": {
        "id": "post_1731518100000",
        "title": "Scaling Distributed Node.js Services",
        "slug": "scaling-distributed-node-js-services",
        "readTime": 3,
        "author": { "name": "Kanak", "handle": "@kanak_codes" },
        "reactions": { "fire": 0, "insight": 0, "ship": 0, "relate": 0 }
      }
    }
    ```

- **`GET /api/posts`** (or alias **`GET /api/blogs`**)
  - **Query Params (Optional)**: `?category=Architecture&search=redis&status=published`
  - **Response `200 OK`**:
    ```json
    {
      "success": true,
      "count": 5,
      "posts": [ /* array of posts */ ]
    }
    ```

- **`GET /api/posts/:id`**
  - **Response `200 OK`**: Single post details.

- **`PUT /api/posts/:id`**
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: Updated post fields (`title`, `content`, `category`, `tags`, etc.).
  - **Response `200 OK`**: Updated post object.

- **`DELETE /api/posts/:id`**
  - **Headers**: `Authorization: Bearer <token>`
  - **Response `200 OK`**: `{ "success": true, "message": "Blog post deleted successfully." }`

- **`POST /api/posts/:id/react`**
  - **Body**: `{ "type": "fire" }` (Valid types: `fire`, `insight`, `ship`, `relate`)
  - **Response `200 OK`**: Updated post reactions.

- **`POST /api/posts/:id/comments`**
  - **Body**: `{ "author": "Alex", "text": "Brilliant architecture breakdown!" }`
  - **Response `201 Created`**: Updated post with new comment.

---

## 🛠️ How to Run Locally

### 1. 1-Click Launcher (Easiest)
Simply double-click **`start.bat`**.
- It auto-detects Node.js on your computer (including user `AppData` paths).
- Launches the Express backend server on `http://localhost:5000`.
- Automatically opens your default web browser to the application.

### 2. Run via npm / Node.js
Open PowerShell or Terminal in the project root:
```powershell
# 1. Install dependencies (if not already installed)
npm install

# 2. Start the Express server
npm start
```
The server will start at:
- **Web App**: `http://localhost:5000`
- **REST APIs**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

### 3. Run Automated Backend Tests
Run the built-in 10-point API test suite to verify all endpoints:
```powershell
npm test
```
All 10 tests run against the live Express server verifying registration, login, blog creation, retrieval, reactions, comments, and deletion!

---

## 🔑 Demo Author Credentials

To sign in as Kanak in the Author Portal:
- **Email**: `kanak@devscribe.io`
- **Password**: `password123`
*(Or click the **"⚡ Click to Fill Kanak's Author Credentials"** button on the login screen).*

---

## 📜 License & Attribution
Designed, developed, and maintained by **Kanak**. Built for the CodeX engineering challenge. All rights reserved &copy; 2026.
