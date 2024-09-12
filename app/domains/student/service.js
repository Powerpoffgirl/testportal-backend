const logger = require('../../libraries/log/logger');
const Model = require('./schema');
const { AppError } = require('../../libraries/error-handling/AppError');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const config = require('../../config');

const model = 'user';

const create = async (data) =>
{
  try
  {
    const existingStudent = await Model.findOne({ email: data.email });
    if (existingStudent)
    {
      return {
        status: 400,
        data: null,
        message: `${model} with this email already exists`
      };
    }

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const item = new Model({ ...data, password: hashedPassword });

    const saved = await item.save();
    logger.info(`create(): ${model} created`, {
      id: saved._id,
    });
    return {
      status: 201,
      data: { user: saved, generatedPassword: password },
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
    console.log("User: " + req.user.id)
    const { keyword } = req.query ?? {};
    const { id } = req.user; // Extract userId from req.user
    const filter = {
      customerId: id, // Ensure only students with the same userId are returned
    };

    if (keyword)
    {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    const items = await Model.find(filter).populate({
      path: 'progress.chaptersCovered',
      model: 'Chapter'
    })
      .populate({
        path: 'progress.topicsCovered',
        model: 'Topic'
      })
      .populate({
        path: 'progress.problemsCovered',
        model: 'Problem'
      });;
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
      path: 'progress.chaptersCovered',
      model: 'Chapter'
    })
      .populate({
        path: 'progress.topicsCovered',
        model: 'Topic'
      })
      .populate({
        path: 'progress.problemsCovered',
        model: 'Problem'
      });;
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
    const item = await Model.findByIdAndUpdate(id, data, { new: true })
      .populate({
        path: 'progress.chaptersCovered',
        model: 'Chapter'
      })
      .populate({
        path: 'progress.topicsCovered',
        model: 'Topic'
      })
      .populate({
        path: 'progress.problemsCovered',
        model: 'Problem'
      });
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

const login = async (email, password) =>
{
  try
  {
    const user = await Model.findOne({ email });
    if (!user)
    {
      return {
        status: 401,
        data: null,
        message: 'Invalid credentials: User not found',
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
    {
      return {
        status: 401,
        data: null,
        message: 'Invalid credentials: Password mismatch',
      };
    }

    const token = jwt.sign({ id: user._id, role: model }, config.JWT_SECRET, {
      expiresIn: '24h', // Adjust expiration time as needed
    });

    return {
      status: 200,
      data: { token, user },
      message: 'Login successful',
    };
  } catch (error)
  {
    logger.error(`login(): Failed to login ${model}`, error);
    throw new AppError(`Failed to login ${model}`, error.message);
  }
};


module.exports = {
  create,
  search,
  getById,
  updateById,
  deleteById,
  login
};
