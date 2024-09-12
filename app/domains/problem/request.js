const Joi = require("joi");
const mongoose = require("mongoose");

const createSchema = Joi.object().keys({
  name: Joi.string().required(),
  content: Joi.string().required(),
  topicId: Joi.string().custom((value, helpers) =>
  {
    if (!mongoose.Types.ObjectId.isValid(value))
    {
      return helpers.error("any.invalid");
    }
    return value;
  }, "ObjectId validation").required(),
  youtubeLink: Joi.string().uri().optional(),
  leetCodeLink: Joi.string().uri().optional(),
  articleLink: Joi.string().uri().optional(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Tough').required(),
  isCompleted: Joi.boolean().default(false),
});

const updateSchema = Joi.object().keys({
  name: Joi.string(),
  topicId: Joi.string().custom((value, helpers) =>
  {
    if (!mongoose.Types.ObjectId.isValid(value))
    {
      return helpers.error("any.invalid");
    }
    return value;
  }, "ObjectId validation"),
  youtubeLink: Joi.string().uri().optional(),
  leetCodeLink: Joi.string().uri().optional(),
  articleLink: Joi.string().uri().optional(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Tough'),
  isCompleted: Joi.boolean(),
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
