const mongoose = require("mongoose");

const interviewTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      required: true
    },
    interviewType: {
      type: String,
      enum: ["technical", "behavioral", "hr", "system_design", "mixed"],
      required: true
    },
    durationMinutes: {
      type: Number,
      default: 30
    },
    questionCount: {
      type: Number,
      default: 6
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    isSystem: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewTemplate", interviewTemplateSchema);
