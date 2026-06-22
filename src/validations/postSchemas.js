const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(140).required(),
  excerpt: Joi.string().trim().max(240).required(),
  body: Joi.string().min(20).required(),
  coverImage: Joi.string().trim().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim().max(40)).max(8).default([]),
  status: Joi.string().valid('draft', 'published').default('draft'),
  category: objectId.required(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(140),
  excerpt: Joi.string().trim().max(240),
  body: Joi.string().min(20),
  coverImage: Joi.string().trim().uri().allow('', null),
  tags: Joi.array().items(Joi.string().trim().max(40)).max(8),
  status: Joi.string().valid('draft', 'published'),
  category: objectId,
}).min(1);

module.exports = {
  createPostSchema,
  updatePostSchema,
};
