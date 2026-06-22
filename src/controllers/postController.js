const mongoose = require('mongoose');

const Category = require('../models/Category');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const escapeRegExp = require('../utils/escapeRegExp');
const { buildMeta, getPagination } = require('../utils/pagination');

const postPopulate = [
  { path: 'author', select: 'name email' },
  { path: 'category', select: 'name slug' },
];

async function ensureCategoryExists(categoryId) {
  const exists = await Category.exists({ _id: categoryId });

  if (!exists) {
    throw new AppError('Category not found', 400);
  }
}

function canManagePost(user, post) {
  const authorId = post.author._id ? post.author._id.toString() : post.author.toString();
  return user.role === 'admin' || authorId === user._id.toString();
}

function createPublicFilter(query) {
  const filter = { status: 'published' };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.tag) {
    filter.tags = query.tag.toLowerCase();
  }

  if (query.search) {
    const search = new RegExp(escapeRegExp(query.search), 'i');
    filter.$or = [{ title: search }, { excerpt: search }, { body: search }];
  }

  return filter;
}

const getPosts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = createPublicFilter(req.query);

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(postPopulate),
    Post.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 'success',
    meta: buildMeta(total, page, limit),
    data: { posts },
  });
});

const getMyPosts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { author: req.user._id };

  if (['draft', 'published'].includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(postPopulate),
    Post.countDocuments(filter),
  ]);

  res.status(200).json({
    status: 'success',
    meta: buildMeta(total, page, limit),
    data: { posts },
  });
});

const getPost = asyncHandler(async (req, res, next) => {
  const query = mongoose.isValidObjectId(req.params.slug)
    ? { _id: req.params.slug }
    : { slug: req.params.slug };

  const post = await Post.findOne(query).populate(postPopulate);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const canReadDraft = req.user && canManagePost(req.user, post);

  if (post.status !== 'published' && !canReadDraft) {
    return next(new AppError('Post not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { post },
  });
});

const createPost = asyncHandler(async (req, res) => {
  await ensureCategoryExists(req.body.category);

  const post = await Post.create({
    ...req.body,
    author: req.user._id,
  });

  await post.populate(postPopulate);

  res.status(201).json({
    status: 'success',
    data: { post },
  });
});

const updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (!canManagePost(req.user, post)) {
    return next(new AppError('You can only update your own posts', 403));
  }

  if (req.body.category) {
    await ensureCategoryExists(req.body.category);
  }

  Object.assign(post, req.body);
  await post.save();
  await post.populate(postPopulate);

  res.status(200).json({
    status: 'success',
    data: { post },
  });
});

const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (!canManagePost(req.user, post)) {
    return next(new AppError('You can only delete your own posts', 403));
  }

  await post.deleteOne();
  await Comment.deleteMany({ post: post._id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createPost,
  deletePost,
  getMyPosts,
  getPost,
  getPosts,
  updatePost,
};
