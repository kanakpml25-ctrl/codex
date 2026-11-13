/**
 * DevScribe by Kanak - Dashboard Logic (dashboard.js)
 * Connected to Node.js / Express.js REST API for Author Analytics & Story Management.
 * Protects route: redirects to login.html if not authenticated.
 */

let activeDashboardTab = "all";
let storyPendingDeleteId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const user = Storage.getUser();
  if (!user) {
    showToast("Please sign in to access your author dashboard.", "info");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 400);
    return;
  }

  setupDashboardTabs();
  await loadDashboardData();
});

async function loadDashboardData() {
  try {
    const apiPosts = await Api.getPosts();
    if (Array.isArray(apiPosts) && apiPosts.length > 0) {
      Storage.saveStories(apiPosts);
    }
  } catch (err) {
    console.warn("Using local stories in dashboard:", err.message);
  }

  renderDashboard();
}

function renderDashboard() {
  const user = Storage.getUser();
  if (!user) return;

  const stories = Storage.getStories();

  renderAuthorBanner(user);
  renderMetrics(stories);
  renderStoriesTable(stories);
}

function renderAuthorBanner(user) {
  const avatarImg = document.getElementById("dash-avatar-img");
  const nameEl = document.getElementById("dash-author-name");
  const handleEl = document.getElementById("dash-author-handle");
  const bioEl = document.getElementById("dash-author-bio");
  const headingEl = document.getElementById("dash-stories-heading");

  if (avatarImg) avatarImg.src = user.avatar || "assets/kanak.jpg";
  if (nameEl) nameEl.innerHTML = `${user.name} <span class="badge badge-emerald">${user.role || 'Verified Author'}</span>`;
  if (handleEl) handleEl.textContent = user.handle || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`;
  if (bioEl) bioEl.textContent = user.bio || "Author and developer on DevScribe.";
  if (headingEl) headingEl.textContent = `${user.name}'s Published Stories & Drafts`;
}

function renderMetrics(stories) {
  const totalCount = stories.length;
  const totalViews = stories.reduce((sum, s) => sum + (s.views || 0), 0);
  const totalReactions = stories.reduce((sum, s) => {
    const rx = s.reactions || {};
    return sum + (rx.fire || 0) + (rx.insight || 0) + (rx.shipped || 0) + (rx.relatable || 0);
  }, 0);
  const totalComments = stories.reduce((sum, s) => sum + ((s.comments && s.comments.length) || 0), 0);

  document.getElementById("stat-total-stories").textContent = totalCount;
  document.getElementById("stat-total-views").textContent = totalViews.toLocaleString();
  document.getElementById("stat-total-reactions").textContent = totalReactions.toLocaleString();
  document.getElementById("stat-total-comments").textContent = totalComments.toLocaleString();
}

function setupDashboardTabs() {
  document.querySelectorAll(".dash-tab-btn, .tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".dash-tab-btn, .tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeDashboardTab = btn.getAttribute("data-tab");
      renderStoriesTable(Storage.getStories());
    });
  });
}

function renderStoriesTable(stories) {
  const tbody = document.getElementById("stories-table-body");
  if (!tbody) return;

  let filtered = stories;
  if (activeDashboardTab === "published") {
    filtered = stories.filter((s) => s.status === "published");
  } else if (activeDashboardTab === "draft") {
    filtered = stories.filter((s) => s.status === "draft");
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          No stories found in this section. <a href="create-blog.html" style="color: var(--accent-primary); font-weight: 600;">Write one now &rarr;</a>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((story) => {
    const rx = story.reactions || {};
    const totalRx = (rx.fire || 0) + (rx.insight || 0) + (rx.shipped || 0) + (rx.relatable || 0);
    const commentCount = (story.comments && story.comments.length) || 0;
    const isPub = story.status === "published";

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem; margin-bottom: 0.2rem;">
            ${story.title}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            Category: <span style="color: var(--text-secondary);">${story.category || 'General'}</span> &bull; 
            Author: <span style="color: var(--accent-primary); font-weight: 600;">${story.author ? story.author.name : 'Author'}</span> &bull; 
            ${story.readTime || '3 min'}
          </div>
        </td>
        <td>
          <span class="badge ${isPub ? 'badge-emerald' : 'badge-amber'}">
            ${isPub ? 'Published' : 'Draft'}
          </span>
        </td>
        <td style="color: var(--text-secondary); font-size: 0.88rem;">
          ${(story.views || 0).toLocaleString()}
        </td>
        <td style="color: var(--accent-primary); font-weight: 600; font-size: 0.88rem;">
          🔥 ${totalRx} &bull; 💬 ${commentCount}
        </td>
        <td style="color: var(--text-muted); font-size: 0.82rem;">
          ${formatDate(story.createdAt)}
        </td>
        <td>
          <div class="row-actions">
            <a href="create-blog.html?id=${story.id}" class="action-btn" title="Edit Story">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </a>
            <button class="action-btn btn-danger-action" title="Delete Story" onclick="openDeleteDialog('${story.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// ============================================================================
// Delete Confirmation Dialog Logic (Connected to DELETE /api/posts/:id)
// ============================================================================
window.openDeleteDialog = function (storyId) {
  storyPendingDeleteId = storyId;
  const story = Storage.getStoryById(storyId);
  if (!story) return;

  const modal = document.getElementById("delete-modal");
  const nameEl = document.getElementById("delete-story-name");

  if (nameEl) nameEl.textContent = `"${story.title}"`;
  if (modal) modal.classList.add("active");
};

window.closeDeleteDialog = function () {
  storyPendingDeleteId = null;
  const modal = document.getElementById("delete-modal");
  if (modal) modal.classList.remove("active");
};

window.confirmDeleteStory = async function () {
  if (!storyPendingDeleteId) return;

  try {
    await Api.deletePost(storyPendingDeleteId);
    showToast("Story deleted from database.", "info");
  } catch (err) {
    console.warn("API delete failed, removing locally:", err.message);
    showToast("Story deleted.", "info");
  }

  Storage.deleteStory(storyPendingDeleteId);
  closeDeleteDialog();
  renderDashboard();
};
