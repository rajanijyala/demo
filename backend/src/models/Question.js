const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession"
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewTemplate"
    },
    prompt: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      trim: true
    },
    experienceLevel: {
      type: String,
      trim: true
    },
    interviewType: {
      type: String,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium"
    },
    skillTags: [{
      type: String,
      trim: true
    }],
    expectedSignals: [{
      type: String,
      trim: true
    }],
    source: {
      type: String,
      enum: ["openai", "fallback", "admin", "resume"],
      default: "fallback"
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
