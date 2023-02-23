const mongoose = require("mongoose");

const skillModuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    resourcesLinks: {
      type: [String],
    },
    description: {
      type: String,
    },
    parentModule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillModule",
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

const SkillModule = mongoose.model("SkillModule", skillModuleSchema);

module.exports = SkillModule;
