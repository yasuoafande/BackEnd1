const Joi = require('joi');

const createCommentSchema = Joi.object({
  body: Joi.string().trim().min(2).max(1000).required(),
});

module.exports = {
  createCommentSchema,
};
