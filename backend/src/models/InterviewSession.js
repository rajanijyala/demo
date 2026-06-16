const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewTemplate"
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume"
    },
    source: {
      type: String,
      enum: ["standard", "resume"],
      default: "standard"
    },
    resumeSnapshot: {
      skills: [String],
      projects: [String],
      experience: [String],
      education: [String],
      summary: String,
      matchAnalysis: {
        score: Number,
        matchedSkills: [String],
        projectSignals: [String],
        experienceSignals: [String],
        summary: String
      }
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
    status: {
      type: String,
      enum: ["configured", "in_progress", "submitted", "evaluated"],
      default: "in_progress"
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: Date,
    completedAt: Date,
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }],
    currentQuestionIndex: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
