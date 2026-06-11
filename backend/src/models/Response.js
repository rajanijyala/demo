import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: String, default: '' },
    aiFeedback: {
      technicalScore: { type: Number, default: 0 },
      communicationScore: { type: Number, default: 0 },
      confidenceScore: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      improvements: [{ type: String }],
    },
    score: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Response', responseSchema);
