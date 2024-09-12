const mongoose = require('mongoose');
const { baseSchema } = require('../../libraries/db/base-schema');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  // Track progress with topics/problems
  progress: {
    chaptersCovered: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    }],
    topicsCovered: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    }],
    problemsCovered: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }]
  }
});

schema.add(baseSchema);

module.exports = mongoose.model('User', schema);
