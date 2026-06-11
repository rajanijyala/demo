import Analytics from '../models/Analytics.js';
import Interview from '../models/Interview.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  let analytics = await Analytics.findOne({ userId: req.user._id });

  if (!analytics) {
    analytics = await Analytics.create({ userId: req.user._id });
  }

  const recentInterviews = await Interview.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5);

  const completedInterviews = await Interview.find({
    userId: req.user._id,
    status: 'completed',
  }).sort({ completedAt: -1 });

  const improvementRate =
    completedInterviews.length >= 2
      ? Math.round(
          ((completedInterviews[0].score - completedInterviews[completedInterviews.length - 1].score) /
            Math.max(completedInterviews[completedInterviews.length - 1].score, 1)) *
            100,
        )
      : 0;

  res.json({
    success: true,
    data: {
      totalInterviews: analytics.totalInterviews,
      averageScore: analytics.averageScore,
      completedInterviews: analytics.completedInterviews,
      improvementRate,
      strongestTopics: analytics.strongestTopics,
      weakestTopics: analytics.weakestTopics,
      scoreHistory: analytics.scoreHistory,
      topicScores: analytics.topicScores,
      recentInterviews,
    },
  });
});
