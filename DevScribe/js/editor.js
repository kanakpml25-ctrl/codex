/**
 * DevScribe by Kanak - Editor Logic (editor.js)
 * Connected to Node.js / Express.js REST API for creating and editing blog posts.
 */

let storyTags = ["Architecture", "SystemDesign"];
let activeEditStoryId = null;

document.addEventListener("DOMContentLoaded", () => {
  const user = Storage.getUser();
  if (!user) {
    showToast("Please sign in or create an account to write stories.", "info");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 400);
    return;
  }

  checkForEditMode();
  setupToolbar();
  setupTagsSystem();
  setupWordAndSpeechCounters();
  setupCoverImageWatcher();
  setupViewModeToggle();
});

function checkForEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("edit") || urlParams.get("id");
  if (!editId) return;

  const story = Storage.getStoryById(editId);
  if (!story) return;

  activeEditStoryId = story.id;
  document.getElementById("editor-main-heading").textContent = "Edit Story";
  document.getElementById("btn-publish").innerHTML = `<span>Update Story</span>`;

  document.getElementById("story-title").value = story.title || "";
  document.getElementById("story-category").value = story.category || "Architecture";
  document.getElementById("story-excerpt").value = story.excerpt || "";
  document.getElementById("editor-textarea").value = story.content || "";
  document.getElementById("story-cover-url").value = story.coverImage || "";

  if (story.tags && Array.isArray(story.tags)) {
    storyTags = [...story.tags];
  }

  renderTagChips();
  updateCoverPreview(story.coverImage);
  updateMetrics();
}

function setupToolbar() {
  const textarea = document.getElementById("editor-textarea");
  if (!textarea) return;

  document.querySelectorAll(".tool-action-btn[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      applyMarkdownAction(textarea, action);
      updateMetrics();
    });
  });
}

function applyMarkdownAction(textarea, action) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const sel = text.substring(start, end);
  let insert = "";
  let cursorShift = 0;

  switch (action) {
    case "bold":
      insert = `**${sel || "bold text"}**`;
      cursorShift = 2;
      break;
    case "italic":
      insert = `*${sel || "italic text"}*`;
      cursorShift = 1;
      break;
    case "h2":
      insert = `\n## ${sel || "Architectural Pattern"}\n`;
      cursorShift = 4;
      break;
    case "h3":
      insert = `\n### ${sel || "Implementation Detail"}\n`;
      cursorShift = 5;
      break;
    case "code":
      insert = `\n\`\`\`javascript\n${sel || "// code implementation"}\n\`\`\`\n`;
      cursorShift = 15;
      break;
    case "quote":
      insert = `\n> ${sel || "Important technical insight..."}\n`;
      cursorShift = 3;
      break;
    case "link":
      insert = `[${sel || "Link label"}](https://github.com/kanakpml25-ctrl)`;
      break;
    case "list":
      insert = `\n- ${sel || "Benchmark step 1"}\n- Benchmark step 2\n`;
      break;
  }

  textarea.value = text.substring(0, start) + insert + text.substring(end);
  textarea.focus();
  textarea.setSelectionRange(start + cursorShift, start + insert.length - cursorShift);
}

function setupTagsSystem() {
  const tagInput = document.getElementById("tag-input-field");
  if (!tagInput) return;

  renderTagChips();

  tagInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.value.trim().replace(/^#|,/g, "");
      if (val && !storyTags.includes(val)) {
        storyTags.push(val);
        renderTagChips();
      }
      tagInput.value = "";
    } else if (e.key === "Backspace" && tagInput.value === "" && storyTags.length > 0) {
      storyTags.pop();
      renderTagChips();
    }
  });
}

function renderTagChips() {
  const container = document.getElementById("tag-chips-wrap");
  const input = document.getElementById("tag-input-field");
  if (!container || !input) return;

  container.querySelectorAll(".tag-chip").forEach((el) => el.remove());

  storyTags.forEach((tag, idx) => {
    const chip = document.createElement("span");
    chip.className = "tag-chip";
    chip.innerHTML = `
      #${tag}
      <button type="button" class="tag-remove" onclick="removeTag(${idx})">&times;</button>
    `;
    container.insertBefore(chip, input);
  });
}

function removeTag(idx) {
  storyTags.splice(idx, 1);
  renderTagChips();
}

function setupWordAndSpeechCounters() {
  const textarea = document.getElementById("editor-textarea");
  if (!textarea) return;

  textarea.addEventListener("input", updateMetrics);
}

function updateMetrics() {
  const textarea = document.getElementById("editor-textarea");
  const wordCountEl = document.getElementById("word-count-display");
  const readTimeEl = document.getElementById("read-time-display");

  if (!textarea || !wordCountEl || !readTimeEl) return;

  const words = textarea.value.trim() === "" ? 0 : textarea.value.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  wordCountEl.textContent = `${words} words`;
  readTimeEl.textContent = `${minutes} min read &bull; ~${minutes * 1.2} min audio`;
}

