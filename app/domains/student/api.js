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

const model = "User";

// CRUD for entity
const routes = () =>
{
  const router = express.Router();
  logger.info(`Setting up routes for ${model}`);

  router.get("/", logRequest({}), authMiddleware, async (req, res, next) =>
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
    // authMiddleware,
    async (req, res, next) =>
    {
      try
      {
        // req.body.customerId = req.user.id;
        console.log(req.body);

        const result = await create(req.body);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  router.get(
    "/feeCollection",
    // logRequest({}),
    // validateRequest({ schema: idSchema, isParam: true }),
    authMiddleware,
    async (req, res, next) =>
    {
      try
      {
        console.log("----------REQUEST USER--------", req.user)
        const studentId = req.user.id;
        const result = await getFeeCollection(studentId);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  router.get(
    "/notification",
    authMiddleware,
    async (req, res, next) =>
    {
      try
      {
        console.log("----------REQUEST USER--------", req.user)
        const studentId = req.user.id;
        const result = await getNotification(studentId);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  router.get(
    "/teachers",
    authMiddleware,
    async (req, res, next) =>
    {
      try
      {
        console.log("----------REQUEST USER--------", req.user)
        const studentId = req.user.id;
        const result = await getTeachers(studentId);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  router.get(
    "/noticeboard",
    authMiddleware,
    async (req, res, next) =>
    {
      try
      {
        console.log("----------REQUEST USER--------", req.user)
        const studentId = req.user.id;
        const result = await getNoticeboard(studentId);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  // to see all family members
  router.get('/familymember', logRequest({}), async (req, res, next) =>
  {
    try
    {
      // TODO: Add pagination and filtering
      const items = await searchFamilyMember(req.query);
      res.status(200).json(items);
    } catch (error)
    {
      next(error);
    }
  });

  router.get(
    "/:id",
    logRequest({}),
    validateRequest({ schema: idSchema, isParam: true }),
    authMiddleware,
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
    // authMiddleware,
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
    authMiddleware,
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

  router.post(
    "/login",
    logRequest({}),
    validateRequest({ schema: loginSchema }),
    async (req, res, next) =>
    {
      try
      {
        const { email, password } = req.body;
        const result = await login(email, password);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );


  // To send OTP to User
  router.post(
    "/sendotp",
    logRequest({}),
    // validateRequest({ schema: createSchema }),
    // authMiddleware,
    async (req, res, next) =>
    {
      try
      {
        // We will get mobile number
        console.log(req.body);
        const { mobile } = req.body
        const result = await sendOTP(mobile);
        res.status(result.status).json(result);
      } catch (error)
      {
        next(error);
      }
    }
  );

  // To verify OTP & generate token to User
  router.post(
    "/verifyotp",
    logRequest({}),
    // validateRequest({ schema: createSchema }),
    // authMiddleware,
    async (req, res, next) =>
    {
      try
      {
        // We will get mobile number
        console.log(req.body);
        const { mobile, otp } = req.body
        const result = await verifyOTP(mobile, otp);
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
