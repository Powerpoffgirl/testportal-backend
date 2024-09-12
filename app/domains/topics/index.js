const { routes } = require('./api');

const defineRoutes = (expressRouter) =>
{
  expressRouter.use('/topic', routes());
};

module.exports = defineRoutes;
