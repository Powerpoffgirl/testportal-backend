const Joi = require("joi");
const mongoose = require("mongoose");

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  class: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
});

const updateSchema = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string().email(),
  class: Joi.string(),
  phoneNumber: Joi.string(),
  address: Joi.string(),
  password: Joi.string(), // Optional in update
  progress: Joi.object().keys({
    chaptersCovered: Joi.array().items(
      Joi.string().custom((value, helpers) =>
      {
        if (!mongoose.Types.ObjectId.isValid(value))
        {
          return helpers.error("any.invalid");
        }
        return value;
      }, "ObjectId validation")
    ),
    topicsCovered: Joi.array().items(
      Joi.string().custom((value, helpers) =>
      {
        if (!mongoose.Types.ObjectId.isValid(value))
        {
          return helpers.error("any.invalid");
        }
        return value;
      }, "ObjectId validation")
    ),
    problemsCovered: Joi.array().items(
      Joi.string().custom((value, helpers) =>
      {
        if (!mongoose.Types.ObjectId.isValid(value))
        {
          return helpers.error("any.invalid");
        }
        return value;
      }, "ObjectId validation")
    ),
  }),
  createdAt: Joi.date(),
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

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { createSchema, updateSchema, idSchema, loginSchema };
