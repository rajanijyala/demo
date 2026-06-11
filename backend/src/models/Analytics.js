import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    averageScore: { type: Number, default: 0 },
    strongestTopics: [{ type: String }],
    weakestTopics: [{ type: String }],
    totalInterviews: { type: Number, default: 0 },
    completedInterviews: { type: Number, default: 0 },
    scoreHistory: [
      {
        interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
        score: Number,
        date: { type: Date, default: Date.now },
      },
    ],
    topicScores: [
      {
        topic: String,
        averageScore: Number,
        attempts: Number,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('Analytics', analyticsSchema);