function setupCoverImageWatcher() {
  const input = document.getElementById("story-cover-url");
  if (!input) return;

  input.addEventListener("input", () => {
    updateCoverPreview(input.value.trim());
  });
}

function updateCoverPreview(url) {
  const img = document.getElementById("cover-preview-img");
  const empty = document.getElementById("cover-empty-msg");
  if (!img || !empty) return;

  if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image"))) {
    img.src = url;
    img.style.display = "block";
    empty.style.display = "none";
  } else {
    img.style.display = "none";
    empty.style.display = "block";
  }
}

function applyCoverPreset(type) {
  const input = document.getElementById("story-cover-url");
  if (!input) return;

  let url = "";
  if (type === "architecture") {
    url = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1100&q=80";
  } else if (type === "system") {
    url = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1100&q=80";
  } else if (type === "css") {
    url = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1100&q=80";
  }

  input.value = url;
  updateCoverPreview(url);
}

function setupViewModeToggle() {
  const writeBtn = document.getElementById("mode-write-btn");
  const previewBtn = document.getElementById("mode-preview-btn");
  const textarea = document.getElementById("editor-textarea");
  const previewPane = document.getElementById("editor-preview-pane");

  if (!writeBtn || !previewBtn || !textarea || !previewPane) return;

  writeBtn.addEventListener("click", () => {
    writeBtn.classList.add("active");
    previewBtn.classList.remove("active");
    textarea.classList.remove("hidden");
    previewPane.classList.remove("active");
  });

  previewBtn.addEventListener("click", () => {
    previewBtn.classList.add("active");
    writeBtn.classList.remove("active");
    textarea.classList.add("hidden");
    previewPane.classList.add("active");

    const raw = textarea.value || "*Start writing your technical article...*";
    previewPane.innerHTML = formatCustomMarkdown(raw);
  });
}

// ============================================================================
// Create Blog API Connection (POST /api/posts & PUT /api/posts/:id)
// ============================================================================
async function handleSaveStory(status = "published") {
  const title = document.getElementById("story-title").value.trim();
  const category = document.getElementById("story-category").value;
  const excerpt = document.getElementById("story-excerpt").value.trim();
  const content = document.getElementById("editor-textarea").value.trim();
  const cover = document.getElementById("story-cover-url").value.trim();

  if (title.length < 4) {
    showToast("Please enter an article title (at least 4 characters).", "error");
    document.getElementById("story-title").focus();
    return;
  }

  if (content.length < 10) {
    showToast("Please write some technical content before saving.", "error");
    document.getElementById("editor-textarea").focus();
    return;
  }

  const author = Storage.getUser();
  const fallbackCover = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1100&q=80";
  let existing = null;
  if (activeEditStoryId) {
    existing = Storage.getStoryById(activeEditStoryId);
  }

  const words = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

  const storyPayload = {
    title: title,
    category: category,
    tags: storyTags.length > 0 ? storyTags : ["Engineering"],
    excerpt: excerpt || content.substring(0, 140) + "...",
    content: content,
    coverImage: cover || (existing && existing.coverImage) || fallbackCover,
    author: {
      name: author.name || "Kanak",
      avatar: author.avatar || "assets/kanak.jpg",
      handle: author.handle || "@kanak_codes",
      role: "Lead Author"
    },
    status: status,
    readTime: readTime
  };

  showToast("Saving story via Express REST API...", "info", 1500);

  try {
    let savedStory;
    if (activeEditStoryId) {
      // PUT /api/posts/:id
      const res = await Api.updatePost(activeEditStoryId, storyPayload);
      savedStory = res.post;
    } else {
      // POST /api/posts
      const res = await Api.createPost(storyPayload);
      savedStory = res.post;
    }

    if (savedStory) {
      Storage.saveStory(savedStory);
      showToast(status === "draft" ? "Draft saved via Express API!" : "Story published to Express Backend! 🚀", "success");
    }
  } catch (err) {
    console.warn("API save failed, saving to local storage:", err.message);
    const localStory = {
      id: activeEditStoryId || "story-" + Date.now(),
      ...storyPayload,
      createdAt: (existing && existing.createdAt) || new Date().toISOString(),
      views: (existing && existing.views) || 0,
      reactions: (existing && existing.reactions) || { fire: 0, insight: 0, shipped: 0, relatable: 0 },
      comments: (existing && existing.comments) || []
    };
    Storage.saveStory(localStory);
    showToast(status === "draft" ? "Saved as draft (Local Mode)!" : "Story published (Local Mode)! 🚀", "success");
  }

  setTimeout(() => {
    window.location.href = status === "draft" ? "dashboard.html" : "index.html";
  }, 750);
}

// Window exports for inline HTML onclick handlers
window.handleSaveStory = handleSaveStory;
window.applyCoverPreset = applyCoverPreset;
window.removeTag = removeTag;
