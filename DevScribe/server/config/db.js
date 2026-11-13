const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const SEED_USERS = [
  {
    id: "user-kanak",
    name: "Kanak",
    email: "kanak@devscribe.io",
    passwordHash: "$2a$10$LyOWLTldvhCQYTMzIgsp.uHgyKtX/oR3p0xekw4KAq87GoJAMnBR2", // password123
    handle: "@kanak_codes",
    bio: "Software Engineer documenting scalable distributed systems, zero-dependency JavaScript internals, and modern CSS architecture.",
    avatar: "assets/kanak.jpg",
    role: "Lead Author",
    createdAt: "2026-10-15T10:00:00Z"
  }
];

const SEED_POSTS = [
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
      id: "user-kanak",
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

However, in real production workloads, hidden tight coupling frequently emerges through schema drift and unbounded retry storms.

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
      id: "user-kanak",
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
      id: "user-kanak",
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
      id: "user-kanak",
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
      id: "user-kanak",
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

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(SEED_USERS, null, 2), 'utf-8');
}

if (!fs.existsSync(POSTS_FILE)) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(SEED_POSTS, null, 2), 'utf-8');
}

// Database Helper methods
const db = {
  getUsers() {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data) || [];
    } catch (err) {
      console.error('Error reading users file:', err);
      return [];
    }
  },

  saveUsers(users) {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error saving users file:', err);
      return false;
    }
  },

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  createUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
    return user;
  },

  getPosts() {
    try {
      const data = fs.readFileSync(POSTS_FILE, 'utf-8');
      return JSON.parse(data) || [];
    } catch (err) {
      console.error('Error reading posts file:', err);
      return [];
    }
  },

  savePosts(posts) {
    try {
      fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error saving posts file:', err);
      return false;
    }
  },

  findPostById(id) {
    const posts = this.getPosts();
    return posts.find((p) => p.id === id) || null;
  },

  createPost(post) {
    const posts = this.getPosts();
    posts.unshift(post);
    this.savePosts(posts);
    return post;
  },

  updatePost(id, updatedFields) {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    posts[index] = { ...posts[index], ...updatedFields };
    this.savePosts(posts);
    return posts[index];
  },

  deletePost(id) {
    const posts = this.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    if (filtered.length === posts.length) return false;
    this.savePosts(filtered);
    return true;
  }
};

module.exports = db;
