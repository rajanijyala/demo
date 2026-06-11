import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    experienceLevel: { type: String, enum: ['junior', 'mid', 'senior', 'lead'], default: 'mid' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    technologies: [{ type: String }],
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Interview', interviewSchema);
