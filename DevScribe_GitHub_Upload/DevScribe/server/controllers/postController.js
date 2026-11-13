const db = require('../config/db');

// Helper to calculate reading time
const calculateReadTime = (text) => {
  if (!text) return '1 min read';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

/**
 * @route   POST /api/posts
 * @desc    Create a new blog post
 * @access  Private / Public with Author
 */
const createPost = (req, res) => {
  try {
    const { title, excerpt, content, category, tags, coverImage, status, author } = req.body;

    // 1. Validation
    if (!title || title.trim().length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Post title is required and must be at least 4 characters long.'
      });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required and must be at least 10 characters long.'
      });
    }

    // Determine author from authenticated session or request body or default Kanak
    let postAuthor = {
      name: 'Kanak',
      avatar: 'assets/kanak.jpg',
      handle: '@kanak_codes',
      role: 'Lead Author'
    };

    if (req.user) {
      postAuthor = {
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar || 'assets/kanak.jpg',
        handle: req.user.handle || '@' + req.user.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        role: req.user.role || 'Author'
      };
    } else if (author && author.name) {
      postAuthor = {
        name: author.name,
        avatar: author.avatar || 'assets/kanak.jpg',
        handle: author.handle || '@' + author.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        role: author.role || 'Contributor'
      };
    }

    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    const fallbackCover = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1100&q=80';

    const newPost = {
      id: 'story-' + Date.now(),
      title: cleanTitle,
      slug: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: category || 'Architecture',
      tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Engineering'],
      excerpt: excerpt ? excerpt.trim() : cleanContent.substring(0, 140) + '...',
      content: cleanContent,
      coverImage: coverImage && coverImage.trim() ? coverImage.trim() : fallbackCover,
      author: postAuthor,
      status: status === 'draft' ? 'draft' : 'published',
      readTime: calculateReadTime(cleanContent),
      createdAt: new Date().toISOString(),
      views: 0,
      reactions: { fire: 0, insight: 0, shipped: 0, relatable: 0 },
      comments: []
    };

    db.createPost(newPost);

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully!',
      post: newPost
    });
  } catch (err) {
    console.error('Create Post Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating blog post.'
    });
  }
};

/**
 * @route   GET /api/posts
 * @desc    Get all blog posts (supports ?category= & ?search= & ?status=)
 * @access  Public
 */
const getPosts = (req, res) => {
  try {
    const { category, search, status } = req.query;
    let posts = db.getPosts();

    // Filter by status (default returns all, or filter by published/draft)
    if (status) {
      posts = posts.filter((p) => p.status === status);
    }

    // Filter by category
    if (category && category !== 'All') {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search keyword
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          (p.author && p.author.name.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts: posts
    });
  } catch (err) {
    console.error('Get Posts Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog posts.'
    });
  }
};

/**
 * @route   GET /api/posts/:id
 * @desc    Get single blog post by ID (increments views)
 * @access  Public
 */
const getPostById = (req, res) => {
  try {
    const post = db.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    // Increment views
    post.views = (post.views || 0) + 1;
    db.updatePost(post.id, { views: post.views });

    return res.status(200).json({
      success: true,
      post: post
    });
  } catch (err) {
    console.error('Get Post By ID Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve post.'
    });
  }
};

/**
 * @route   PUT /api/posts/:id
 * @desc    Update an existing blog post
 * @access  Private / Public
 */
const updatePost = (req, res) => {
  try {
    const existing = db.findPostById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    const { title, excerpt, content, category, tags, coverImage, status } = req.body;
    const updates = {};

    if (title && title.trim()) {
      updates.title = title.trim();
      updates.slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (excerpt !== undefined) updates.excerpt = excerpt.trim();
    if (content && content.trim()) {
      updates.content = content.trim();
      updates.readTime = calculateReadTime(content.trim());
    }
    if (category) updates.category = category;
    if (Array.isArray(tags)) updates.tags = tags;
    if (coverImage) updates.coverImage = coverImage.trim();
    if (status) updates.status = status;
    updates.updatedAt = new Date().toISOString();

    const updatedPost = db.updatePost(req.params.id, updates);

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully!',
      post: updatedPost
    });
  } catch (err) {
    console.error('Update Post Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog post.'
    });
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a blog post
 * @access  Private / Public
 */
const deletePost = (req, res) => {
  try {
    const post = db.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    db.deletePost(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully!'
    });
  } catch (err) {
    console.error('Delete Post Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete post.'
    });
  }
};

/**
 * @route   POST /api/posts/:id/react
 * @desc    React to a post (fire, insight, shipped, relatable)
 * @access  Public
 */
const addReaction = (req, res) => {
  try {
    const post = db.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    const { reaction } = req.body; // 'fire' | 'insight' | 'shipped' | 'relatable'
    if (!['fire', 'insight', 'shipped', 'relatable'].includes(reaction)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reaction type. Must be 'fire', 'insight', 'shipped', or 'relatable'."
      });
    }

    if (!post.reactions) {
      post.reactions = { fire: 0, insight: 0, shipped: 0, relatable: 0 };
    }

    post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
    db.updatePost(post.id, { reactions: post.reactions });

    return res.status(200).json({
      success: true,
      reactions: post.reactions
    });
  } catch (err) {
    console.error('Add Reaction Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to record reaction.'
    });
  }
};

/**
 * @route   POST /api/posts/:id/comments
 * @desc    Add a comment to a post
 * @access  Public
 */
const addComment = (req, res) => {
  try {
    const post = db.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    const { author, text } = req.body;
    if (!author || !author.trim() || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Author name and comment text are required.'
      });
    }

    if (!post.comments) {
      post.comments = [];
    }

    const newComment = {
      id: 'c-' + Date.now(),
      author: author.trim(),
      text: text.trim(),
      date: new Date().toISOString()
    };

    post.comments.push(newComment);
    db.updatePost(post.id, { comments: post.comments });

    return res.status(201).json({
      success: true,
      comment: newComment,
      comments: post.comments
    });
  } catch (err) {
    console.error('Add Comment Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to add comment.'
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addReaction,
  addComment
};
