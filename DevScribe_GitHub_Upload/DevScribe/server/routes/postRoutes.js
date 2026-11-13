const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { optionalAuth, requireAuth } = require('../middleware/authMiddleware');

// Blog CRUD routes
router.get('/', postController.getPosts);
router.post('/', optionalAuth, postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', optionalAuth, postController.updatePost);
router.delete('/:id', optionalAuth, postController.deletePost);

// Social Engagement routes
router.post('/:id/react', postController.addReaction);
router.post('/:id/comments', postController.addComment);

module.exports = router;
