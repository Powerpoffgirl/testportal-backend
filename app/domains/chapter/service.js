const logger = require('../../libraries/log/logger');
const Model = require('./schema');
const { AppError } = require('../../libraries/error-handling/AppError');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const config = require('../../config');

const model = 'chapter';


const create = async (data) =>
{
  try
  {
    // Check if a customer with the same email already exists
    const existingchapter = await Model.findOne({ name: data.name });
    if (existingchapter)
    {
      return {
        status: 400,
        data: null,
        message: `${model} with this name already exists`
      };
    }
    const item = new Model(data);

    const saved = await item.save();
    logger.info(`create(): ${model} created`, {
      id: saved._id,
    });
    return {
      status: 201,
      data: saved,
      message: `${model} created successfully`
    };
  } catch (error)
  {
    logger.error(`create(): Failed to create ${model}`, error);
    throw new AppError(`Failed to create ${model}`, error.message);
  }
};

const search = async (req) =>
{
  try
  {

    const { keyword } = req.query ?? {};
    const filter = {};

    if (keyword)
    {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    const items = await Model.find(filter).populate({
      path: 'topics', // Correct path, as 'topics' is directly in the Chapter schema
      model: 'Topic'
    });

    logger.info('search(): filter and count', {
      filter,
      count: items.length,
    });

    return {
      status: 200,
      data: items,
      message: `${items.length} ${model}(s) found`,
    };
  } catch (error)
  {
    logger.error(`search(): Failed to search ${model}`, error);
    throw new AppError(`Failed to search ${model}`, error.message, 400);
  }
};


const getById = async (id) =>
{
  try
  {
    const item = await Model.findById(id).populate({
      path: 'topics', // Correct path, as 'topics' is directly in the Chapter schema
      model: 'Topic'
    });
    logger.info(`getById(): ${model} fetched`, { id });
    return {
      status: item ? 200 : 404,
      data: item,
      message: item ? `${model} fetched successfully` : `${model} not found`
    };
  } catch (error)
  {
    logger.error(`getById(): Failed to get ${model}`, error);
    throw new AppError(`Failed to get ${model}`, error.message);
  }
};

const updateById = async (id, data) =>
{
  try
  {
    const item = await Model.findByIdAndUpdate(id, data, { new: true });

    logger.info(`updateById(): ${model} updated`, { id });
    return {
      status: item ? 200 : 404,
      data: item,
      message: item ? `${model} updated successfully` : `${model} not found`
    };
  } catch (error)
  {
    logger.error(`updateById(): Failed to update ${model}`, error);
    throw new AppError(`Failed to update ${model}`, error.message);
  }
};

const deleteById = async (id) =>
{
  try
  {
    const item = await Model.findByIdAndDelete(id);
    logger.info(`deleteById(): ${model} deleted`, { id });
    return {
      status: item ? 200 : 404,
      data: null,
      message: item ? `${model} deleted successfully` : `${model} not found`
    };
  } catch (error)
  {
    logger.error(`deleteById(): Failed to delete ${model}`, error);
    throw new AppError(`Failed to delete ${model}`, error.message);
  }
};




module.exports = {
  create,
  search,
  getById,
  updateById,
  deleteById,
};
