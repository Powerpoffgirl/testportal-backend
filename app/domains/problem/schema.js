const mongoose = require('mongoose');
const { baseSchema } = require('../../libraries/db/base-schema');

const problemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  youtubeLink: { type: String, required: false }, // Optional
  leetCodeLink: { type: String, required: false }, // Optional
  articleLink: { type: String, required: false }, // Optional
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Tough'], required: true },
  isCompleted: { type: Boolean, default: false } // Checkbox for progress
});

problemSchema.add(baseSchema);

module.exports = mongoose.model('Problem', problemSchema);
