const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    about: {
      type: String,
      default: "I am Sajid Ullah, an IT student interested in Web Development, AI, Machine Learning, and real-world digital solutions."
    },

    skills: {
      type: [String],
      default: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "MongoDB", "Python", "Machine Learning"]
    },

    email: {
      type: String,
      default: "mrsajidullah143@gmail.com"
    },

    location: {
      type: String,
      default: "Pakistan"
    },

    linkedin: {
      type: String,
      default: "https://www.linkedin.com/in/sajid-ullah-18178628a/"
    },

    github: {
      type: String,
      default: "https://github.com/sajid-ullah143"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Setting", settingSchema);