import Resume from '../models/Resume.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';
import { analyzeResume } from '../services/aiService.js';

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');

  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'ai-interview-mocker/resumes',
    resource_type: 'auto',
  });

  const extractedText = req.body.extractedText || '';

  let analysis = { score: 0, skills: [], missingSkills: [], suggestions: [] };
  if (extractedText) {
    try {
      analysis = await analyzeResume(extractedText);
    } catch {
      // AI analysis is best-effort; proceed without it
    }
  }

  const resume = await Resume.create({
    userId: req.user._id,
    resumeUrl: result.secure_url,
    publicId: result.public_id,
    extractedText,
    score: analysis.score,
    skills: analysis.skills,
    missingSkills: analysis.missingSkills,
    suggestions: analysis.suggestions,
  });

  res.status(201).json({ success: true, data: resume });
});

export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: resumes });
});

export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) throw new ApiError(404, 'Resume not found');

  if (resume.publicId) {
    await cloudinary.uploader.destroy(resume.publicId);
  }

  await resume.deleteOne();
  res.json({ success: true, message: 'Resume deleted' });
});
