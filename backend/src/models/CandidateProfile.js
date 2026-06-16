const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    targetRole: {
      type: String,
      trim: true,
      default: "Software Engineer"
    },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher"
    },
    preferredInterviewTypes: [{
      type: String,
      trim: true
    }],
    skills: [{
      type: String,
      trim: true
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("CandidateProfile", candidateProfileSchema);
