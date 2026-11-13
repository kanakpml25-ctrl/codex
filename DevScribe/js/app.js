/**
 * DevScribe by Kanak - Core Application Engine (app.js)
 * Global State, Speech Synthesizer, Multi-Theme Engine, Markdown Parser & Dynamic Session Management.
 */

// ============================================================================
// 1. Author Identity & Verified Seed Stories (by Kanak)
// ============================================================================
const KANAK_USER = {
  id: "kanak-author",
  name: "Kanak",
  handle: "@kanak_codes",
  email: "kanak@devscribe.io",
  title: "Software Engineer & Architect",
  bio: "Software Engineer documenting scalable distributed systems, zero-dependency JavaScript internals, and modern CSS architecture.",
  avatar: "assets/kanak.jpg",
  github: "https://github.com/kanakpml25-ctrl",
  joinedDate: "October 2026",
  followers: "1,420",
  articlesCount: 4
};

const SEED_STORIES = [
  {
    id: "story-1",
    title: "Behind the Architecture: How I Built a Zero-Dependency State Store with Vanilla JS",
    slug: "zero-dependency-state-store-vanilla-js",
    category: "Architecture",
    tags: ["JavaScript", "Architecture", "StateManagement", "CleanCode"],
    excerpt: "You don't always need 80MB of node_modules just to handle reactive state. Here is how I structured an immutable, observable store using native JavaScript Proxies and CustomEvents.",
    content: `## The Problem with Heavy Client-Side State

In many enterprise applications, developers reach for heavy external state management libraries before clearly understanding their application's actual data flow. For client-side tools and performance-critical dashboards, the browser's native JavaScript APIs provide everything needed to build a blazing-fast, reactive architecture.

### Crafting the Reactive Proxy Store
By utilizing the ES6 \`Proxy\` object, we can intercept property mutations and broadcast change notifications without dirty polling or virtual DOM overhead:

\`\`\`javascript
class ReactiveStore {
  constructor(initialState) {
    this.events = new EventTarget();
    this.state = new Proxy(initialState, {
      set: (target, prop, value) => {
        target[prop] = value;
        this.events.dispatchEvent(new CustomEvent('statechange', { detail: { prop, value } }));
        return true;
      }
    });
  }

  subscribe(callback) {
    this.events.addEventListener('statechange', (e) => callback(e.detail));
  }
}
\`\`\`

### Practical Advantages in Production
1. **Zero Runtime Overhead**: Executes at native browser speed.
2. **Instant Debugging**: No complex middleware or action creators required.
3. **Seamless Persistence**: Directly bridges to \`window.localStorage\` with zero serialization lag.`,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1100&q=80",
    author: {
      name: "Kanak",
      avatar: "assets/kanak.jpg",
      handle: "@kanak_codes",
      role: "Lead Engineer & Author"
    },
    status: "published",
    readTime: "4 min read",
    createdAt: "2026-11-10T14:30:00Z",
    views: 3410,
    reactions: { fire: 89, insight: 54, shipped: 32, relatable: 19 },
    comments: [
      { id: "c1", author: "Devon Reed", text: "Using EventTarget with Proxy is such an elegant design pattern, Kanak! Implementing this in my next micro-tool.", date: "2026-11-11T16:00:00Z" },
      { id: "c2", author: "Aisha Patel", text: "So refreshing to see clean, thoughtful vanilla JavaScript without framework fatigue.", date: "2026-11-12T09:20:00Z" }
    ]
  },
  {
    id: "story-2",
    title: "Why Distributed Event-Driven Architecture Keeps Failing in Production (And How to Fix It)",
    slug: "event-driven-architecture-failures-and-fixes",
    category: "System Design",
    tags: ["SystemDesign", "Microservices", "Kafka", "DevOps"],
    excerpt: "Event-driven microservices promise loose coupling, but without idempotent consumers and dead-letter queues, they can spiral into cascading failures. Let's dissect real mitigation patterns.",
    content: `## The Illusion of Complete Decoupling

Event-driven architecture is frequently advertised as the silver bullet for microservices scalability. You fire an event into a message broker like Apache Kafka or RabbitMQ, and your upstream producer never has to worry about downstream health.

However, in real production workloads, hidden tight coupling frequently emerges through:
1. **Schema Drift**: Uncoordinated message payload mutations causing parsing crashes.
2. **Unbounded Retry Storms**: Transient consumer failures triggering immediate retry cascades that exhaust database connection pools.

### The Idempotent Consumer Pattern
To prevent duplicate execution when messages are redelivered, every consumer must maintain an idempotency key cache:

\`\`\`sql
-- Ensuring atomic deduplication
INSERT INTO processed_events (event_id, consumer_id, processed_at)
VALUES ($1, $2, NOW())
ON CONFLICT (event_id, consumer_id) DO NOTHING;
\`\`\`

### Hardened Production Checklist
- Always version event schemas using Protocol Buffers or JSON Schema.
- Implement exponential backoff jitter on consumer retries.
- Isolate poison-pill payloads into an audited Dead Letter Queue (DLQ).`,
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1100&q=80",
    author: {
      name: "Kanak",
      avatar: "assets/kanak.jpg",
      handle: "@kanak_codes",
      role: "Lead Engineer & Author"
    },
    status: "published",
    readTime: "6 min read",
    createdAt: "2026-11-08T11:15:00Z",
    views: 5120,
    reactions: { fire: 142, insight: 98, shipped: 61, relatable: 35 },
    comments: [
      { id: "c3", author: "Rohan Verma", text: "Idempotency keys saved our transaction processor last quarter. Outstanding breakdown!", date: "2026-11-09T18:40:00Z" }
    ]
  },
  {
    id: "story-3",
    title: "Modern CSS Architecture: Subgrid, Fluid Clamping & Luxury Dark Modes Without JavaScript",
    slug: "modern-css-subgrid-clamping-dark-modes",
    category: "Modern CSS",
    tags: ["CSS", "Frontend", "WebDesign", "Typography"],
    excerpt: "Modern CSS has evolved past the era of heavy utility resets. Learn how CSS Grid subgrid, clamp() fluid typography, and relative color syntax build magazine-grade editorial layouts.",
    content: `## The Renaissance of Native CSS

Over the past three years, the web platform has received some of the most transformative layout and color capabilities in browser history. Many layouts that once required complex JavaScript resize listeners can now be implemented with two lines of native CSS.

### 1. Fluid Typography with clamp()
Say goodbye to dozens of breakpoint media queries:

\`\`\`css
/* Smoothly scales from 1.1rem at 360px viewport to 2.4rem at 1440px */
.editorial-headline {
  font-size: clamp(1.1rem, 0.75rem + 1.8vw, 2.4rem);
  letter-spacing: -0.03em;
  line-height: 1.15;
}
\`\`\`

### 2. Perfect Card Grid Alignments with Subgrid
Cards with variable-length titles, descriptions, and action rows can now align their internal elements across sibling columns seamlessly:

\`\`\`css
.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: auto auto 1fr auto;
}

.story-card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 4;
}
\`\`\``,
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1100&q=80",
    author: {
      name: "Kanak",
      avatar: "assets/kanak.jpg",
      handle: "@kanak_codes",
      role: "Lead Engineer & Author"
    },
    status: "published",
    readTime: "5 min read",
    createdAt: "2026-11-05T09:00:00Z",
    views: 4230,
    reactions: { fire: 110, insight: 77, shipped: 45, relatable: 28 },
    comments: [
      { id: "c4", author: "Claire Dupont", text: "Subgrid finally fixes card button alignment! Beautiful article Kanak.", date: "2026-11-06T14:10:00Z" }
    ]
  },
  {
    id: "story-4",
    title: "High-Throughput Binary Serialization: When to Pick gRPC vs REST in Node.js",
    slug: "grpc-vs-rest-high-throughput-nodejs",
    category: "Deep Dives",
    tags: ["NodeJS", "gRPC", "Protobuf", "Performance"],
    excerpt: "Exploring low-overhead binary RPC protocols over HTTP/2 for latency-sensitive internal services.",
    content: `## Why gRPC Outperforms REST in Internal Clusters

When internal service-to-service communication exceeds 50,000 requests per second, JSON serialization and deserialization consumes substantial CPU cycles. Protocol Buffers serialize data into compact binary payloads with typed contracts.`,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1100&q=80",
    author: {
      name: "Kanak",
      avatar: "assets/kanak.jpg",
      handle: "@kanak_codes",
      role: "Lead Engineer & Author"
    },
    status: "draft",
    readTime: "2 min read",
    createdAt: "2026-11-11T20:00:00Z",
    views: 45,
    reactions: { fire: 0, insight: 0, shipped: 0, relatable: 0 },
    comments: []
  }
];

