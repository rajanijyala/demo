const Question = require("../models/Question");
const { generateQuestionPayloads } = require("../services/questionService");

const generateQuestions = async (req, res, next) => {
  try {
    const config = {
      role: req.body.role || "Full Stack Developer",
      experienceLevel: req.body.experienceLevel || "fresher",
      interviewType: req.body.interviewType || "mixed",
      questionCount: Math.min(Number(req.body.questionCount) || 6, 10)
    };
    const questions = await generateQuestionPayloads(config);
    res.status(201).json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

const getQuestions = async (req, res, next) => {
  try {
    const filter = {};

    ["role", "experienceLevel", "interviewType"].forEach((key) => {
      if (req.query[key]) {
        filter[key] = req.query[key];
      }
    });

    const questions = await Question.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateQuestions, getQuestions };
