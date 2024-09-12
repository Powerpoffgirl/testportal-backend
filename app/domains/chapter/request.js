const Joi = require("joi");
const mongoose = require("mongoose");

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  content: Joi.string().required(),
  topics: Joi.array().items(
    Joi.string().custom((value, helpers) =>
    {
      if (!mongoose.Types.ObjectId.isValid(value))
      {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
  ) // Topics are not required for creation
});

const updateSchema = Joi.object().keys({
  name: Joi.string(),
  topics: Joi.array().items(
    Joi.string().custom((value, helpers) =>
    {
      if (!mongoose.Types.ObjectId.isValid(value))
      {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
  ), // Optional topics for update
  updatedAt: Joi.date(),
});

const idSchema = Joi.object().keys({
  id: Joi.string()
    .custom((value, helpers) =>
    {
      if (!mongoose.Types.ObjectId.isValid(value))
      {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
    .required(),
});

module.exports = { createSchema, updateSchema, idSchema };
