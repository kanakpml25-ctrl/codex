/**
 * Kanak's DevChronicle - Dashboard Logic (dashboard.js)
 * Author Metrics, Tab Filters, Story Management Table, and Delete Modal.
 */

let activeDashboardTab = "all";
let storyPendingDeleteId = null;

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
  setupDashboardTabs();
});

function renderDashboard() {
  const user = Storage.getUser();
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

  if (avatarImg) avatarImg.src = user.avatar || "assets/kanak.jpg";
  if (nameEl) nameEl.textContent = user.name || "Kanak";
  if (handleEl) handleEl.textContent = user.handle || "@kanak_codes";
  if (bioEl) bioEl.textContent = user.bio || "Full Stack Software Engineer & Technical Writer.";
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
        <td colspan="5" style="text-align: center; padding: 3rem 1rem;">
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem;">
            No ${activeDashboardTab === 'all' ? '' : activeDashboardTab} stories found.
          </p>
          <a href="create-blog.html" class="btn btn-primary btn-sm">+ Draft a New Story</a>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered
    .map((story) => {
      const isDraft = story.status === "draft";
      const statusBadge = isDraft
        ? `<span class="badge badge-amber">Draft</span>`
        : `<span class="badge badge-emerald">Published</span>`;

      const rx = story.reactions || {};
      const reactionTotal = (rx.fire || 0) + (rx.insight || 0) + (rx.shipped || 0) + (rx.relatable || 0);

      return `
        <tr id="row-${story.id}">
          <td>
            <div class="table-story-cell">
              <img src="${story.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1100&q=80'}" alt="${story.title}" class="table-story-thumb" />
              <div>
                <a href="index.html" class="table-story-title">${story.title}</a>
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  ${story.category || 'Tech'} &bull; ${formatDate(story.createdAt)}
                </div>
              </div>
            </div>
          </td>
          <td>${statusBadge}</td>
          <td>
            <strong style="color: var(--text-main);">${(story.views || 0).toLocaleString()}</strong>
            <span style="font-size: 0.78rem; color: var(--text-muted);"> reads</span>
          </td>
          <td>
            <span style="font-weight: 700; color: var(--accent-primary);">⚡ ${reactionTotal}</span>
            <span style="color: var(--text-muted); font-size: 0.78rem; margin-left: 0.4rem;">💬 ${(story.comments && story.comments.length) || 0}</span>
          </td>
          <td>
            <div class="table-actions-cluster">
              <a href="create-blog.html?edit=${story.id}" class="action-btn-icon" title="Edit Story">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </a>
              <button class="action-btn-icon delete-btn" onclick="openDeleteDialog('${story.id}')" title="Delete Story">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function setupDashboardTabs() {
  document.querySelectorAll(".dash-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".dash-tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeDashboardTab = btn.getAttribute("data-tab");
      renderStoriesTable(Storage.getStories());
    });
  });
}

// Delete Dialog
function openDeleteDialog(storyId) {
  storyPendingDeleteId = storyId;
  const story = Storage.getStoryById(storyId);
  if (!story) return;

  const titleEl = document.getElementById("delete-story-name");
  if (titleEl) titleEl.textContent = `"${story.title}"`;

  const modal = document.getElementById("delete-modal");
  if (modal) modal.classList.add("active");
}

function closeDeleteDialog() {
  const modal = document.getElementById("delete-modal");
  if (modal) modal.classList.remove("active");
  storyPendingDeleteId = null;
}

function confirmDeleteStory() {
  if (!storyPendingDeleteId) return;

  Storage.deleteStory(storyPendingDeleteId);
  closeDeleteDialog();
  showToast("Story deleted from journal.", "info");
  renderDashboard();
}
