import Interview from '../models/Interview.js';
import Question from '../models/Question.js';
import Response from '../models/Response.js';
import Analytics from '../models/Analytics.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateInterviewQuestions, generateAnswerFeedback } from '../services/aiService.js';

export const generateInterview = asyncHandler(async (req, res) => {
  const { role, experienceLevel, difficulty, technologies } = req.body;

  const aiQuestions = await generateInterviewQuestions({ role, experienceLevel, difficulty, technologies });

  const interview = await Interview.create({
    userId: req.user._id,
    title: `${role} Interview`,
    role,
    experienceLevel,
    difficulty,
    technologies,
  });

  const questions = await Question.insertMany(
    aiQuestions.map((q, i) => ({
      interviewId: interview._id,
      question: q.question,
      category: q.category,
      expectedAnswer: q.expectedAnswer || '',
      order: i,
    })),
  );

  res.status(201).json({
    success: true,
    data: { interview, questions },
  });
});

export const startInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');
  if (interview.status !== 'pending') throw new ApiError(400, 'Interview already started');

  interview.status = 'in-progress';
  interview.startedAt = new Date();
  await interview.save();

  const questions = await Question.find({ interviewId: interview._id }).sort({ order: 1 });

  res.json({ success: true, data: { interview, questions } });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionId, answer } = req.body;

  const question = await Question.findById(questionId);
  if (!question) throw new ApiError(404, 'Question not found');

  const interview = await Interview.findOne({ _id: question.interviewId, userId: req.user._id });
  if (!interview) throw new ApiError(403, 'Not authorized');

  const existingResponse = await Response.findOne({ questionId, interviewId: interview._id, userId: req.user._id });
  if (existingResponse) throw new ApiError(400, 'Answer already submitted for this question');

  let aiFeedback = {
    technicalScore: 0,
    communicationScore: 0,
    confidenceScore: 0,
    overallScore: 0,
    strengths: [],
    weaknesses: [],
    improvements: [],
  };

  try {
    aiFeedback = await generateAnswerFeedback({
      question: question.question,
      answer,
      role: interview.role,
      category: question.category,
    });
  } catch {
    // AI feedback is best-effort
  }

  const response = await Response.create({
    questionId,
    interviewId: interview._id,
    userId: req.user._id,
    answer,
    aiFeedback,
    score: aiFeedback.overallScore || 0,
  });

  res.status(201).json({ success: true, data: response });
});

export const finishInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');

  const responses = await Response.find({ interviewId: interview._id });
  const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
  const avgScore = responses.length > 0 ? Math.round(totalScore / responses.length) : 0;

  interview.status = 'completed';
  interview.completedAt = new Date();
  interview.score = avgScore;
  interview.duration = interview.startedAt
    ? Math.round((Date.now() - interview.startedAt.getTime()) / 1000)
    : 0;
  await interview.save();

  await updateAnalytics(req.user._id, interview);

  res.json({ success: true, data: interview });
});

export const getInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');

  const questions = await Question.find({ interviewId: interview._id }).sort({ order: 1 });
  const responses = await Response.find({ interviewId: interview._id });

  res.json({ success: true, data: { interview, questions, responses } });
});

export const getUserInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: interviews });
});

async function updateAnalytics(userId, interview) {
  let analytics = await Analytics.findOne({ userId });
  if (!analytics) {
    analytics = await Analytics.create({ userId });
  }

  analytics.totalInterviews += 1;
  if (interview.status === 'completed') analytics.completedInterviews += 1;

  analytics.scoreHistory.push({
    interviewId: interview._id,
    score: interview.score,
    date: new Date(),
  });

  const allScores = analytics.scoreHistory.map((h) => h.score);
  analytics.averageScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  const responses = await Response.find({ interviewId: interview._id }).populate('questionId');
  const topicMap = {};

  for (const r of responses) {
    const topic = r.questionId?.category || 'general';
    if (!topicMap[topic]) topicMap[topic] = { total: 0, count: 0 };
    topicMap[topic].total += r.score;
    topicMap[topic].count += 1;
  }

  for (const [topic, data] of Object.entries(topicMap)) {
    const existing = analytics.topicScores.find((t) => t.topic === topic);
    if (existing) {
      existing.averageScore = Math.round(
        (existing.averageScore * existing.attempts + data.total) / (existing.attempts + data.count),
      );
      existing.attempts += data.count;
    } else {
      analytics.topicScores.push({
        topic,
        averageScore: Math.round(data.total / data.count),
        attempts: data.count,
      });
    }
  }

  const sorted = [...analytics.topicScores].sort((a, b) => b.averageScore - a.averageScore);
  analytics.strongestTopics = sorted.slice(0, 3).map((t) => t.topic);
  analytics.weakestTopics = sorted.slice(-3).map((t) => t.topic);

  await analytics.save();
}
