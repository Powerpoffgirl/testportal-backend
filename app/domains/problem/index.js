const { routes } = require('./api');

const defineRoutes = (expressRouter) =>
{
  expressRouter.use('/problem', routes());
};

module.exports = defineRoutes;
