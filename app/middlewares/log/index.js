const logger = require('../../libraries/log/logger');

// Middleware to log the request.
const logRequest = ({ fields = {} }) =>
{
  return (req, res, next) =>
  {
    try
    {
      // Initialize the log data object
      const logData = {};

      // Log params if they exist
      if (req.params)
      {
        logData.params = req.params;
      }

      // Log query if it exists
      if (req.query)
      {
        logData.query = req.query;
      }

      // Log body if it exists
      if (req.body)
      {
        if (fields && fields.length)
        {
          fields.forEach((field) =>
          {
            if (req.body[field] !== undefined)
            {
              logData[field] = req.body[field];
            }
          });
        } else
        {
          logData.body = req.body;
        }
      }

      // Log the request method and original URL
      console.log("LogData before logger.info:", logData); // Debugging point
      logger.info(`${req.method} ${req.originalUrl}`, logData);

      // Store the original end method for later
      const oldEnd = res.end;

      // Override the response's end method to log the response status
      res.end = function (...args)
      {
        logger.info(`${req.method} ${req.originalUrl}`, {
          statusCode: res.statusCode,
        });
        oldEnd.apply(this, args);
      };

      console.log("-----------------log request complete------------");
      next(); // Continue to the next middleware
    } catch (error)
    {
      console.error("Error in logRequest middleware:", error); // Log any errors
      next(error); // Pass the error to the next middleware
    }
  };
};

module.exports = { logRequest };
