const mongoose = require("mongoose");

const practiceTaskSchema = new mongoose.Schema(
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
    day: {
      type: Number,
      min: 1,
      max: 7,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    focusArea: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    },
    dueDate: Date
  },
  { timestamps: true }
);

practiceTaskSchema.index({ user: 1, session: 1, day: 1 }, { unique: true });

module.exports = mongoose.model("PracticeTask", practiceTaskSchema);
