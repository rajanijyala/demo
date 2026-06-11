import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
    question: { type: String, required: true },
    category: { type: String, enum: ['technical', 'hr', 'behavioral'], required: true },
    expectedAnswer: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Question', questionSchema);
