const mongoose = require('mongoose');

const revDBSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true
  },
  reviewers: {
    type: [String]
  },
  strengths: {
    type: [String]
  },
  areaOfImprovement: {
    type: [String]
  },
  strengthWithFlags: {
    type: [String]
  }
}, {
  timestamps: true
});

module.exports = RevDB = mongoose.model('revDB', revDBSchema);
