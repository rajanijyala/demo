const InterviewSession = require("../models/InterviewSession");
const Evaluation = require("../models/Evaluation");
const PracticeTask = require("../models/PracticeTask");

const getDashboardAnalytics = async (userId) => {
  const [sessions, evaluations, tasks] = await Promise.all([
    InterviewSession.find({ user: userId }).sort({ createdAt: -1 }),
    Evaluation.find({ user: userId }).sort({ createdAt: 1 }),
    PracticeTask.find({ user: userId })
  ]);

  const completedSessions = sessions.filter((session) => ["submitted", "evaluated"].includes(session.status));
  const scores = evaluations.map((item) => item.totalScore);
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;

  return {
    totalInterviews: sessions.length,
    averageScore,
    bestScore,
    improvementTrend: evaluations.map((item, index) => ({
      label: `Interview ${index + 1}`,
      score: item.totalScore,
      date: item.createdAt
    })),
    practiceConsistency: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
    completionRate: sessions.length ? Math.round((completedSessions.length / sessions.length) * 100) : 0,
    recentSessions: sessions.slice(0, 5)
  };
};

module.exports = { getDashboardAnalytics };
