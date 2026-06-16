const mongoose = require("mongoose");

const feedbackReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
      unique: true
    },
    evaluation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evaluation",
      required: true
    },
    strengths: [String],
    weaknesses: [String],
    recommendedTopics: [String],
    interviewSummary: String,
    improvementSuggestions: [String],
    resumeMatchAnalysis: {
      score: Number,
      matchedSkills: [String],
      projectSignals: [String],
      experienceSignals: [String],
      summary: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedbackReport", feedbackReportSchema);
