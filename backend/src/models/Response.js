const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },
    answer: {
      type: String,
      default: ""
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    wordCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

responseSchema.index({ user: 1, session: 1, question: 1 }, { unique: true });

module.exports = mongoose.model("Response", responseSchema);
