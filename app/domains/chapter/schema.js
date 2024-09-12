const mongoose = require('mongoose');
const { baseSchema } = require('../../libraries/db/base-schema');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }]
});

schema.add(baseSchema);

module.exports = mongoose.model('Chapter', schema);
