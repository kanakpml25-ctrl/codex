/**
 * DevScribe by Kanak - Home Page Logic (home.js)
 * Hero Spotlight, Reactions, Search, Reader Modal & Safe Audio Synthesis.
 */

let activeCategory = "All";
let searchFilter = "";
let currentOpenStoryId = null;

document.addEventListener("DOMContentLoaded", () => {
  renderHomeFeed();
  setupFilterChips();
  setupLiveSearch();
  setupModalBackdrop();
});

function renderHomeFeed() {
  const allStories = Storage.getStories();
  const published = allStories.filter((s) => s.status === "published");

  renderHeroSpotlight(published[0]);

  let filtered = published;

  if (activeCategory !== "All") {
    filtered = filtered.filter(
      (s) => s.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }

  if (searchFilter.trim() !== "") {
    const q = searchFilter.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q) ||
        (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  renderCardsGrid(filtered);
}

function renderHeroSpotlight(topStory) {
  const container = document.getElementById("hero-spotlight-container");
  if (!container || !topStory) return;

  const author = Storage.getUser();

  container.innerHTML = `
    <div class="hero-spotlight">
      <div class="hero-grid">
        <div class="hero-content-col">
          <span class="hero-author-badge">
            <span style="font-size: 0.9rem;">⚡</span> Engineering Journal &bull; Kanak
          </span>
          <h1 class="hero-headline">
            Engineering <span>Resilient Systems</span> &amp; Modern Architecture.
          </h1>
          <p class="hero-description">
            Hi, I'm <strong>Kanak</strong>. I write technical deep-dives on zero-dependency JavaScript, scalable distributed systems, and modern CSS architecture.
          </p>

          <div class="hero-stats-row">
            <div class="hero-stat-item">
              <h3>14.5K</h3>
              <p>Monthly Readers</p>
            </div>
            <div class="hero-stat-item">
              <h3>Zero Fluff</h3>
              <p>Technical Code</p>
            </div>
            <div class="hero-stat-item">
              <h3>Open Source</h3>
              <p>Architecture</p>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-lg" onclick="openStoryReader('${topStory.id}')">
              <span>Read Featured Story</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <a href="create-blog.html" class="btn btn-secondary btn-lg">Write a Story</a>
          </div>
        </div>

        <div class="hero-profile-col">
          <div class="hero-profile-card">
            <div class="hero-avatar-frame">
              <img src="${author.avatar || 'assets/kanak.jpg'}" alt="Kanak" class="hero-photo-img" onerror="this.src='kanak.jpg'; this.onerror=null;" />
            </div>
            <h3>${author.name}</h3>
            <p>${author.handle} &bull; Software Engineer</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
              "Building high-performance systems and writing code that stands the test of time."
            </p>
            <div class="hero-social-links">
              <a href="https://github.com/kanakpml25-ctrl" target="_blank" class="social-pill-link">GitHub</a>
              <a href="dashboard.html" class="social-pill-link">Dashboard</a>
              <a href="login.html" class="social-pill-link">Author Portal</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCardsGrid(stories) {
  const grid = document.getElementById("stories-grid");
  if (!grid) return;

  if (stories.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-main);">No technical articles found</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">Try adjusting your query or category filter.</p>
        <button class="btn btn-secondary btn-sm" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = stories
    .map((story) => {
      const rx = story.reactions || { fire: 12, insight: 8, shipped: 5, relatable: 3 };

      return `
        <article class="story-card" id="card-${story.id}">
          <div class="card-cover-container" onclick="openStoryReader('${story.id}')">
            <img src="${story.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1100&q=80'}" alt="${story.title}" class="card-cover-img" loading="lazy" />
            <span class="card-category-tag">${story.category || 'Engineering'}</span>
          </div>
          <div class="card-body">
            <div class="card-meta-line">
              <span>${formatDate(story.createdAt)}</span>
              <span>&bull;</span>
              <span>${story.readTime || '4 min read'}</span>
            </div>
            <h3 class="card-title" onclick="openStoryReader('${story.id}')">${story.title}</h3>
            <p class="card-excerpt">${story.excerpt}</p>

            <!-- Reaction Matrix -->
            <div class="card-reactions-bar">
              <button class="reaction-btn" onclick="handleReaction('${story.id}', 'fire', event)" title="Mind-blown / Fire">
                <span>🔥</span> <span id="rx-${story.id}-fire">${rx.fire || 0}</span>
              </button>
              <button class="reaction-btn" onclick="handleReaction('${story.id}', 'insight', event)" title="Insightful">
                <span>💡</span> <span id="rx-${story.id}-insight">${rx.insight || 0}</span>
              </button>
              <button class="reaction-btn" onclick="handleReaction('${story.id}', 'shipped', event)" title="Shipped / Inspiring">
                <span>🚀</span> <span id="rx-${story.id}-shipped">${rx.shipped || 0}</span>
              </button>
              <button class="reaction-btn" onclick="handleReaction('${story.id}', 'relatable', event)" title="Relatable">
                <span>☕</span> <span id="rx-${story.id}-relatable">${rx.relatable || 0}</span>
              </button>
            </div>

            <div class="card-footer-author">
              <div class="author-chip">
                <img src="${story.author?.avatar || 'assets/kanak.jpg'}" alt="Kanak" class="author-avatar-small" onerror="this.src='kanak.jpg'; this.onerror=null;" />
                <span class="author-name-text">${story.author?.name || 'Kanak'}</span>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="openStoryReader('${story.id}')">
                Read Story &rarr;
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function handleReaction(storyId, key, e) {
  if (e) e.stopPropagation();
  const story = Storage.getStoryById(storyId);
  if (!story) return;

  if (!story.reactions) {
    story.reactions = { fire: 0, insight: 0, shipped: 0, relatable: 0 };
  }

  story.reactions[key] = (story.reactions[key] || 0) + 1;
  Storage.saveStory(story);

  const span = document.getElementById(`rx-${storyId}-${key}`);
  if (span) {
    span.textContent = story.reactions[key];
    span.parentElement.classList.add("reacted");
  }

  const icons = { fire: "🔥", insight: "💡", shipped: "🚀", relatable: "☕" };
  showToast(`Reaction noted: ${icons[key]}`, "success", 1500);
}

function setupFilterChips() {
  document.querySelectorAll(".filter-chip-btn").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip-btn").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.getAttribute("data-category");
      renderHomeFeed();
    });
  });
}

function setupLiveSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", (e) => {
    searchFilter = e.target.value;
    renderHomeFeed();
  });
}

function resetFilters() {
  activeCategory = "All";
  searchFilter = "";
  const input = document.getElementById("search-input");
  if (input) input.value = "";
  document.querySelectorAll(".filter-chip-btn").forEach((c) => {
    if (c.getAttribute("data-category") === "All") c.classList.add("active");
    else c.classList.remove("active");
  });
  renderHomeFeed();
}

// Reader Modal with Safe Audio Trigger
function openStoryReader(storyId) {
  const story = Storage.getStoryById(storyId);
  if (!story) return;

  currentOpenStoryId = storyId;
  story.views = (story.views || 0) + 1;
  Storage.saveStory(story);

  const modal = document.getElementById("reader-modal");
  const modalBody = document.getElementById("reader-modal-body");
  if (!modal || !modalBody) return;

  // Use global formatCustomMarkdown from app.js
  const parsedContent = formatCustomMarkdown(story.content || story.excerpt);

  modalBody.innerHTML = `
    <article>
      <div class="reader-header-area">
        <span class="badge badge-emerald" style="margin-bottom: 0.75rem;">${story.category || 'Architecture'}</span>
        <h1 class="reader-title-large">${story.title}</h1>
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div class="author-chip">
            <img src="${story.author?.avatar || 'assets/kanak.jpg'}" alt="Kanak" class="author-avatar-small" onerror="this.src='kanak.jpg'; this.onerror=null;" />
            <div>
              <div class="author-name-text">${story.author?.name || 'Kanak'}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${formatDate(story.createdAt)} &bull; ${story.readTime || '4 min read'}</div>
            </div>
          </div>
          <div style="font-size: 0.82rem; color: var(--accent-primary); font-weight: 700;">
            ${(story.views || 1).toLocaleString()} Reads
          </div>
        </div>
      </div>

      <!-- Safe Speech Synthesizer Bar (Passes story ID, zero syntax error bug!) -->
      <div class="reader-audio-bar">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <button id="listen-audio-btn" class="audio-player-pill" onclick="handleStoryAudioById('${story.id}')">
            <span class="audio-play-icon">▶</span>
            <span class="audio-text">Listen to Story</span>
          </button>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Native Browser Audio</span>
        </div>
        <div>
          <button class="btn btn-secondary btn-sm" onclick="copyShareableLink('${story.id}')">
            Share Story
          </button>
        </div>
      </div>

      <div class="article-content-body">
        ${parsedContent}
      </div>

      <section style="border-top: 1px solid var(--border-color); padding-top: 2rem;">
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.25rem;">
          Discussion Notes (${(story.comments || []).length})
        </h3>

        <form onsubmit="handleCommentSubmit(event)" style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 2rem;">
          <div class="form-group" style="margin-bottom: 0.65rem;">
            <input type="text" id="comment-author" class="form-control" placeholder="Your name (e.g. Fellow Engineer)" required />
          </div>
          <div class="form-group" style="margin-bottom: 0.75rem;">
            <textarea id="comment-body" class="form-control" rows="3" placeholder="Leave technical feedback or notes for Kanak..." required></textarea>
          </div>
          <div style="text-align: right;">
            <button type="submit" class="btn btn-primary btn-sm">Post Note</button>
          </div>
        </form>

        <div id="comments-container" style="display: flex; flex-direction: column; gap: 1rem;">
          ${renderComments(story.comments || [])}
        </div>
      </section>
    </article>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeStoryReader() {
  const modal = document.getElementById("reader-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    currentOpenStoryId = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function setupModalBackdrop() {
  const modal = document.getElementById("reader-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeStoryReader();
    });
  }
}

function renderComments(comments) {
  if (comments.length === 0) {
    return `<p style="text-align: center; color: var(--text-muted); font-size: 0.88rem; padding: 1rem;">No discussion notes yet. Start the conversation!</p>`;
  }

  return comments
    .map(
      (c) => `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-main);">${c.author}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${formatDate(c.date)}</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${c.text}</p>
      </div>
    `
    )
    .join("");
}

function handleCommentSubmit(e) {
  e.preventDefault();
  if (!currentOpenStoryId) return;

  const author = document.getElementById("comment-author").value.trim();
  const text = document.getElementById("comment-body").value.trim();
  if (!author || !text) return;

  const story = Storage.getStoryById(currentOpenStoryId);
  if (!story) return;

  if (!story.comments) story.comments = [];
  story.comments.push({
    id: "c-" + Date.now(),
    author: author,
    text: text,
    date: new Date().toISOString()
  });

  Storage.saveStory(story);
  document.getElementById("comment-body").value = "";
  document.getElementById("comments-container").innerHTML = renderComments(story.comments);
  showToast("Comment published! ✨", "success");
}

function copyShareableLink(id) {
  const url = window.location.href.split("?")[0] + `?story=${id}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast("Story URL copied to clipboard! 📋", "success");
  }).catch(() => {
    showToast("Link: " + url, "info");
  });
}
