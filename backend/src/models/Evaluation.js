const mongoose = require("mongoose");

const categoryScoreSchema = new mongoose.Schema(
  {
    technicalAccuracy: Number,
    communication: Number,
    problemSolving: Number,
    confidence: Number,
    completeness: Number
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
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
    scores: {
      type: categoryScoreSchema,
      required: true
    },
    totalScore: {
      type: Number,
      required: true
    },
    strengths: [String],
    weaknesses: [String],
    improvementAreas: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
