const jwt = require("jsonwebtoken");
const { AppError } = require("../../libraries/error-handling/AppError");
const logger = require("../../libraries/log/logger");
const config = require("../../config");

const authMiddleware = (req, res, next) =>
{
  console.log("Auth middleware executed");
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith("Bearer "))
  {
    logger.error("authMiddleware: No token provided");
    return res.status(401).send({
      status: 401,
      message: "Invalid token",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try
  {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (decoded)
    {
      req.user = decoded; // Attach the decoded user information to the request object
      logger.info("authMiddleware: Token verified successfully", {
        userId: decoded.userId,
        role: decoded.role,
      });
      next(); // Proceed to the next middleware or route handler
    } else
    {
      logger.error("authMiddleware: Invalid token");
      return res.status(401).send({
        status: 401,
        message: "Invalid token",
        data: null,
      });
    }
  } catch (error)
  {
    if (error.name === "TokenExpiredError")
    {
      logger.error("authMiddleware: Token expired", {
        expiredAt: error.expiredAt,
      });
      return res.status(401).send({
        status: 401,
        message: "Token expired",
        data: null,
      });
    } else
    {
      logger.error("authMiddleware: Invalid token", error);
      return res.status(401).send({
        status: 401,
        message: "Invalid token",
        data: null,
      });
    }
  }
};

module.exports = { authMiddleware };
