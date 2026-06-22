const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Comment body is required'],
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['visible', 'hidden'],
      default: 'visible',
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Comment', CommentSchema);
