const mongoose = require('mongoose');

const devGoals = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true
    },
    goals: {
      type: [{}] //array of objects not string
    }
  },
  {
    timestamps: true
  }
);

module.exports = DevGoals = mongoose.model('devGoals', devGoals);
