const express = require('express');

const {
  createPost,
  deletePost,
  getMyPosts,
  getPost,
  getPosts,
  updatePost,
} = require('../controllers/postController');
const {
  createComment,
  deleteComment,
  getPostComments,
} = require('../controllers/commentController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createCommentSchema } = require('../validations/commentSchemas');
const { createPostSchema, updatePostSchema } = require('../validations/postSchemas');

const router = express.Router();

router
  .route('/')
  .get(getPosts)
  .post(protect, validate(createPostSchema), createPost);

router.get('/mine', protect, getMyPosts);
router.delete('/comments/:id', protect, deleteComment);

router
  .route('/:postId/comments')
  .get(getPostComments)
  .post(protect, validate(createCommentSchema), createComment);

router.get('/:slug', optionalAuth, getPost);

router
  .route('/:id')
  .patch(protect, validate(updatePostSchema), updatePost)
  .delete(protect, deletePost);

module.exports = router;
