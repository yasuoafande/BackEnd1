const express = require('express');

const {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} = require('../controllers/categoryController');
const { authorize, protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validations/categorySchemas');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), validate(createCategorySchema), createCategory);

router
  .route('/:id')
  .patch(protect, authorize('admin'), validate(updateCategorySchema), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
