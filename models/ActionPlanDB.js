const mongoose = require('mongoose');
//const SkillModule = require('./SkillModule');

const actionPlanDB = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: true,
      unique: true
    },
    modules: {
      type: [Object]
    }
  },
  {
    timestamps: true
  }
);

module.exports = ActionPlanDB = mongoose.model('actionPlanDB', actionPlanDB);
