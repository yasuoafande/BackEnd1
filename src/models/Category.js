const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true },
);

CategorySchema.pre('validate', function setSlug(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});

module.exports = mongoose.model('Category', CategorySchema);
