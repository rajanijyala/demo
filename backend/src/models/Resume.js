const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    filePath: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      default: ""
    },
    parsed: {
      skills: [String],
      projects: [String],
      experience: [String],
      education: [String],
      summary: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
