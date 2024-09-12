const { routes } = require('./api');

const defineRoutes = (expressRouter) =>
{
  expressRouter.use('/chapter', routes());
};

module.exports = defineRoutes;
