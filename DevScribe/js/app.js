/**
 * DevScribe by Kanak - Core Application Engine (app.js)
 * Global State, Speech Synthesizer, Multi-Theme Engine, Markdown Parser & Persistence.
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

### Key Architecture Checklist:
- Always define schemas using Avro or Protobuf with strict backward compatibility rules.
- Pair every message queue with an explicit Dead Letter Queue (DLQ) and exponential backoff retry jitter.`,
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1100&q=80",
    author: {
      name: "Kanak",
      avatar: "assets/kanak.jpg",
      handle: "@kanak_codes",
      role: "Lead Engineer & Author"
    },
    status: "published",
    readTime: "6 min read",
    createdAt: "2026-11-06T10:15:00Z",
    views: 5120,
    reactions: { fire: 142, insight: 98, shipped: 41, relatable: 27 },
    comments: [
      { id: "c3", author: "Marcus Vance", text: "We suffered a retry storm last quarter. The exponential jitter advice here is spot on.", date: "2026-11-08T11:45:00Z" }
    ]
  },
  {
    id: "story-3",
    title: "Modern CSS Architecture: Houdini, Custom Properties, and Subgrid in 2026",
    slug: "modern-css-architecture-houdini-custom-properties",
    category: "Modern CSS",
    tags: ["CSS", "Frontend", "WebStandards", "DesignSystems"],
    excerpt: "Exploring the bleeding edge of modern styling: typed CSS variables with @property, subgrid card alignment, and fluid typography formulas.",
    content: `## Beyond Preprocessors

The CSS specification has evolved dramatically. Today, features that previously required Sass, Less, or heavy CSS-in-JS abstractions are natively supported with superior runtime performance.

### Typed CSS Custom Properties with \`@property\`
By declaring variable types and inheritance rules, the browser's render engine can now interpolate custom values smoothly:

\`\`\`css
@property --glow-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.animated-card-border {
  background: conic-gradient(from var(--glow-angle), #10b981, #06b6d4, #10b981);
  animation: rotateGlow 4s linear infinite;
}
\`\`\`

### Fluid Typography without Breakpoints
Using \`clamp()\` and viewport units, your font scales continuously between mobile and 4K displays:
\`\`\`css
font-size: clamp(1rem, 0.8rem + 1vw, 1.5rem);
\`\`\``,
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1100&q=80",
    author: {
      name: "Kanak",
      avatar: "assets/kanak.jpg",
      handle: "@kanak_codes",
      role: "Lead Engineer & Author"
    },
    status: "published",
    readTime: "3 min read",
    createdAt: "2026-11-03T18:00:00Z",
    views: 2890,
    reactions: { fire: 76, insight: 61, shipped: 18, relatable: 34 },
    comments: []
  },
  {
    id: "story-4",
    title: "Navigating Edge Cases in JavaScript Async/Await and the Microtask Queue",
    slug: "edge-cases-async-await-microtasks",
    category: "Deep Dives",
    tags: ["JavaScript", "V8", "Async", "Performance"],
    excerpt: "A deep dive into why Promise chaining order matters, unhandled rejections in loops, and how V8 prioritizes microtasks against requestAnimationFrame.",
    content: `## The Underbelly of the Event Loop

Most developers understand the distinction between the Call Stack, Macro-task Queue (setTimeout, setInterval), and Micro-task Queue (Promise.resolve, queueMicrotask). However, subtle memory leaks and UI stutter often stem from microtask starvation.

When a loop continuously schedules microtasks within microtasks, the browser's render pipeline cannot execute DOM paints or handle user input events until the microtask queue empties completely.`,
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1100&q=80",
    author: {
      name: "Kanak",
      avatar: "assets/kanak.jpg",
      handle: "@kanak_codes",
      role: "Lead Engineer & Author"
    },
    status: "published",
    readTime: "5 min read",
    createdAt: "2026-10-28T09:00:00Z",
    views: 1980,
    reactions: { fire: 62, insight: 45, shipped: 12, relatable: 15 },
    comments: []
  },
  {
    id: "story-5",
    title: "Draft: High-Throughput Microservices with Go and Protocol Buffers",
    slug: "draft-microservices-go-protobuf",
    category: "Architecture",
    tags: ["Golang", "Microservices", "Protobuf", "Backend"],
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
// 2. Storage Layer
// ============================================================================
const Storage = {
  init() {
    if (!localStorage.getItem("devscribe_stories")) {
      localStorage.setItem("devscribe_stories", JSON.stringify(SEED_STORIES));
    }
    if (!localStorage.getItem("devscribe_user")) {
      localStorage.setItem("devscribe_user", JSON.stringify(KANAK_USER));
    }
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

  getUser() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem("devscribe_user")) || KANAK_USER;
    } catch (e) {
      return KANAK_USER;
    }
  },

  saveUser(user) {
    localStorage.setItem("devscribe_user", JSON.stringify(user));
  }
};

// ============================================================================
// 3. Global Markdown Parser & Code Snippet Copy (Available to all pages!)
// ============================================================================
function formatCustomMarkdown(md) {
  if (!md) return "";
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks with one-click copy button
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
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background: var(--bg-surface); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: monospace; color: #38bdf8;">$1</code>')
    // Headings
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    // Bold & Italics
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Lists
    .replace(/^\s*-\s+(.*$)/gim, "<li>$1</li>")
    .replace(/\n\s*\n/g, "</p><p>");

  return `<p>${html}</p>`;
}

// Global copy snippet handler
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
// 4. Safe Native Speech Synthesizer (No string quote crash bugs!)
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
    showToast("Audio paused.", "info", 1500);
    return;
  }

  const story = Storage.getStoryById(storyId);
  if (!story) return;

  window.speechSynthesis.cancel();

  const cleanText = (story.content || story.excerpt || "")
    .replace(/[#*`_>-]/g, "")
    .replace(/\n+/g, ". ");

  const utterance = new SpeechSynthesisUtterance(`${story.title}. By Kanak. ${cleanText}`);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onend = () => {
    isSpeechPlaying = false;
    updateAudioButtonUI(false);
  };

  utterance.onerror = () => {
    isSpeechPlaying = false;
    updateAudioButtonUI(false);
  };

  window.speechSynthesis.speak(utterance);
  isSpeechPlaying = true;
  updateAudioButtonUI(true);
  showToast("🎧 Reading aloud via browser speech synthesizer...", "info", 2500);
};

function updateAudioButtonUI(speaking) {
  const btn = document.getElementById("listen-audio-btn");
  if (!btn) return;
  if (speaking) {
    btn.innerHTML = `
      <span class="audio-play-icon" style="background: var(--color-danger);">⏹</span>
      <span class="audio-text">Stop Audio</span>
    `;
  } else {
    btn.innerHTML = `
      <span class="audio-play-icon">▶</span>
      <span class="audio-text">Listen to Story</span>
    `;
  }
}

// ============================================================================
// 5. Multi-Theme & Accessibility Controls
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

  // Safe path detection (stripping ?query and #hash)
  const fullPath = window.location.pathname.split("/").pop() || "index.html";
  const currentPath = fullPath.split("?")[0].split("#")[0] || "index.html";

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
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
