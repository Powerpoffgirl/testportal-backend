const express = require("express");
const logger = require("../../libraries/log/logger");

const {
  create,
  search,
  getById,
  updateById,
  deleteById,
  login,
  getFeeCollection,
  getNotification,
  getTeachers,
  getNoticeboard,
  searchFamilyMember,
  sendOTP,
  verifyOTP,

} = require("./service");

const {
  createSchema,
  updateSchema,
  idSchema,
  loginSchema,
} = require("./request");
const { validateRequest } = require("../../middlewares/request-validate");
const { logRequest } = require("../../middlewares/log");
const { authMiddleware } = require("../../middlewares/jwt");

const model = "problem";

// CRUD for entity
const routes = () =>
{
  const router = express.Router();
  logger.info(`Setting up routes for ${model}`);

  router.get("/", logRequest({}), async (req, res, next) =>
  {
    try
    {
      // TODO: Add pagination and filtering
      const result = await search(req);
      res.status(result.status).json(result);
    } catch (error)
    {
      next(error);
    }
  });

  router.post(
    "/",
    logRequest({}),
    validateRequest({ schema: createSchema }),
    async (req, res, next) =>
    {
      try
      {
        const result = await create(req.body);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  router.get(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    async (req, res, next) =>
    {
      try
      {
        const result = await getById(req.params.id);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  router.put(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    validateRequest({ schema: updateSchema }),
    async (req, res, next) =>
    {
      try
      {
        const result = await updateById(req.params.id, req.body);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  router.delete(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    async (req, res, next) =>
    {
      try
      {
        const result = await deleteById(req.params.id);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  return router;
};

module.exports = { routes };
