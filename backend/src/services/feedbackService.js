const FeedbackReport = require("../models/FeedbackReport");

const topicMap = {
  "Technical accuracy": "Core concepts and role-specific fundamentals",
  Communication: "STAR answer structure and concise delivery",
  "Problem solving": "Debugging frameworks and tradeoff analysis",
  Confidence: "Mock speaking practice and assertive framing",
  Completeness: "Answer depth with measurable outcomes",
  "Advanced answer depth": "Advanced examples and follow-up handling"
};

const generateFeedbackReport = async ({ userId, session, evaluation }) => {
  const recommendedTopics = evaluation.improvementAreas.map((area) => topicMap[area] || area);
  const interviewSummary = `You completed a ${session.interviewType.replace("_", " ")} interview for ${session.role} at ${session.experienceLevel} level with a total score of ${evaluation.totalScore}.`;
  const improvementSuggestions = evaluation.improvementAreas.map(
    (area) => `Practice ${area.toLowerCase()} by answering with context, action, reasoning, and measurable result.`
  );
  const resumeMatchAnalysis = session.resumeSnapshot?.matchAnalysis;

  return FeedbackReport.findOneAndUpdate(
    { session: session._id },
    {
      user: userId,
      session: session._id,
      evaluation: evaluation._id,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      recommendedTopics,
      interviewSummary,
      improvementSuggestions,
      resumeMatchAnalysis
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = { generateFeedbackReport };
