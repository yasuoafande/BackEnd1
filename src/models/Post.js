const mongoose = require('mongoose');
const slugify = require('slugify');

function calculateReadTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(Math.ceil(words / 200), 1);
}

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 3,
      maxlength: 140,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: 240,
    },
    body: {
      type: String,
      required: [true, 'Post body is required'],
      minlength: 20,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    readTime: {
      type: Number,
      default: 1,
    },
    publishedAt: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

PostSchema.index({ title: 'text', excerpt: 'text', body: 'text' });

PostSchema.pre('validate', function preparePost(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.isModified('body')) {
    this.readTime = calculateReadTime(this.body);
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

module.exports = mongoose.model('Post', PostSchema);
