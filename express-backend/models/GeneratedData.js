const mongoose = require('mongoose');

const generatedDataSchema = new mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const GeneratedData = mongoose.model('GeneratedData', generatedDataSchema);

module.exports = GeneratedData;
