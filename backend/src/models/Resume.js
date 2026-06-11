import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    publicId: { type: String, default: '' },
    extractedText: { type: String, default: '' },
    score: { type: Number, default: 0 },
    skills: [{ type: String }],
    missingSkills: [{ type: String }],
    suggestions: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model('Resume', resumeSchema);
