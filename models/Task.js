const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required:true
  },
  completedDateTime: {
    type: Date
  },
  progressPercentage: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  goal: {
    type: String,
  },
  endDate: {
    type: Date,
    required: true
  },
  assignedToId:{
    type: String,
    required: true,
  },
  assignedFromId:{
    type: String,
    required: true,
  },
  assignedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  status: {
    type: String
  },
}, {
  timestamps: true
});

module.exports = Task = mongoose.model('task', TaskSchema);
