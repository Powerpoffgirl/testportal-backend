const studentRoutes = require('./student');
const chapterRoutes = require('./chapter');
const topicRoutes = require('./topics');
const problemRoutes = require('./problem')

const defineRoutes = async (expressRouter) =>
{
    topicRoutes(expressRouter);
    chapterRoutes(expressRouter);
    studentRoutes(expressRouter);
    problemRoutes(expressRouter);
};

module.exports = defineRoutes;
