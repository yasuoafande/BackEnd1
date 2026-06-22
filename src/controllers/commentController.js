const Comment = require('../models/Comment');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getPostComments = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post || post.status !== 'published') {
    return next(new AppError('Post not found', 404));
  }

  const comments = await Comment.find({
    post: post._id,
    status: 'visible',
  })
    .sort({ createdAt: -1 })
    .populate({ path: 'author', select: 'name' });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: { comments },
  });
});

const createComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post || post.status !== 'published') {
    return next(new AppError('Post not found', 404));
  }

  const comment = await Comment.create({
    body: req.body.body,
    post: post._id,
    author: req.user._id,
  });

  await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });
  await comment.populate({ path: 'author', select: 'name' });

  res.status(201).json({
    status: 'success',
    data: { comment },
  });
});

const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  const isOwner = comment.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError('You can only delete your own comments', 403));
  }

  await comment.deleteOne();

  if (comment.status === 'visible') {
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createComment,
  deleteComment,
  getPostComments,
};
