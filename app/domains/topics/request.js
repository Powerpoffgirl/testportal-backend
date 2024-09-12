const Joi = require("joi");
const mongoose = require("mongoose");

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  chapterId: Joi.string()
    .custom((value, helpers) =>
    {
      if (!mongoose.Types.ObjectId.isValid(value))
      {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
    .required(),
  problems: Joi.array().items(
    Joi.string().custom((value, helpers) =>
    {
      if (!mongoose.Types.ObjectId.isValid(value))
      {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
  ).optional() // Optional problems
});

const updateSchema = Joi.object().keys({
  name: Joi.string(),
  chapterId: Joi.string()
    .custom((value, helpers) =>
    {
      if (!mongoose.Types.ObjectId.isValid(value))
      {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation"),
  problems: Joi.array().items(
    Joi.string().custom((value, helpers) =>
    {
      if (!mongoose.Types.ObjectId.isValid(value))
      {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
  ).optional(), // Optional problems
  updatedAt: Joi.date()
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
    .required()
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { createSchema, updateSchema, idSchema, loginSchema };
