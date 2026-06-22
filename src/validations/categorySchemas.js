const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  description: Joi.string().trim().max(300).allow('', null),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  description: Joi.string().trim().max(300).allow('', null),
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
