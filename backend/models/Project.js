const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    tech: {
      type: String,
      required: true,
      trim: true
    },

    link: {
      type: String,
      default: "#"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);