const Evaluation = require("../models/Evaluation");

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

const tokenize = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const hasStructure = (answer) =>
  /\b(first|second|finally|because|therefore|for example|result|impact)\b/i.test(answer);

const scoreResponse = (response) => {
  const answer = response.answer || "";
  const words = tokenize(answer);
  const uniqueWords = new Set(words);
  const question = response.question;
  const expectedSignals = [...(question?.skillTags || []), ...(question?.expectedSignals || [])];
  const signalHits = expectedSignals.filter((signal) =>
    words.includes(signal.toLowerCase()) || answer.toLowerCase().includes(signal.toLowerCase())
  ).length;
  const lengthScore = clamp((words.length / 90) * 70 + 20);
  const signalScore = clamp((signalHits / Math.max(expectedSignals.length, 1)) * 100);
  const lexicalScore = clamp((uniqueWords.size / Math.max(words.length, 1)) * 120);

  return {
    technicalAccuracy: clamp(signalScore * 0.55 + lengthScore * 0.45),
    communication: clamp((hasStructure(answer) ? 78 : 58) + Math.min(words.length, 120) * 0.12),
    problemSolving: clamp((/tradeoff|approach|debug|design|test|measure|because/i.test(answer) ? 76 : 55) + signalHits * 4),
    confidence: clamp((/\bi\b|\bwe\b|\bwould\b|\bwill\b/i.test(answer) ? 72 : 54) + Math.min(words.length, 100) * 0.1),
    completeness: clamp(lengthScore * 0.75 + lexicalScore * 0.25)
  };
};

const averageScores = (responses) => {
  if (!responses.length) {
    return {
      technicalAccuracy: 0,
      communication: 0,
      problemSolving: 0,
      confidence: 0,
      completeness: 0
    };
  }

  const totals = responses.reduce((acc, response) => {
    const scores = scoreResponse(response);
    Object.keys(scores).forEach((key) => {
      acc[key] = (acc[key] || 0) + scores[key];
    });
    return acc;
  }, {});

  Object.keys(totals).forEach((key) => {
    totals[key] = clamp(totals[key] / responses.length);
  });

  return totals;
};

const buildInsights = (scores) => {
  const labels = {
    technicalAccuracy: "Technical accuracy",
    communication: "Communication",
    problemSolving: "Problem solving",
    confidence: "Confidence",
    completeness: "Completeness"
  };
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const strengths = entries.slice(0, 2).map(([key]) => `${labels[key]} is a current strength.`);
  const weaknesses = entries.slice(-2).map(([key]) => `${labels[key]} needs more deliberate practice.`);
  const improvementAreas = entries
    .filter(([, score]) => score < 75)
    .map(([key]) => labels[key]);

  return {
    strengths,
    weaknesses,
    improvementAreas: improvementAreas.length ? improvementAreas : ["Advanced answer depth"]
  };
};

const generateEvaluation = async ({ userId, sessionId, responses }) => {
  const scores = averageScores(responses);
  const totalScore = clamp(Object.values(scores).reduce((sum, score) => sum + score, 0) / 5);
  const insights = buildInsights(scores);

  return Evaluation.findOneAndUpdate(
    { session: sessionId },
    {
      user: userId,
      session: sessionId,
      scores,
      totalScore,
      ...insights
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = { generateEvaluation };