// ============================================================================
// 2. Storage Layer (Strict Authentication: Guest by Default)
// ============================================================================
const Storage = {
  init() {
    if (!localStorage.getItem("devscribe_stories")) {
      localStorage.setItem("devscribe_stories", JSON.stringify(SEED_STORIES));
    }
    // IMPORTANT: DO NOT automatically set devscribe_user!
    // A visitor is strictly a guest until they manually log in or register.
    if (!localStorage.getItem("devscribe_theme")) {
      localStorage.setItem("devscribe_theme", "obsidian");
    }
    if (!localStorage.getItem("devscribe_font_size")) {
      localStorage.setItem("devscribe_font_size", "16");
    }
  },

  getStories() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem("devscribe_stories")) || [];
    } catch (e) {
      return [];
    }
  },

  saveStories(stories) {
    localStorage.setItem("devscribe_stories", JSON.stringify(stories));
  },

  getStoryById(id) {
    return this.getStories().find((s) => s.id === id) || null;
  },

  saveStory(story) {
    const stories = this.getStories();
    const idx = stories.findIndex((s) => s.id === story.id);
    if (idx >= 0) {
      stories[idx] = { ...stories[idx], ...story };
    } else {
      stories.unshift(story);
    }
    this.saveStories(stories);
    return story;
  },

  deleteStory(id) {
    const stories = this.getStories().filter((s) => s.id !== id);
    this.saveStories(stories);
    return stories;
  },

  /**
   * Returns the currently logged in user object, or NULL if guest.
   */
  getUser() {
    try {
      const raw = localStorage.getItem("devscribe_user");
      if (!raw) return null;
      const user = JSON.parse(raw);
      if (user && user.avatar && (user.avatar.includes('font-family="') || !user.avatar.includes('%3C') && user.avatar.includes('<svg'))) {
        // Fix unencoded SVG avatar from earlier sessions
        const initials = (user.name || "DS").trim().split(" ").filter(Boolean).map(p => p[0].toUpperCase()).slice(0, 2).join("");
        const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#10b981"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(#g)"/><text x="50" y="58" font-family="sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials || "DS"}</text></svg>`;
        user.avatar = `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
        localStorage.setItem("devscribe_user", JSON.stringify(user));
      }
      return user;
    } catch (e) {
      return null;
    }
  },

  /**
   * Save user session upon successful login or registration
   */
  saveUser(user) {
    if (user) {
      localStorage.setItem("devscribe_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("devscribe_user");
      localStorage.removeItem("devscribe_jwt_token");
    }
    updateNavbarAuth();
  },

  /**
   * Sign out: clear session and tokens
   */
  clearUser() {
    localStorage.removeItem("devscribe_user");
    localStorage.removeItem("devscribe_jwt_token");
    if (typeof Api !== "undefined" && Api.clearToken) {
      Api.clearToken();
    }
    updateNavbarAuth();
  }
};

// Global sign out function
window.logoutUser = function () {
  Storage.clearUser();
  showToast("You have been signed out.", "info");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 400);
};

// ============================================================================
// 3. Dynamic Universal Navigation Engine (Guest vs Logged-In User)
// ============================================================================
function updateNavbarAuth() {
  const user = Storage.getUser();
  const navLinks = document.getElementById("nav-links");
  const navControls = document.querySelector(".nav-controls");

  // Determine current file
  const fullPath = window.location.pathname.split("/").pop() || "index.html";
  const currentPath = fullPath.split("?")[0].split("#")[0] || "index.html";

  if (navLinks) {
    if (!user) {
      // --- GUEST STATE ---
      navLinks.innerHTML = `
        <li><a href="index.html" class="nav-link ${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">Home</a></li>
        <li><a href="login.html" class="nav-link ${currentPath === 'login.html' ? 'active' : ''}">Sign In</a></li>
        <li><a href="register.html" class="nav-link ${currentPath === 'register.html' ? 'active' : ''}">Register</a></li>
      `;
    } else {
      // --- LOGGED-IN AUTHOR STATE ---
      navLinks.innerHTML = `
        <li><a href="index.html" class="nav-link ${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">Home</a></li>
        <li><a href="dashboard.html" class="nav-link ${currentPath === 'dashboard.html' ? 'active' : ''}">Dashboard</a></li>
        <li><a href="create-blog.html" class="nav-link ${currentPath === 'create-blog.html' ? 'active' : ''}">Write</a></li>
      `;
    }
  }

  // Update or inject User Capsule in nav controls
  let userPill = document.getElementById("nav-user-pill");
  let writeBtn = document.querySelector(".nav-write-btn");

  if (!user) {
    // If not logged in, remove user pill if present
    if (userPill) userPill.remove();

    // The +Write button prompts login
    if (writeBtn) {
      writeBtn.href = "login.html";
      writeBtn.onclick = (e) => {
        // Allow navigation to login
      };
    }
  } else {
    // If logged in, ensure user pill exists
    if (!userPill && navControls) {
      userPill = document.createElement("div");
      userPill.id = "nav-user-pill";
      userPill.className = "nav-user-pill";
      // Insert before mobile menu toggle
      const toggle = document.getElementById("mobile-menu-toggle");
      if (toggle) {
        navControls.insertBefore(userPill, toggle);
      } else {
        navControls.appendChild(userPill);
      }
    }

    if (userPill) {
      const avatarSrc = user.avatar || "assets/kanak.jpg";
      const displayName = user.name || "Author";

      userPill.innerHTML = "";
      const capsule = document.createElement("div");
      capsule.className = "user-capsule";
      capsule.title = `Logged in as ${displayName}`;

      const avatarImg = document.createElement("img");
      avatarImg.className = "user-capsule-avatar";
      avatarImg.alt = displayName;
      avatarImg.src = avatarSrc;
      avatarImg.onerror = function () {
        this.src = "assets/kanak.jpg";
        this.onerror = null;
      };

      const nameSpan = document.createElement("span");
      nameSpan.className = "user-capsule-name";
      nameSpan.textContent = displayName.split(" ")[0];

      const logoutBtn = document.createElement("button");
      logoutBtn.type = "button";
      logoutBtn.className = "user-capsule-logout";
      logoutBtn.title = "Sign Out";
      logoutBtn.onclick = logoutUser;
      logoutBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      `;

      capsule.appendChild(avatarImg);
      capsule.appendChild(nameSpan);
      capsule.appendChild(logoutBtn);
      userPill.appendChild(capsule);
    }

    if (writeBtn) {
      writeBtn.href = "create-blog.html";
    }
  }
}

