/**
 * DevScribe by Kanak - Home Page Logic (home.js)
 * Connected to Node.js / Express.js REST API for fetching stories, reactions, and comments.
 */

let activeCategory = "All";
let searchFilter = "";
let currentOpenStoryId = null;

document.addEventListener("DOMContentLoaded", async () => {
  setupFilterChips();
  setupLiveSearch();
  setupModalBackdrop();
  await loadAndRenderFeed();
});

async function loadAndRenderFeed() {
  try {
    // Attempt fetch from Express REST API
    const apiPosts = await Api.getPosts();
    if (Array.isArray(apiPosts) && apiPosts.length > 0) {
      Storage.saveStories(apiPosts);
    }
  } catch (err) {
    console.warn("Using offline cached stories:", err.message);
  }

  renderHomeFeed();
}

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

  const currentUser = Storage.getUser();

  if (currentUser) {
    // --- LOGGED-IN AUTHOR VIEW ---
    container.innerHTML = `
      <div class="hero-spotlight">
        <div class="hero-grid">
          <div class="hero-content-col">
            <span class="hero-author-badge">
              <span style="font-size: 0.9rem;">⚡</span> Welcome Back &bull; Active Author
            </span>
            <h1 class="hero-headline">
              Ready to write, <span>${currentUser.name}</span>?
            </h1>
            <p class="hero-description">
              You are signed in to your DevScribe author account. Publish technical deep-dives, track reader reactions, and inspect system architecture discussions.
            </p>

            <div class="hero-stats-row">
              <div class="hero-stat-item">
                <h3>REST API</h3>
                <p>Express Connected</p>
              </div>
              <div class="hero-stat-item">
                <h3>Verified</h3>
                <p>Active Profile</p>
              </div>
              <div class="hero-stat-item">
                <h3>Studio</h3>
                <p>Markdown Ready</p>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              <a href="create-blog.html" class="btn btn-primary btn-lg">
                <span>+ Write New Story</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="dashboard.html" class="btn btn-secondary btn-lg">My Dashboard</a>
            </div>
          </div>

          <div class="hero-profile-col">
            <div class="hero-profile-card">
              <div class="hero-avatar-frame">
                <img src="${currentUser.avatar || 'assets/kanak.jpg'}" alt="${currentUser.name}" class="hero-photo-img" onerror="this.src='assets/kanak.jpg'; this.onerror=null;" />
              </div>
              <h3>${currentUser.name}</h3>
              <p>${currentUser.handle || '@author'} &bull; Author</p>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
                ${currentUser.bio || "Writer and developer documenting software architecture."}
              </p>
              <div class="hero-social-links">
                <a href="dashboard.html" class="social-pill-link">Dashboard</a>
                <a href="create-blog.html" class="social-pill-link">+ Write</a>
                <a href="#" onclick="logoutUser(); return false;" class="social-pill-link" style="color: var(--color-danger);">Sign Out</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // --- GUEST VIEW (Not logged in) ---
    container.innerHTML = `
      <div class="hero-spotlight">
        <div class="hero-grid">
          <div class="hero-content-col">
            <span class="hero-author-badge">
              <span style="font-size: 0.9rem;">⚡</span> DevScribe &bull; Engineering Publication
            </span>
            <h1 class="hero-headline">
              Engineering <span>Resilient Systems</span> &amp; Modern Architecture.
            </h1>
            <p class="hero-description">
              An open technical publication featuring deep-dives on zero-dependency JavaScript, scalable distributed systems, and modern CSS architecture.
            </p>

            <div class="hero-stats-row">
              <div class="hero-stat-item">
                <h3>14.5K</h3>
                <p>Monthly Readers</p>
              </div>
              <div class="hero-stat-item">
                <h3>REST API</h3>
                <p>Express Backend</p>
              </div>
              <div class="hero-stat-item">
                <h3>Open Source</h3>
                <p>Architecture</p>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              <a href="register.html" class="btn btn-primary btn-lg">
                <span>Create Account &rarr;</span>
              </a>
              <a href="login.html" class="btn btn-secondary btn-lg">Sign In to Dashboard</a>
            </div>
          </div>

          <div class="hero-profile-col">
            <div class="hero-profile-card">
              <span class="badge badge-emerald" style="margin-bottom: 0.75rem; align-self: flex-start;">Featured Story</span>
              <h3 style="font-size: 1.2rem; line-height: 1.35; margin-bottom: 0.5rem; text-align: left;">
                ${topStory.title}
              </h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; text-align: left; line-height: 1.5;">
                ${topStory.excerpt}
              </p>
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 0.85rem; width: 100%;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <img src="${topStory.author ? topStory.author.avatar : 'assets/kanak.jpg'}" alt="${topStory.author ? topStory.author.name : 'Author'}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" onerror="this.src='assets/kanak.jpg'; this.onerror=null;" />
                  <div style="text-align: left;">
                    <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main);">${topStory.author ? topStory.author.name : 'Author'}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${topStory.readTime || '4 min read'}</div>
                  </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="openStoryReader('${topStory.id}')">Read &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
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

async function handleReaction(storyId, key, e) {
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

  // Sync to Express API
  try {
    await Api.reactToPost(storyId, key);
  } catch (err) {
    // Log silently
  }
}

function setupFilterChips() {
  document.querySelectorAll(".filter-chip-btn").forEach((chip) => {
    chip.addEventListener("click", async () => {
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

function openStoryReader(storyId) {
  const story = Storage.getStoryById(storyId);
  if (!story) return;

  currentOpenStoryId = storyId;
  story.views = (story.views || 0) + 1;
  Storage.saveStory(story);

  const modal = document.getElementById("reader-modal");
  const modalBody = document.getElementById("reader-modal-body");
  if (!modal || !modalBody) return;

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

async function handleCommentSubmit(e) {
  e.preventDefault();
  if (!currentOpenStoryId) return;

  const author = document.getElementById("comment-author").value.trim();
  const text = document.getElementById("comment-body").value.trim();
  if (!author || !text) return;

  const story = Storage.getStoryById(currentOpenStoryId);
  if (!story) return;

  if (!story.comments) story.comments = [];
  const newComment = {
    id: "c-" + Date.now(),
    author: author,
    text: text,
    date: new Date().toISOString()
  };
  story.comments.push(newComment);
  Storage.saveStory(story);

  document.getElementById("comment-body").value = "";
  document.getElementById("comments-container").innerHTML = renderComments(story.comments);
  showToast("Comment published! ✨", "success");

  // Sync to Express API
  try {
    await Api.addComment(currentOpenStoryId, author, text);
  } catch (err) {
    // Handled silently
  }
}

function copyShareableLink(id) {
  const url = window.location.href.split("?")[0] + `?story=${id}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast("Story URL copied to clipboard! 📋", "success");
  }).catch(() => {
    showToast("Link: " + url, "info");
  });
}

// Window exports for inline HTML onclick handlers
window.openStoryReader = openStoryReader;
window.closeStoryReader = closeStoryReader;
window.handleReaction = handleReaction;
window.handleCommentSubmit = handleCommentSubmit;
window.copyShareableLink = copyShareableLink;
window.resetFilters = resetFilters;
