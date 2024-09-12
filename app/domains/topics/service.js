const logger = require('../../libraries/log/logger');
const Model = require('./schema');
const ChapterModel = require('../chapter/schema')
const { AppError } = require('../../libraries/error-handling/AppError');

const model = 'topic';


const create = async (data) =>
{
  try
  {
    const existingTopic = await Model.findOne({ name: data.name });
    if (existingTopic)
    {
      return {
        status: 400,
        data: null,
        message: `Topic with the name "${data.name}" already exists`,
      };
    }

    // Create a new topic instance
    const newTopic = new Model({
      name: data.name,
      chapterId: data.chapterId, // Ensure chapterId is included in the data
      problems: data.problems || [], // Use an empty array if problems are not provided
    });

    // Save the new topic to the database
    const savedTopic = await newTopic.save();

    // Find and update the chapter with the new topic ID
    await ChapterModel.findByIdAndUpdate(
      data.chapterId, // The chapter ID
      { $push: { topics: savedTopic._id } }, // Add the new topic ID to the topics array
      { new: true } // Return the updated document
    ).populate({
      path: 'topics',
      model: 'Topic'
    });

    // Log the creation event
    logger.info('create(): Topic created and added to chapter', {
      id: savedTopic._id,
    });

    return {
      status: 201,
      data: savedTopic,
      message: 'Topic created and added to chapter successfully',
    };
  } catch (error)
  {
    // Log and throw an error if creation or update fails
    logger.error('create(): Failed to create topic or update chapter', error);
    throw new AppError('Failed to create topic or update chapter', error.message);
  }
};

const search = async (req) =>
{
  try
  {
    const { keyword } = req.query ?? {};
    const filter = {
    };

    if (keyword)
    {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    const items = await Model.find(filter)
      .populate({
        path: 'chapterId', // Path inside the 'Topic' model to populate 'Chapter'
        model: 'Chapter'
      })
      .populate({
        path: 'problems', // Path inside the 'Topic' model to populate 'Problem'
        model: 'Problem'
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
    // Fetch the item and populate related fields
    const item = await Model.findById(id)
      .populate('chapterId')  // Populate the Chapter reference
      .populate('problems');  // Populate the Problem references

    logger.info(`getById(): ${model} fetched`, { id });
    return {
      status: item ? 200 : 404,
      data: item,
      message: item ? `${model} fetched successfully` : `${model} not found`,
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
    const item = await Model.findByIdAndUpdate(id, data, { new: true }).populate({ path: 'Topic.chapterId', model: "Chapter" }, { path: 'Topic.problems', model: 'Problem' });
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
  deleteById
};