// ============================================================================
// 4. Global Markdown Parser & Code Snippet Copy
// ============================================================================
function formatCustomMarkdown(md) {
  if (!md) return "";
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `
        <div class="code-snippet-box">
          <div class="code-snippet-header">
            <span>${lang || 'javascript'}</span>
            <button class="copy-code-btn" onclick="copySnippet(this)">Copy</button>
          </div>
          <pre><code>${code.trim()}</code></pre>
        </div>
      `;
    })
    .replace(/`([^`]+)`/g, '<code style="background: var(--bg-surface); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: monospace; color: #38bdf8;">$1</code>')
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^\s*-\s+(.*$)/gim, "<li>$1</li>")
    .replace(/\n\s*\n/g, "</p><p>");

  return `<p>${html}</p>`;
}

window.copySnippet = function (btn) {
  const codeEl = btn.closest(".code-snippet-box").querySelector("code");
  if (codeEl) {
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      btn.textContent = "Copied! ✓";
      setTimeout(() => (btn.textContent = "Copy"), 2000);
    }).catch(() => {
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  }
};

// ============================================================================
// 5. Safe Native Speech Synthesizer
// ============================================================================
let isSpeechPlaying = false;

window.handleStoryAudioById = function (storyId) {
  if (!("speechSynthesis" in window)) {
    showToast("Text-to-speech is not supported in this browser.", "error");
    return;
  }

  if (isSpeechPlaying) {
    window.speechSynthesis.cancel();
    isSpeechPlaying = false;
    updateAudioButtonUI(false);
    showToast("Playback stopped.", "info");
    return;
  }

  const story = Storage.getStoryById(storyId);
  if (!story) {
    showToast("Article not found for audio playback.", "error");
    return;
  }

  const cleanText = story.title + ". " + (story.content || "").replace(/[#*`_\[\]()>-]/g, " ");
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    isSpeechPlaying = true;
    updateAudioButtonUI(true);
    showToast("Listening to story...", "success");
  };

  utterance.onend = () => {
    isSpeechPlaying = false;
    updateAudioButtonUI(false);
  };

  utterance.onerror = () => {
    isSpeechPlaying = false;
    updateAudioButtonUI(false);
  };

  window.speechSynthesis.speak(utterance);
};

