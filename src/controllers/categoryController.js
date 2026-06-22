const Category = require('../models/Category');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { category },
  });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  Object.assign(category, req.body);
  await category.save();

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  const postsCount = await Post.countDocuments({ category: category._id });

  if (postsCount > 0) {
    return next(new AppError('Category has posts and cannot be deleted', 400));
  }

  await category.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
};