function updateAudioButtonUI(playing) {
  const btn = document.getElementById("listen-story-btn");
  if (btn) {
    if (playing) {
      btn.innerHTML = `
        <span class="audio-wave-anim"><span></span><span></span><span></span></span>
        <span>Stop Audio</span>
      `;
      btn.classList.add("playing");
    } else {
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <span>Listen to Story</span>
      `;
      btn.classList.remove("playing");
    }
  }
}

// ============================================================================
// 6. Multi-Theme & Accessibility Controls
// ============================================================================
const THEMES = [
  { id: "obsidian", name: "🌑 Obsidian" },
  { id: "parchment", name: "📜 Parchment" },
  { id: "aurora", name: "🌌 Aurora" }
];

function initThemeEngine() {
  const currentTheme = localStorage.getItem("devscribe_theme") || "obsidian";
  applyTheme(currentTheme);

  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const active = localStorage.getItem("devscribe_theme") || "obsidian";
      const nextIdx = (THEMES.findIndex((t) => t.id === active) + 1) % THEMES.length;
      const nextTheme = THEMES[nextIdx].id;
      applyTheme(nextTheme);
      showToast(`Switched theme to ${THEMES[nextIdx].name}`, "info", 1800);
    });
  }
}

function applyTheme(themeId) {
  if (themeId === "obsidian") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeId);
  }
  localStorage.setItem("devscribe_theme", themeId);

  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    const found = THEMES.find((t) => t.id === themeId) || THEMES[0];
    themeBtn.innerHTML = `<span>${found.name}</span>`;
  }
}

function initFontControls() {
  const savedSize = parseInt(localStorage.getItem("devscribe_font_size") || "16", 10);
  document.documentElement.style.setProperty("--font-base-size", `${savedSize}px`);

  const btnDecrease = document.getElementById("font-decrease");
  const btnIncrease = document.getElementById("font-increase");

  if (btnDecrease) {
    btnDecrease.addEventListener("click", () => {
      let cur = parseInt(localStorage.getItem("devscribe_font_size") || "16", 10);
      if (cur > 14) {
        cur -= 1;
        document.documentElement.style.setProperty("--font-base-size", `${cur}px`);
        localStorage.setItem("devscribe_font_size", cur);
      }
    });
  }

  if (btnIncrease) {
    btnIncrease.addEventListener("click", () => {
      let cur = parseInt(localStorage.getItem("devscribe_font_size") || "16", 10);
      if (cur < 20) {
        cur += 1;
        document.documentElement.style.setProperty("--font-base-size", `${cur}px`);
        localStorage.setItem("devscribe_font_size", cur);
      }
    });
  }
}

function initReadingProgressBar() {
  const bar = document.getElementById("reading-progress-bar");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    bar.style.width = scrolled + "%";
  });
}

function initGlobalNav() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
  updateNavbarAuth();
}

function showToast(message, type = "info", duration = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button style="background:none; border:none; color:inherit; cursor:pointer; font-size: 1.1rem; line-height: 1;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }
  }, duration);
}

function formatDate(iso) {
  if (!iso) return "Recently";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

document.addEventListener("DOMContentLoaded", () => {
  Storage.init();
  initThemeEngine();
  initFontControls();
  initReadingProgressBar();
  initGlobalNav();
});
